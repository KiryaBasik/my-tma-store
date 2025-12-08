from django.core.management.base import BaseCommand
from apps_store.models import Category
from apps_store.serializers import CategorySerializer

class Command(BaseCommand):
    help = 'Тестирует сериализацию Категорий для поиска ошибок'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("🔍 --- ЗАПУСК ДИАГНОСТИКИ КАТЕГОРИЙ ---"))

        categories = Category.objects.all()
        count = categories.count()
        self.stdout.write(f"\n📂 Всего категорий в базе: {count}")

        if count == 0:
            self.stdout.write(self.style.ERROR("❌ Категорий нет! Запустите скрипт наполнения (seed_db или spider)."))
            return

        # 1. Проверяем по одной
        self.stdout.write("\n⚙️ Проверка каждой категории отдельно...")
        for cat in categories:
            try:
                # Имитируем сериализацию
                data = CategorySerializer(cat).data
                subs_count = len(data.get('subcategories', []))
                self.stdout.write(self.style.SUCCESS(f"   ✅ OK: {cat.name} (ID {cat.id}) | Подкатегорий: {subs_count}"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"   ❌ ОШИБКА в категории ID {cat.id} ({cat.name}):"))
                self.stdout.write(str(e))

        # 2. Проверяем весь список (как делает API)
        self.stdout.write("\n🚀 Проверка полного списка (API)...")
        try:
            full_data = CategorySerializer(categories, many=True).data
            self.stdout.write(self.style.SUCCESS(f"🎉 Весь список работает! JSON size: {len(str(full_data))}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR("💥 Ошибка при общей сериализации:"))
            self.stdout.write(str(e))

        self.stdout.write(self.style.WARNING("\n🏁 --- КОНЕЦ ---"))