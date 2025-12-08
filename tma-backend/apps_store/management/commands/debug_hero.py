# tma-backend/apps_store/management/commands/debug_hero.py

import json
from django.core.management.base import BaseCommand
from apps_store.models import TelegramApp
from apps_store.serializers import TelegramAppSerializer

class Command(BaseCommand):
    help = 'Тестирует сериализацию Hero и Weekly приложений для поиска ошибок'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("🔍 --- ЗАПУСК ДИАГНОСТИКИ ---"))

        # 1. Проверяем HERO
        hero_apps = TelegramApp.objects.filter(is_hero=True)
        count = hero_apps.count()
        self.stdout.write(f"\n🔥 Найдено приложений в HERO (is_hero=True): {count}")

        if count == 0:
            self.stdout.write(self.style.ERROR("❌ Список Hero пуст! Отметьте галочки в админке."))
        else:
            self.test_serialization(hero_apps, "HERO")

        # 2. Проверяем WEEKLY
        weekly_apps = TelegramApp.objects.filter(is_weekly=True)
        count_w = weekly_apps.count()
        self.stdout.write(f"\n🏆 Найдено приложений в WEEKLY (is_weekly=True): {count_w}")

        if count_w > 0:
            self.test_serialization(weekly_apps, "WEEKLY")

        self.stdout.write(self.style.WARNING("\n🏁 --- КОНЕЦ ДИАГНОСТИКИ ---"))

    def test_serialization(self, queryset, label):
        self.stdout.write(f"⚙️ Попытка сериализации списка {label}...")
        
        # Проверяем по одному, чтобы найти "паршивую овцу"
        for app in queryset:
            try:
                # Эмулируем запрос без request.context (как иногда бывает при ошибках)
                # и с ним, чтобы проверить логику get_lang
                data = TelegramAppSerializer(app).data
                
                # Проверяем критичные поля
                title = data.get('title', 'N/A')
                cat = data.get('category', 'N/A')
                
                self.stdout.write(self.style.SUCCESS(f"   ✅ OK: ID {app.id} | {title} | Cat: {cat}"))
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"   ❌ ОШИБКА в приложении ID {app.id} ({app.username}):"))
                self.stdout.write(str(e))
                # Часто ошибка бывает в поле category или картинке
        
        # Проверяем весь список разом (как делает API View)
        try:
            full_data = TelegramAppSerializer(queryset, many=True).data
            self.stdout.write(self.style.SUCCESS(f"🎉 Весь список {label} сериализуется успешно! (Длина JSON: {len(str(full_data))} символов)"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"💥 Ошибка при сериализации всего списка {label} (обычно это 500 error на сайте):"))
            self.stdout.write(str(e))