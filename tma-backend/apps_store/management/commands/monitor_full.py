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
from apps_store.models import TelegramApp, SubCategory
from apps_store.ai_service import process_app_with_ai

# Убрали все лишние каналы. Оставляем список пустым, 
# так как мы будем добавлять только ваш канал из .env
BASE_CHANNELS = [] 

class Command(BaseCommand):
    help = 'ТЕСТОВЫЙ МОНИТОР: Слушает ТОЛЬКО один канал из .env'

    def handle(self, *args, **options):
        # 1. Загружаем конфиги
        self.api_id = os.getenv("TELEGRAM_API_ID")
        self.api_hash = os.getenv("TELEGRAM_API_HASH")
        self.bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
        self.channel_id = os.getenv("TELEGRAM_CHANNEL_ID")
        
        if not all([self.api_id, self.api_hash, self.bot_token, self.channel_id]):
            self.stdout.write(self.style.ERROR("❌ Ошибка: Проверь .env (нужны API_ID, API_HASH, BOT_TOKEN, CHANNEL_ID)"))
            return

        try:
            self.channel_id_int = int(self.channel_id)
        except:
            self.stdout.write(self.style.ERROR("❌ TELEGRAM_CHANNEL_ID должен быть числом (начинается с -100)"))
            return

        # 2. Формируем список: ТОЛЬКО ваш канал
        channels_to_watch = [self.channel_id_int]

        # 3. Запускаем Userbot
        client = TelegramClient('monitor_full_session', int(self.api_id), self.api_hash)

        # --- ХЕНДЛЕР ---
        @client.on(events.NewMessage(chats=channels_to_watch))
        async def tg_handler(event):
            try:
                # Игнорируем свои же сообщения от бота
                sender = await event.get_sender()
                if sender and getattr(sender, 'bot', False):
                    return

                text = event.message.message
                if not text: return
                
                print(f"\n🔔 [СЛУШАТЕЛЬ] Новый пост в ВАШЕМ канале!")

                # Ищем ссылки на ботов
                usernames = re.findall(r'@([a-zA-Z0-9_]+bot)', text, re.IGNORECASE)
                links = re.findall(r'(?:t\.me|telegram\.me)/([a-zA-Z0-9_]+bot)', text, re.IGNORECASE)
                found_apps = set(usernames + links)

                if found_apps:
                    for username in found_apps:
                        await self.process_app_async(client, username)
                else:
                    print("   ❌ В посте нет ссылки на бота. Пропускаю.")

            except Exception as e:
                print(f"❌ [TG Error]: {e}")

        # --- СТАРТ ---
        self.stdout.write(self.style.SUCCESS("🚀 РЕЖИМ ТЕСТИРОВАНИЯ ЗАПУЩЕН"))
        self.stdout.write(f"👀 Слушаю ТОЛЬКО канал ID: {self.channel_id}")
        self.stdout.write(f"🌍 Веб-сканер сайтов ОТКЛЮЧЕН.")

        # Веб-сканер отключен (не запускаем create_task для него)
        client.start()
        client.run_until_disconnected()

    # === ОБРАБОТКА ===
    async def process_app_async(self, client, username):
        # Быстрая проверка
        exists = await sync_to_async(TelegramApp.objects.filter(username=f"@{username}").exists)()
        if exists: 
            print(f"   ⏭️  @{username} уже есть в базе.")
            return

        print(f"   ✨ Найден новый: @{username}")
        
        try:
            # Пытаемся получить инфу через Telegram API
            entity = await client.get_entity(username)
            if not getattr(entity, 'bot', False): return

            from telethon.tl.functions.users import GetFullUserRequest
            full_user = await client(GetFullUserRequest(entity))
            
            raw_desc = full_user.full_user.about or ""
            raw_title = f"{entity.first_name} {entity.last_name or ''}".strip()
            
            await sync_to_async(self.save_app_with_ai)(username, raw_title, raw_desc)
            
        except Exception as e:
            print(f"   ⚠️ Ошибка получения данных: {e}")
            # В тестовом режиме лучше пропустить, если не удалось получить данные чисто
            
    def save_app_with_ai(self, username, raw_title, raw_desc):
        if TelegramApp.objects.filter(username=f"@{username}").exists(): return

        print(f"      🤖 AI Генерация контента...")
        ai_data = process_app_with_ai(raw_title, raw_desc)
        
        if not ai_data:
            print("      🚫 AI отклонил (Unsafe/Error)")
            return

        # Категория (упрощенный поиск)
        target_sub = None
        if ai_data.get('subcategory'):
            target_sub = SubCategory.objects.filter(name__iexact=ai_data.get('subcategory')).first()
        if not target_sub:
            target_sub = SubCategory.objects.first()

        # Создаем
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
            rating=0.0,
            users_count_str="New 🔥"
        )
        
        # Иконка
        icon_path = None
        try:
            r = requests.get(f"https://t.me/{username}")
            if r.status_code == 200:
                soup = BeautifulSoup(r.text, 'html.parser')
                img_meta = soup.find('meta', property='og:image')
                if img_meta:
                    img_res = requests.get(img_meta['content'])
                    if img_res.status_code == 200:
                        app.icon.save(f"{username}.jpg", ContentFile(img_res.content), save=True)
                        icon_path = app.icon.path
        except: pass

        print(f"      ✅ Сохранено в БД! (ID: {app.id})")
        
        # Постинг
        self.send_to_telegram_channel(app, icon_path)

    def send_to_telegram_channel(self, app, icon_path):
        if not self.bot_token or not self.channel_id: return

        cat_name = app.subcategory.parent_category.name_ru if app.subcategory else "Приложения"
        
        caption = (
            f"🔥 <b>Новинка: {app.title_ru}</b>\n\n"
            f"{app.short_description_ru}\n\n"
            f"📂 <b>Категория:</b> #{cat_name.replace(' ', '_')}\n\n"
            f"👇 <b>Попробовать:</b>\n"
            f"{app.telegram_url}"
        )

        try:
            url_photo = f"https://api.telegram.org/bot{self.bot_token}/sendPhoto"
            url_msg = f"https://api.telegram.org/bot{self.bot_token}/sendMessage"
            
            # Кнопка
            reply_markup = {
                "inline_keyboard": [[
                    {"text": "🚀 Запустить (Launch)", "url": app.telegram_url}
                ]]
            }
            markup_json = str(reply_markup).replace("'", '"')

            if icon_path and os.path.exists(icon_path):
                with open(icon_path, 'rb') as f:
                    requests.post(url_photo, data={
                        "chat_id": self.channel_id,
                        "caption": caption,
                        "parse_mode": "HTML",
                        "reply_markup": markup_json
                    }, files={'photo': f})
            else:
                requests.post(url_msg, data={
                    "chat_id": self.channel_id,
                    "text": caption,
                    "parse_mode": "HTML",
                    "reply_markup": markup_json
                })
            
            print(f"      📢 ОПУБЛИКОВАНО В ВАШЕМ КАНАЛЕ!")

        except Exception as e:
            print(f"      ❌ Ошибка постинга: {e}")