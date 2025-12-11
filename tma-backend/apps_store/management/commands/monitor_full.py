import os
import re
import asyncio
import requests
import logging
from bs4 import BeautifulSoup
from telethon import TelegramClient, events
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from asgiref.sync import sync_to_async
# Импортируем новую модель TelegramSource
from apps_store.models import TelegramApp, SubCategory, TelegramSource 
from apps_store.ai_service import process_app_with_ai

class Command(BaseCommand):
    help = 'МОНИТОР: Слушает каналы из таблицы TelegramSource и постит новинки'

    def handle(self, *args, **options):
        # 1. Загружаем конфиги
        self.api_id = os.getenv("TELEGRAM_API_ID")
        self.api_hash = os.getenv("TELEGRAM_API_HASH")
        self.bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
        self.target_channel_id = os.getenv("TELEGRAM_CHANNEL_ID")
        
        if not all([self.api_id, self.api_hash, self.bot_token, self.target_channel_id]):
            self.stdout.write(self.style.ERROR("❌ Ошибка: Проверь .env (API_ID, HASH, BOT_TOKEN, CHANNEL_ID)"))
            return

        # 2. ПОЛУЧАЕМ СПИСОК КАНАЛОВ ИЗ НОВОЙ ТАБЛИЦЫ
        db_sources = TelegramSource.objects.filter(is_active=True)
        channels_to_watch = []
        
        print("\n📡 [SYSTEM] Загружаю список каналов из таблицы TelegramSource...")
        for src in db_sources:
            # Вытаскиваем юзернейм из ссылки
            match = re.search(r'(?:t\.me|telegram\.me)/([a-zA-Z0-9_]+)', src.url)
            if match:
                username = match.group(1)
                channels_to_watch.append(username)
                print(f"   ✅ Добавлен в прослушку: @{username} ({src.title})")
            else:
                print(f"   ⚠️ Ссылка некорректна (нужна t.me/...): {src.url}")

        if not channels_to_watch:
            self.stdout.write(self.style.WARNING("⚠️ В базе нет активных Telegram-источников! Добавь их в админке."))
            # Мы не останавливаем скрипт, чтобы ты мог добавить каналы и перезапустить позже
        
        # 3. Запускаем Клиент
        # Важно: имя сессии 'monitor_realtime', чтобы не путать со старыми
        client = TelegramClient('monitor_realtime_session', int(self.api_id), self.api_hash)

        @client.on(events.NewMessage(chats=channels_to_watch))
        async def tg_handler(event):
            try:
                text = event.message.message
                chat = await event.get_chat()
                chat_title = chat.username or chat.title
                
                if not text: return
                
                print(f"\n🔔 [NEW POST] Источник: @{chat_title}")

                # Ищем любые юзернеймы и ссылки
                usernames = re.findall(r'@([a-zA-Z0-9_]+)', text)
                links = re.findall(r'(?:t\.me|telegram\.me)/([a-zA-Z0-9_]+)', text)
                
                # Фильтр мусора
                ignore_list = {'kb', 'proxy', 'socks', 'share', 'addstickers', 'iv', 'botfather'} 
                found_candidates = set(usernames + links) - ignore_list

                if found_candidates:
                    print(f"   🔎 Найдены упоминания: {found_candidates}")
                    for username in found_candidates:
                        await self.process_app_async(client, username)
                else:
                    print("   ❌ Ссылок на приложения в посте не найдено.")

            except Exception as e:
                print(f"❌ [TG Error]: {e}")

        # --- СТАРТ ---
        self.stdout.write(self.style.SUCCESS(f"🚀 МОНИТОР ЗАПУЩЕН. Активных каналов: {len(channels_to_watch)}"))
        client.start()
        client.run_until_disconnected()

    # === ЛОГИКА ОБРАБОТКИ (Такая же, как и была) ===
    async def process_app_async(self, client, username):
        # Проверка в БД
        exists = await sync_to_async(TelegramApp.objects.filter(username=f"@{username}").exists)()
        if exists: 
            print(f"   ⏭️  @{username} уже есть в каталоге. Пропуск.")
            return

        print(f"   ✨ Анализ кандидата: @{username}")
        
        try:
            try:
                entity = await client.get_entity(username)
            except ValueError:
                print(f"      ⚠️ Не удалось найти @{username} (возможно, приватный или не существует).")
                return

            if not getattr(entity, 'bot', False): 
                print(f"      🚫 Это пользователь/канал, а не бот. Пропуск.")
                return

            from telethon.tl.functions.users import GetFullUserRequest
            full_user = await client(GetFullUserRequest(entity))
            
            raw_desc = full_user.full_user.about or ""
            raw_title = f"{entity.first_name} {entity.last_name or ''}".strip()
            
            await sync_to_async(self.save_app_with_ai)(username, raw_title, raw_desc)
            
        except Exception as e:
            print(f"   ⚠️ Ошибка Telethon: {e}")
            
    def save_app_with_ai(self, username, raw_title, raw_desc):
        print(f"      🤖 Отправляю в AI для описания...")
        ai_data = process_app_with_ai(raw_title, raw_desc)
        
        if not ai_data:
            print("      🚫 AI отклонил приложение (Скам или ошибка).")
            return

        target_sub = None
        if ai_data.get('subcategory'):
            target_sub = SubCategory.objects.filter(name__iexact=ai_data.get('subcategory')).first()
        if not target_sub:
            target_sub = SubCategory.objects.first()

        app = TelegramApp.objects.create(
            username=f"@{username}",
            telegram_url=f"https://t.me/{username}",
            title_en=ai_data.get('title_en', raw_title),
            title_ru=ai_data.get('title_ru', raw_title),
            description_en=ai_data.get('description_en', raw_desc),
            description_ru=ai_data.get('description_ru', raw_desc),
            short_description_en=ai_data.get('short_description_en', ''),
            short_description_ru=ai_data.get('short_description_ru', ''),
            subcategory=target_sub,
            is_ai_processed=True,
            rating=5.0, # Ставим 5.0 для новинок
            users_count_str="New 🔥"
        )
        
        # Скачиваем иконку
        icon_path = None
        try:
            print("      🖼️ Скачиваю иконку...")
            r = requests.get(f"https://t.me/{username}")
            if r.status_code == 200:
                soup = BeautifulSoup(r.text, 'html.parser')
                img_meta = soup.find('meta', property='og:image')
                if img_meta:
                    img_res = requests.get(img_meta['content'])
                    if img_res.status_code == 200:
                        app.icon.save(f"{username}.jpg", ContentFile(img_res.content), save=True)
                        icon_path = app.icon.path
        except Exception: pass

        print(f"      ✅ УСПЕХ! Приложение добавлено (ID: {app.id})")
        self.send_to_telegram_channel(app, icon_path)

    def send_to_telegram_channel(self, app, icon_path):
        if not self.bot_token or not self.target_channel_id: return

        cat_name = app.subcategory.name_ru if app.subcategory and app.subcategory.name_ru else "Приложения"
        
        caption = (
            f"🔥 <b>Новинка: {app.title_ru}</b>\n\n"
            f"{app.short_description_ru}\n\n"
            f"📂 <b>Категория:</b> #{cat_name.replace(' ', '_')}\n"
            f"👇 <b>Запустить:</b>\n"
            f"{app.telegram_url}"
        )

        try:
            url_photo = f"https://api.telegram.org/bot{self.bot_token}/sendPhoto"
            url_msg = f"https://api.telegram.org/bot{self.bot_token}/sendMessage"
            
            import json
            markup_json = json.dumps({"inline_keyboard": [[{"text": "🚀 Запустить", "url": app.telegram_url}]]})

            if icon_path and os.path.exists(icon_path):
                with open(icon_path, 'rb') as f:
                    requests.post(url_photo, data={"chat_id": self.target_channel_id, "caption": caption, "parse_mode": "HTML", "reply_markup": markup_json}, files={'photo': f})
            else:
                requests.post(url_msg, data={"chat_id": self.target_channel_id, "text": caption, "parse_mode": "HTML", "reply_markup": markup_json})
            
            print(f"      📢 Опубликовано в канал!")
        except Exception as e:
            print(f"      ❌ Ошибка постинга в канал: {e}")