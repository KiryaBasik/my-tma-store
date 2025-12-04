import os
import asyncio
from telethon import TelegramClient
from telethon.tl.functions.users import GetFullUserRequest
from django.core.management.base import BaseCommand
from asgiref.sync import sync_to_async
from apps_store.models import TelegramApp, Category, SubCategory
from apps_store.ai_service import process_app_with_ai

class Command(BaseCommand):
    help = 'Ручной тест ИИ-Охотника на конкретном боте'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Юзернейм бота (например @bot)')

    def handle(self, *args, **options):
        username = options['username'].replace('@', '')
        api_id = os.getenv("TELEGRAM_API_ID")
        api_hash = os.getenv("TELEGRAM_API_HASH")

        if not api_id:
            self.stdout.write(self.style.ERROR("❌ Нет API ключей в .env"))
            return

        # Запускаем асинхронный код
        asyncio.run(self.run_test(api_id, api_hash, username))

    async def run_test(self, api_id, api_hash, username):
        print(f"\n🧪 ЗАПУСК ТЕСТА ДЛЯ: @{username}")
        
        async with TelegramClient('hunter_debug_session', int(api_id), api_hash) as client:
            # 1. Получаем инфу из Телеграм
            try:
                entity = await client.get_entity(username)
                if not getattr(entity, 'bot', False):
                    print("❌ Это не бот!")
                    return

                full_user = await client(GetFullUserRequest(entity))
                raw_desc = full_user.full_user.about or ""
                raw_title = f"{entity.first_name} {entity.last_name or ''}".strip()
                
                print(f"✅ Данные из TG получены:")
                print(f"   - Оригинал Названия: {raw_title}")
                print(f"   - Оригинал Описания: {raw_desc[:50]}...")

            except Exception as e:
                print(f"❌ Не нашел бота в Telegram: {e}")
                return

            # 2. Отправляем в ИИ
            print(f"\n🧠 Отправляю в Gemini AI...")
            ai_data = await sync_to_async(process_app_with_ai)(raw_title, raw_desc)

            if not ai_data:
                print("❌ ИИ вернул пустой ответ или ошибку.")
                return

            print(f"✅ ИИ обработал данные!")
            print(f"   🇬🇧 EN Title: {ai_data.get('title_en')}")
            print(f"   🇷🇺 RU Title: {ai_data.get('title_ru')}")
            print(f"   📂 Категория: {ai_data.get('category')} -> {ai_data.get('subcategory')}")

            # 3. Сохраняем (или обновляем) в БД
            # Сначала найдем категорию
            cat_obj, sub_obj = await self.find_category(ai_data.get('category'), ai_data.get('subcategory'))
            
            app, created = await sync_to_async(TelegramApp.objects.update_or_create)(
                username=f"@{username}",
                defaults={
                    'telegram_url': f"https://t.me/{username}",
                    'title_en': ai_data.get('title_en', raw_title),
                    'title_ru': ai_data.get('title_ru', raw_title),
                    'description_en': ai_data.get('description_en', raw_desc),
                    'description_ru': ai_data.get('description_ru', raw_desc),
                    'short_description_en': ai_data.get('short_description_en', ''),
                    'short_description_ru': ai_data.get('short_description_ru', ''),
                    'subcategory': sub_obj,
                    'is_ai_processed': True
                }
            )
            
            action = "Создано" if created else "Обновлено"
            print(f"\n💾 БД: {action} успешно! ID: {app.id}")
            print("🎉 Тест пройден. Проверь админку.")

    @sync_to_async
    def find_category(self, cat_name, sub_name):
        # Простая логика поиска
        cat = Category.objects.filter(name__icontains=cat_name).first()
        if not cat: return None, None
        sub = SubCategory.objects.filter(name__icontains=sub_name, parent_category=cat).first()
        if not sub: sub = SubCategory.objects.filter(parent_category=cat).first()
        return cat, sub