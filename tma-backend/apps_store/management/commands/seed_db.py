import json
import os
import requests
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.utils.text import slugify
from apps_store.models import Category, SubCategory, TelegramApp
from bs4 import BeautifulSoup

class Command(BaseCommand):
    help = 'Быстрое наполнение базы из JSON файла'

    def handle(self, *args, **options):
        file_path = 'initial_data.json'
        
        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR("Файл initial_data.json не найден!"))
            return

        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        for cat_data in data:
            # 1. Создаем Категорию
            cat_obj, _ = Category.objects.get_or_create(
                name=cat_data['category'],
                defaults={
                    'slug': slugify(cat_data['category']),
                    'color_theme': 'blue', # Можно рандомить
                    'icon_emoji': '📁'
                }
            )

            # 2. Создаем Подкатегорию
            sub_obj, _ = SubCategory.objects.get_or_create(
                name=cat_data['subcategory'],
                parent_category=cat_obj,
                defaults={
                    'slug': slugify(cat_data['subcategory']),
                    'icon_emoji': '🔹'
                }
            )

            # 3. Создаем Приложения
            for app_data in cat_data['apps']:
                username = app_data['username'].replace('@', '')
                
                # Пропускаем, если уже есть
                if TelegramApp.objects.filter(username=f"@{username}").exists():
                    self.stdout.write(f"Пропуск: {username}")
                    continue

                self.stdout.write(f"Парсинг: {username}...")
                
                # Парсим живые данные с Telegram Web
                try:
                    url = f"https://t.me/{username}"
                    res = requests.get(url)
                    if res.status_code != 200:
                        continue
                    
                    soup = BeautifulSoup(res.text, 'html.parser')
                    
                    # Ищем картинку
                    img_tag = soup.find('img', {'class': 'tgme_page_photo_image'})
                    icon_url = img_tag['src'] if img_tag else None
                    
                    # Ищем описание
                    desc_tag = soup.find('div', {'class': 'tgme_page_description'})
                    description = desc_tag.text.strip() if desc_tag else f"Official bot for {app_data['title']}"

                    # Создаем запись
                    app = TelegramApp.objects.create(
                        title=app_data['title'],
                        username=f"@{username}",
                        telegram_url=url,
                        description=description,
                        short_description=description[:100],
                        subcategory=sub_obj,
                        rating=app_data['rating'],
                        users_count_str=app_data['users']
                    )

                    # Качаем иконку
                    if icon_url:
                        img_res = requests.get(icon_url)
                        if img_res.status_code == 200:
                            app.icon.save(f"{username}.jpg", ContentFile(img_res.content), save=True)
                    
                    self.stdout.write(self.style.SUCCESS(f"✅ Добавлен: {app.title}"))

                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"Ошибка {username}: {e}"))

        self.stdout.write(self.style.SUCCESS("База успешно наполнена!"))