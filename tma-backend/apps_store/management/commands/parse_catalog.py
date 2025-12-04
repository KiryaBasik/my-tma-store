import requests
import re
import time
from bs4 import BeautifulSoup
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from apps_store.models import Category, SubCategory, TelegramApp

class Command(BaseCommand):
    help = 'Умный парсер: собирает ботов с каталогов и тянет инфу из Telegram'

    def add_arguments(self, parser):
        parser.add_argument('--url', type=str, default='https://ton.app', help='URL каталога для сканирования')

    def handle(self, *args, **options):
        catalog_url = options['url']
        self.stdout.write(f"🚀 Начинаем сканирование {catalog_url}...")

        # 1. Сбор ссылок (Username'ов)
        usernames = self.collect_usernames(catalog_url)
        self.stdout.write(self.style.SUCCESS(f"✅ Найдено уникальных приложений: {len(usernames)}"))

        # 2. Обработка каждого приложения
        for username in usernames:
            self.process_app(username)
            time.sleep(0.5) # Не дудосим Телеграм

    def collect_usernames(self, url):
        """Сканирует страницу и ищет все ссылки t.me/"""
        try:
            # Притворяемся браузером
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code != 200:
                self.stdout.write(self.style.ERROR(f"Ошибка доступа к сайту: {response.status_code}"))
                return []

            soup = BeautifulSoup(response.text, 'html.parser')
            links = soup.find_all('a', href=True)
            
            usernames = set()
            for link in links:
                href = link['href']
                # Ищем паттерны t.me/botname или telegram.me/botname
                match = re.search(r'(?:t\.me|telegram\.me)/([a-zA-Z0-9_]+bot)', href, re.IGNORECASE)
                if match:
                    usernames.add(match.group(1))
            
            return list(usernames)
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Ошибка сбора ссылок: {e}"))
            return []

    def process_app(self, username):
        """Идет на t.me/username и забирает официальные данные"""
        
        # Проверяем, есть ли уже в базе
        if TelegramApp.objects.filter(username=f"@{username}").exists():
            self.stdout.write(f"⏭️  {username} уже есть, пропускаем.")
            return

        try:
            tg_url = f"https://t.me/{username}"
            response = requests.get(tg_url)
            if response.status_code != 200:
                return

            soup = BeautifulSoup(response.text, 'html.parser')

            # --- ПАРСИНГ ДАННЫХ ---
            # 1. Название (Обычно в meta tag или title)
            title_meta = soup.find('meta', property='og:title')
            title = title_meta['content'] if title_meta else username
            # Убираем "Telegram: Contact @..." мусор
            if "Telegram: Contact @" in title:
                title = username

            # 2. Описание
            desc_meta = soup.find('meta', property='og:description')
            description = desc_meta['content'] if desc_meta else ""
            if not description:
                # Пробуем найти в блоке tgme_page_description
                div_desc = soup.find('div', class_='tgme_page_description')
                description = div_desc.get_text(strip=True) if div_desc else "No description"

            # 3. Иконка (Аватарка)
            image_meta = soup.find('meta', property='og:image')
            image_url = image_meta['content'] if image_meta else None

            # --- КАТЕГОРИЗАЦИЯ ---
            # Пытаемся угадать категорию по ключевым словам в описании
            cat_obj, sub_obj = self.guess_category(description)

            # --- СОХРАНЕНИЕ ---
            app = TelegramApp(
                title=title[:250], # Обрезаем на всякий случай
                username=f"@{username}",
                telegram_url=tg_url,
                description=description,
                short_description=description[:100] + "...",
                subcategory=sub_obj,
                rating=4.5, # Стартовый рейтинг
                users_count_str="N/A"
            )

            # Скачиваем иконку
            if image_url:
                img_resp = requests.get(image_url)
                if img_resp.status_code == 200:
                    app.icon.save(f"{username}.jpg", ContentFile(img_resp.content), save=False)

            app.save()
            self.stdout.write(self.style.SUCCESS(f"✅ Добавлен: {title} ({sub_obj.name})"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Ошибка при парсинге {username}: {e}"))

    def guess_category(self, text):
        """Простая логика определения категории по тексту"""
        text = text.lower()
        
        # Получаем или создаем дефолтную категорию
        default_cat, _ = Category.objects.get_or_create(name="Other", defaults={'slug': 'other', 'icon_emoji': '📦'})
        default_sub, _ = SubCategory.objects.get_or_create(name="Misc", parent_category=default_cat, defaults={'slug': 'misc'})

        if any(w in text for w in ['game', 'play', 'rpg', 'battle']):
            cat, _ = Category.objects.get_or_create(name="Games", defaults={'slug': 'games', 'icon_emoji': '🎮'})
            sub, _ = SubCategory.objects.get_or_create(name="Arcade", parent_category=cat, defaults={'slug': 'arcade'})
            return cat, sub
        
        if any(w in text for w in ['crypto', 'wallet', 'ton', 'coin', 'btc', 'eth']):
            cat, _ = Category.objects.get_or_create(name="Crypto & Web3", defaults={'slug': 'crypto', 'icon_emoji': '👛'})
            sub, _ = SubCategory.objects.get_or_create(name="DeFi", parent_category=cat, defaults={'slug': 'defi'})
            return cat, sub

        return default_cat, default_sub