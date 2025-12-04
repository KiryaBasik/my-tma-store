import os
import re
import asyncio
from telethon import TelegramClient, events
from django.core.management.base import BaseCommand
from asgiref.sync import sync_to_async
from apps_store.models import TelegramApp, Category, SubCategory
from apps_store.ai_service import process_app_with_ai  # <-- Импортируем наш ИИ

# Каналы для прослушки
CHANNELS_TO_WATCH = ['findminiapp', 'tapps_center', 'ton_apps_ru', 'telegram_apps']

class Command(BaseCommand):
    help = 'Охотник 2.0: Мониторинг + AI Обработка + Рефералки'

    def handle(self, *args, **options):
        # Берем ID и HASH из .env
        api_id = os.getenv("TELEGRAM_API_ID")
        api_hash = os.getenv("TELEGRAM_API_HASH")
        
        if not api_id or not api_hash:
            self.stdout.write(self.style.ERROR("❌ Ошибка: Не найдены TELEGRAM_API_ID или TELEGRAM_API_HASH в .env"))
            return

        client = TelegramClient('hunter_session_v2', int(api_id), api_hash)

        @client.on(events.NewMessage(chats=CHANNELS_TO_WATCH))
        async def handler(event):
            text = event.message.message
            if not text: return

            # Ищем ссылки на ботов
            usernames = re.findall(r'@([a-zA-Z0-9_]+bot)', text, re.IGNORECASE)
            links = re.findall(r't\.me/([a-zA-Z0-9_]+bot)', text, re.IGNORECASE)
            
            for bot_username in set(usernames + links):
                await self.process_new_bot(client, bot_username)

        self.stdout.write(self.style.SUCCESS("🤖 AI-Охотник запущен... Жду новые посты."))
        client.start()
        client.run_until_disconnected()

    async def process_new_bot(self, client, username):
        print(f"\n🔎 Анализ: @{username}")

        # 1. Проверка в БД
        exists = await sync_to_async(TelegramApp.objects.filter(username=f"@{username}").exists)()
        if exists: 
            print("   -> Уже в базе.")
            return

        try:
            # 2. Получаем сырые данные из Телеграм
            entity = await client.get_entity(username)
            if not getattr(entity, 'bot', False): 
                print("   -> Это не бот.")
                return

            from telethon.tl.functions.users import GetFullUserRequest
            full_user = await client(GetFullUserRequest(entity))
            
            raw_desc = full_user.full_user.about or ""
            raw_title = f"{entity.first_name} {entity.last_name or ''}".strip()

            print(f"   📥 Данные получены. Отправляю в AI...")

            # 3. ГЕНЕРАЦИЯ КОНТЕНТА ЧЕРЕЗ AI
            # Оборачиваем синхронную функцию в поток, чтобы не блокировать бота
            ai_data = await sync_to_async(process_app_with_ai)(raw_title, raw_desc)

            if not ai_data:
                print("   ❌ AI не справился, пропускаем.")
                return

            # 4. Находим категорию в БД (или ставим дефолтную)
            subcategory_obj = await self.get_subcategory_db(ai_data.get('category'), ai_data.get('subcategory'))

            # 5. Сохраняем в БД
            app = await sync_to_async(TelegramApp.objects.create)(
                username=f"@{username}",
                telegram_url=f"https://t.me/{username}",
                
                # Заполняем AI-данными
                title_en=ai_data.get('title_en', raw_title),
                title_ru=ai_data.get('title_ru', raw_title),
                description_en=ai_data.get('description_en', raw_desc),
                description_ru=ai_data.get('description_ru', raw_desc),
                short_description_en=ai_data.get('short_description_en', ''),
                short_description_ru=ai_data.get('short_description_ru', ''),
                
                subcategory=subcategory_obj,
                is_ai_processed=True,
                affiliate_status='pending',
                title=raw_title # Техническое поле title тоже заполним
            )
            print(f"   ✨ Приложение создано: {app.title_en} (RU: {app.title_ru})")

            # 6. Пытаемся получить рефку (код из предыдущих шагов можно добавить сюда)
            # await self.try_get_referral(client, entity, app)

        except Exception as e:
            print(f"   ❌ Ошибка: {e}")

    @sync_to_async
    def get_subcategory_db(self, cat_name, sub_name):
        """Ищет категорию в БД"""
        try:
            if not cat_name: return None
            
            # Поиск по имени категории
            cat = Category.objects.filter(name__icontains=cat_name).first()
            if not cat:
                # Фоллбек: берем первую попавшуюся или Games
                cat = Category.objects.filter(name__icontains="Games").first() or Category.objects.first()
            
            if not cat: return None

            # Поиск подкатегории внутри этой категории
            if sub_name:
                sub = SubCategory.objects.filter(name__icontains=sub_name, parent_category=cat).first()
                if sub: return sub
            
            # Если точной подкатегории нет, берем первую в этом разделе
            return SubCategory.objects.filter(parent_category=cat).first()
        except:
            return None