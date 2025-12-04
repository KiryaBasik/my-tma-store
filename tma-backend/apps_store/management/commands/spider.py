import requests
import re
import time
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from apps_store.models import Category, SubCategory, TelegramApp

class Command(BaseCommand):
    help = 'Паук V4: Специально для верстки FindMini (берет data-mainlink)'

    def handle(self, *args, **options):
        base_domain = 'https://www.findmini.app'
        
        # КАРТА КАТЕГОРИЙ (Твоя структура)
        CATEGORY_MAP = {
            "Telegram Platform": [
                ("Stickers & Emojis", "/category/stickers_and_emojis/"),
                ("Customization", "/category/customization/"),
                ("Account Utils", "/category/account_utils/"),
                ("Catalogs", "/category/catalogs/"),
                ("Gifts", "/category/gifts/"),
                ("VPN & Tools", "/category/vpn_and_tools/"), 
            ],
            "For Admins and Bloggers": [
                ("Community Management", "/category/community_management/"),
                ("Contests & Giveaways", "/category/contests_and_giveaways/"),
                ("Posting & Broadcasts", "/category/posting_and_broadcasts/"),
                ("Voice & Circles", "/category/voice_and_circles/"),
                ("Monetization", "/category/monetization/"),
                ("Analytics", "/category/analytics/"),
                ("Promotion & Ads", "/category/promotion_and_ads/"),
                ("News & Blogs", "/category/news_and_blogs/"), 
            ],
            "Crypto and Web3": [
                ("GameFi", "/category/gamefi/"),
                ("Wallets", "/category/wallets/"),
                ("Exchanges", "/category/exchanges/"),
                ("Trading Tools", "/category/trading_tools/"),
                ("Prediction Markets", "/category/prediction_markets/"),
                ("DeFi & Staking", "/category/defi_and_staking/"),
                ("Airdrops", "/category/airdrops/"),
                ("NFT & Collectibles", "/category/nft_and_collectibles/"),
            ],
            "Games": [
                ("Tap to Earn", "/category/tap_to_earn_and_clickers/"),
                ("Farming", "/category/farming_games/"),
                ("Arcade & Action", "/category/arcade_and_action/"),
                ("Puzzle & Quests", "/category/puzzle_and_quests/"),
                ("Strategy", "/category/strategy/"),
                ("Board & Classic", "/category/board_and_classic/"),
                ("Role Playing", "/category/role_playing/"),
            ]
        }

        self.stdout.write(f"🚀 Запускаем сборщик V4 на {base_domain}...")

        # Сессия с защитой от сбоев
        session = requests.Session()
        retries = Retry(total=3, backoff_factor=1, status_forcelist=[500, 502, 503, 504])
        session.mount('https://', HTTPAdapter(max_retries=retries))
        session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        })

        for parent_name, subcats in CATEGORY_MAP.items():
            # Создаем раздел
            parent_obj, _ = Category.objects.get_or_create(
                name=parent_name,
                defaults={
                    'slug': parent_name.lower().replace(' ', '-').replace('&', 'and'),
                    'color_theme': 'blue',
                    'icon_emoji': '📁'
                }
            )
            self.stdout.write(self.style.WARNING(f"\n📂 {parent_name}"))

            for sub_name, sub_url_suffix in subcats:
                # Создаем подкатегорию
                sub_url_suffix = sub_url_suffix.strip('/')
                full_url = f"{base_domain}/{sub_url_suffix}/" # Важен слэш в конце
                
                sub_obj, _ = SubCategory.objects.get_or_create(
                    name=sub_name,
                    parent_category=parent_obj,
                    defaults={'slug': sub_url_suffix.replace('category/', ''), 'icon_emoji': '🔹'}
                )
                
                self.process_listing(session, full_url, sub_obj)

        self.stdout.write(self.style.SUCCESS("\n🎉 Готово! Проверь админку."))

    def process_listing(self, session, base_url, sub_category):
        """Листает страницы 1, 2, 3..."""
        page = 1
        empty_streak = 0

        while True:
            # URL пагинации: /category/name/ (для 1 стр) или /category/name/2/ (для остальных)
            target_url = base_url if page == 1 else f"{base_url}{page}/"
            
            try:
                resp = session.get(target_url, timeout=10)
                # Если редиректнуло обратно на 1 страницу или 404 - значит конец
                if resp.status_code == 404 or (page > 1 and resp.url == base_url):
                    break

                soup = BeautifulSoup(resp.text, 'html.parser')
                
                # === ГЛАВНАЯ ФИШКА ===
                # Ищем кнопки Open, у них есть атрибут data-mainlink="https://t.me/..."
                buttons = soup.find_all(attrs={"data-mainlink": True})
                
                if not buttons:
                    empty_streak += 1
                    if empty_streak >= 2: break
                else:
                    empty_streak = 0
                    self.stdout.write(f"  👉 {sub_category.name} (стр {page}): {len(buttons)} шт.")
                    
                    for btn in buttons:
                        tg_link = btn['data-mainlink']
                        self.process_telegram_link(session, tg_link, sub_category)

                # Проверка: есть ли кнопка следующей страницы? (необязательно, но надежнее)
                # Но мы просто будем инкрементировать, пока не упремся в 404
                page += 1
                time.sleep(0.5)

            except Exception as e:
                self.stdout.write(f"Ошибка {target_url}: {e}")
                break

    def process_telegram_link(self, session, tg_link, sub_category):
        """Вытаскивает юзернейм и сохраняет данные из официального Telegram"""
        try:
            # Извлекаем username из ссылки (убираем ?start=...)
            # Ссылка вида https://t.me/fstikbot?start=...
            match = re.search(r'(?:t\.me|telegram\.me)/([a-zA-Z0-9_]+)', tg_link, re.IGNORECASE)
            if not match: return
            
            username = match.group(1)
            
            # Проверка дублей
            if TelegramApp.objects.filter(username=f"@{username}").exists():
                return

            # ИДЕМ В TELEGRAM ЗА ЧИСТЫМИ ДАННЫМИ
            official_url = f"https://t.me/{username}"
            resp = session.get(official_url, timeout=10)
            if resp.status_code != 200: return

            soup = BeautifulSoup(resp.text, 'html.parser')
            
            # Название
            title_tag = soup.find('meta', property='og:title')
            title = title_tag['content'] if title_tag else username
            if "Telegram: Contact" in title: 
                # Фолбек: ищем название в блоке tgme_page_title
                h1 = soup.find('div', class_='tgme_page_title')
                title = h1.get_text(strip=True) if h1 else username

            # Описание
            desc_tag = soup.find('meta', property='og:description')
            description = desc_tag['content'] if desc_tag else ""

            # Иконка
            img_tag = soup.find('meta', property='og:image')
            image_url = img_tag['content'] if img_tag else None

            # Сохраняем
            app = TelegramApp.objects.create(
                title=title[:200],
                username=f"@{username}",
                telegram_url=tg_link, # Сохраняем оригинальную ссылку (с рефкой если была)
                description=description,
                short_description=description[:150],
                subcategory=sub_category,
                rating=0.0,
                users_count_str="N/A"
            )

            # Качаем картинку
            if image_url:
                img_res = session.get(image_url, timeout=10)
                if img_res.status_code == 200:
                    app.icon.save(f"{username}.jpg", ContentFile(img_res.content), save=True)
            
            self.stdout.write(self.style.SUCCESS(f"     + {title}"))

        except Exception:
            pass