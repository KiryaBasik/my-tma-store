import requests
import time
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.utils.text import slugify
from apps_store.models import Category, SubCategory, TelegramApp

class Command(BaseCommand):
    help = 'Импорт приложений из публичного источника (Tapps Center API simulation)'

    def handle(self, *args, **options):
        self.stdout.write("Начинаем импорт...")

        # 1. Создаем структуру категорий (как у тебя на сайте в дизайне)
        # Данные: Название, Слаг, Эмодзи, Цвет, Список подкатегорий
        structure = [
            {
                "name": "Crypto & Web3", "slug": "crypto", "icon": "👛", "color": "blue",
                "subs": ["Wallets", "DeFi & Staking", "Exchanges", "Airdrops"]
            },
            {
                "name": "Games", "slug": "games", "icon": "🎮", "color": "purple",
                "subs": ["Tap-to-Earn", "RPG & Strategy", "Arcade", "Puzzles"]
            },
            {
                "name": "Social & Utility", "slug": "social", "icon": "👥", "color": "green",
                "subs": ["Dating", "VPN & Tools", "Education", "Lifestyle"]
            }
        ]

        # Словарь для быстрого поиска подкатегорий при парсинге
        # Ключи - ключевые слова, Значение - объект SubCategory
        keyword_map = {}

        for cat_data in structure:
            cat_obj, _ = Category.objects.get_or_create(
                slug=cat_data["slug"],
                defaults={
                    "name": cat_data["name"],
                    "icon_emoji": cat_data["icon"],
                    "color_theme": cat_data["color"]
                }
            )
            for sub_name in cat_data["subs"]:
                sub_slug = slugify(sub_name)
                sub_obj, _ = SubCategory.objects.get_or_create(
                    parent_category=cat_obj,
                    slug=sub_slug,
                    defaults={"name": sub_name, "icon_emoji": "Cd"} # Иконку можно потом уточнить
                )
                # Добавляем само название как ключевое слово
                keyword_map[sub_name.lower()] = sub_obj
                # Можно добавить синонимы, например 'clicker' -> 'Tap-to-Earn'
                if sub_name == "Tap-to-Earn":
                    keyword_map["clicker"] = sub_obj
                    keyword_map["miner"] = sub_obj

        self.stdout.write("Категории созданы.")

        # 2. Парсинг данных (Пример списка - в реальности берем с API или парсим HTML)
        # Для демонстрации я сделаю список реальных ботов, чтобы ты сразу увидел результат.
        # В "боевом" режиме тут будет цикл по requests.get('https://tapps.center/api/...')
        
        apps_to_fetch = [
            {"username": "notcoin_bot", "keywords": ["clicker", "tap-to-earn", "games"]},
            {"username": "wallet", "keywords": ["wallets", "crypto"]},
            {"username": "blum", "keywords": ["airdrops", "defi", "crypto"]},
            {"username": "hamster_kombat_bot", "keywords": ["tap-to-earn", "games"]},
            {"username": "catizenbot", "keywords": ["games", "arcade"]},
            {"username": "tinder_bot", "keywords": ["dating", "social"]}, # вымышленный для примера
        ]

        for app_data in apps_to_fetch:
            username = app_data["username"].replace('@', '')
            
            # Логика определения категории по тегам
            target_subcategory = None
            for tag in app_data["keywords"]:
                # Ищем совпадение в наших подкатегориях
                for key, sub_obj in keyword_map.items():
                    if key in tag.lower():
                        target_subcategory = sub_obj
                        break
                if target_subcategory:
                    break
            
            # Если не нашли, кидаем в первую попавшуюся или "Прочее" (можно создать)
            if not target_subcategory:
                target_subcategory = SubCategory.objects.first()

            # Парсинг страницы Телеграма (как мы обсуждали ранее)
            try:
                url = f"https://t.me/{username}"
                response = requests.get(url)
                if response.status_code != 200:
                    continue
                
                from bs4 import BeautifulSoup
                soup = BeautifulSoup(response.text, 'html.parser')
                
                title_tag = soup.find('span', {'class': 'tgme_page_title'}) or soup.find('div', {'class': 'tgme_page_title'})
                title = title_tag.text.strip() if title_tag else username
                
                desc_tag = soup.find('div', {'class': 'tgme_page_description'})
                description = desc_tag.text.strip() if desc_tag else ""
                
                img_tag = soup.find('img', {'class': 'tgme_page_photo_image'})
                icon_url = img_tag['src'] if img_tag else None

                # Сохранение
                app_obj, created = TelegramApp.objects.get_or_create(
                    username=f"@{username}",
                    defaults={
                        'title': title,
                        'telegram_url': url,
                        'description': description,
                        'short_description': description[:80] + "...",
                        'subcategory': target_subcategory,
                        'users_count_str': '1M+', # Пока заглушка
                        'rating': 4.5
                    }
                )

                if created and icon_url:
                    img_res = requests.get(icon_url)
                    if img_res.status_code == 200:
                        app_obj.icon.save(f"{username}.jpg", ContentFile(img_res.content), save=True)
                    self.stdout.write(self.style.SUCCESS(f"Добавлен: {title} в {target_subcategory.name}"))
                else:
                    self.stdout.write(f"Обновлен/Пропущен: {title}")
                
                time.sleep(0.5) # Вежливость к серверу ТГ

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Ошибка с {username}: {e}"))

        self.stdout.write(self.style.SUCCESS("Импорт завершен!"))