import requests
import time
import re
from django.core.management.base import BaseCommand
from django.utils import timezone
from bs4 import BeautifulSoup
from django.core.files.base import ContentFile
from apps_store.models import ParsingSource, TelegramApp, SubCategory, Category
from apps_store.ai_service import process_app_with_ai

class Command(BaseCommand):
    help = 'Супер-парсер V3: Мульти-сайтовая поддержка и умная пагинация'

    def handle(self, *args, **options):
        sources = ParsingSource.objects.filter(is_active=True)
        count = sources.count()
        if count == 0:
            self.stdout.write(self.style.WARNING("⚠️ Источников нет! Сначала запусти 'python manage.py discover_cats'"))
            return

        self.stdout.write(f"🚀 Парсер запущен! Обработка {count} источников...")

        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
        session = requests.Session()
        session.headers.update(headers)

        for source in sources:
            self.process_source(session, source)
            source.last_parsed = timezone.now()
            source.save()

    def process_source(self, session, source):
        base_url = source.url.rstrip('/')
        self.stdout.write(self.style.WARNING(f"\n📂 Источник: {base_url}"))
        
        # Определяем тип пагинации (простая эвристика)
        # Если сайт appstg.ru или productradar, там часто ?page=
        # Если findmini, там /page/ (или просто число в конце)
        
        page = 1
        empty_streak = 0 # Защита от бесконечного цикла

        while True:
            # Пробуем разные форматы URL для следующих страниц
            if page == 1:
                target_url = base_url
            else:
                # Пытаемся угадать формат. Для надежности можно проверять оба, 
                # но для простоты пробуем универсальный подход:
                if '?' in base_url:
                    target_url = f"{base_url}&page={page}"
                else:
                    # Пробуем стандартный path style, который работает на findmini и многих других
                    target_url = f"{base_url}/{page}/"

            try:
                self.stdout.write(f"   📄 Стр {page}...")
                resp = session.get(target_url, timeout=10)
                
                # Если 404 или редирект (конец списка)
                if resp.status_code == 404 or (page > 1 and resp.url.rstrip('/') == base_url):
                    break
                if resp.status_code != 200:
                    break

                # ПАРСИНГ ПРИЛОЖЕНИЙ
                apps_found = self.extract_apps(resp.text, session, source)
                
                if apps_found == 0:
                    empty_streak += 1
                else:
                    empty_streak = 0 # Сбрасываем счетчик, если нашли что-то

                # Если 2 страницы подряд пусто - уходим
                if empty_streak >= 2:
                    self.stdout.write("      ⏹️ Похоже, страницы кончились.")
                    break
                
                page += 1
                if page > 5: break # Ограничитель глубины (чтобы не висеть вечно на одном сайте)
                time.sleep(1)

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Ошибка: {e}"))
                break

    def extract_apps(self, html, session, source):
        # Ищем ссылки на t.me
        # Регулярка захватывает t.me/botname (игнорируем стикеры и служебные)
        tg_links = set(re.findall(r't\.me/([a-zA-Z0-9_]+)', html, re.IGNORECASE))
        
        count = 0
        for username in tg_links:
            # Фильтр мусора
            if username.lower() in ['sticker', 'addstickers', 'iv', 'proxy', 'share']: continue
            
            # Проверяем, есть ли уже в базе
            if TelegramApp.objects.filter(username__icontains=username).exists():
                continue

            # Запускаем создание
            success = self.create_app(username, session, source)
            if success: count += 1
            
        return count

    def create_app(self, username, session, source):
        try:
            # 1. Берем данные из Telegram Web
            tg_url = f"https://t.me/{username}"
            r = session.get(tg_url, timeout=5)
            if r.status_code != 200: return False
            
            soup = BeautifulSoup(r.text, 'html.parser')
            
            title_meta = soup.find('meta', property='og:title')
            desc_meta = soup.find('meta', property='og:description')
            img_meta = soup.find('meta', property='og:image')

            if not title_meta: return False # Не страница бота/канала

            raw_title = title_meta['content'].replace('Telegram: Contact @', '')
            raw_desc = desc_meta['content'] if desc_meta else ""
            raw_img = img_meta['content'] if img_meta else None

           # 2. AI Processing
            self.stdout.write(f"      🤖 AI обработка: @{username}")
            ai_data = process_app_with_ai(raw_title, raw_desc)
            
            # Если AI вернул None (значит 18+ или ошибка) — выходим
            if not ai_data: 
                return False

            # --- ЛОГИКА ПОДБОРА КАТЕГОРИИ (ИСПРАВЛЕНА) ---
            target_sub = None
            
            # 1. Сначала пробуем взять ту, которую предложил AI
            ai_sub_name = ai_data.get('subcategory')
            if ai_sub_name:
                target_sub = SubCategory.objects.filter(name__iexact=ai_sub_name).first()
            
            # 2. Если в базе такой нет, берем из источника (ParsingSource)
            if not target_sub:
                target_sub = source.target_subcategory

            # 3. Если всё еще нет — кидаем в "Misc" (должна быть создана заранее)
            if not target_sub:
                target_sub = SubCategory.objects.filter(name="Misc").first()
                if not target_sub:
                    # Создаем аварийную категорию, если база пустая
                    misc_cat, _ = Category.objects.get_or_create(name="Other", defaults={'slug': 'other'})
                    target_sub, _ = SubCategory.objects.get_or_create(name="Misc", parent_category=misc_cat, defaults={'slug': 'misc'})

            # 3. Создаем запись
            app = TelegramApp.objects.create(
                username=f"@{username}",
                telegram_url=tg_url,
                title_en=ai_data.get('title_en', raw_title),
                title_ru=ai_data.get('title_ru', raw_title),
                description_en=ai_data.get('description_en', raw_desc),
                description_ru=ai_data.get('description_ru', raw_desc),
                short_description_en=ai_data.get('short_description_en', ''),
                short_description_ru=ai_data.get('short_description_ru', ''),
                subcategory=target_sub,
                is_ai_processed=True,
                rating=4.0 # Стартовый рейтинг
            )

            # Картинка
            if raw_img:
                img_r = session.get(raw_img)
                if img_r.status_code == 200:
                    app.icon.save(f"{username}.jpg", ContentFile(img_r.content), save=True)

            self.stdout.write(self.style.SUCCESS(f"      ✅ OK: {app.title_en}"))
            return True

        except Exception as e:
            # self.stdout.write(f"Err {username}: {e}")
            return False