import requests
import time
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from django.core.management.base import BaseCommand
from apps_store.models import ParsingSource

class Command(BaseCommand):
    help = 'Мульти-Разведчик: Сканирует список сайтов и сохраняет категории в БД'

    def handle(self, *args, **options):
        # Твой список доноров
        TARGET_SITES = [
            'https://appstg.ru',
            'https://findmini.app',
            'https://minitelegram.com',
            'https://tgapp.ru',
            'https://www.tgminiapp.store',
            'https://productradar.ru',
        ]

        # Признаки того, что ссылка ведет на категорию/список
        CATEGORY_MARKERS = [
            '/category/', '/catalog/', '/apps/', '/collection/', 
            '/tag/', '/genre/', '/list/', '/topic/', '/store/'
        ]

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        
        session = requests.Session()
        session.headers.update(headers)

        self.stdout.write(f"🚀 Начинаю сканирование {len(TARGET_SITES)} сайтов...")

        total_added = 0

        for site_url in TARGET_SITES:
            self.stdout.write(f"\n🌐 Захожу на: {site_url}")
            
            try:
                resp = session.get(site_url, timeout=15)
                if resp.status_code != 200:
                    self.stdout.write(self.style.ERROR(f"   ❌ Ошибка доступа: {resp.status_code}"))
                    continue

                soup = BeautifulSoup(resp.text, 'html.parser')
                domain = urlparse(site_url).netloc
                
                found_on_site = 0
                
                # Ищем все ссылки
                for a in soup.find_all('a', href=True):
                    href = a['href']
                    full_url = urljoin(site_url, href)
                    parsed = urlparse(full_url)

                    # Фильтр 1: Ссылка должна быть внутренней (тот же домен)
                    if parsed.netloc != domain:
                        continue

                    # Фильтр 2: Ссылка должна быть похожа на категорию
                    is_category = any(marker in parsed.path for marker in CATEGORY_MARKERS)
                    
                    # Фильтр 3: Отсеиваем слишком короткие (корневые) и мусор
                    if is_category and len(parsed.path) > 3:
                        clean_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}".rstrip('/')
                        
                        # СОХРАНЯЕМ В БАЗУ
                        obj, created = ParsingSource.objects.get_or_create(
                            url=clean_url,
                            defaults={'is_active': True}
                        )
                        
                        if created:
                            self.stdout.write(self.style.SUCCESS(f"   + Добавлено: {clean_url}"))
                            found_on_site += 1
                            total_added += 1

                self.stdout.write(f"   ✅ Найдено новых разделов: {found_on_site}")
                time.sleep(1) # Вежливость

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"   ❌ Сбой при сканировании: {e}"))

        self.stdout.write("="*50)
        self.stdout.write(self.style.SUCCESS(f"🏁 ФИНИШ! Всего добавлено новых источников: {total_added}"))
        self.stdout.write("Теперь жми кнопку 'ЗАПУСТИТЬ ПАРСЕР' в админке.")