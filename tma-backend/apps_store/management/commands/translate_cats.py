from django.core.management.base import BaseCommand
from apps_store.models import Category, SubCategory

class Command(BaseCommand):
    help = 'Применяет качественные человеческие переводы для категорий'

    def handle(self, *args, **options):
        # 1. ГЛАВНЫЕ КАТЕГОРИИ
        cat_map = {
            "Games": ("Игры", "Games"),
            "Crypto & Web3": ("Крипто и Web3", "Crypto & Web3"),
            "Social & Utility": ("Соцсети и Утилиты", "Social & Utility"),
            "Telegram Platform": ("Для Telegram", "Telegram Tools"),
            "For Admins and Bloggers": ("Админам и Блогерам", "For Creators"),
        }

        # 2. ПОДКАТЕГОРИИ (Сленг и понятные термины)
        sub_map = {
            # Игры
            "Tap to Earn": ("Тапалки", "Tap to Earn"),
            "Tap-to-Earn": ("Тапалки", "Tap to Earn"),
            "Arcade": ("Аркады", "Arcade"),
            "Strategy": ("Стратегии", "Strategy"),
            "RPG & Strategy": ("РПГ и Стратегии", "RPG & Strategy"),
            "Puzzles": ("Головоломки", "Puzzles"),
            "Farming": ("Фермы", "Farming"),
            "Action": ("Экшен", "Action"),
            
            # Крипта
            "Wallets": ("Кошельки", "Wallets"),
            "DeFi": ("DeFi (Финансы)", "DeFi"),
            "DeFi & Staking": ("Стейкинг и DeFi", "DeFi & Staking"),
            "Exchanges": ("Биржи / Обмен", "Exchanges"),
            "Airdrops": ("Аирдропы", "Airdrops"),
            "Trading Tools": ("Трейдинг", "Trading"),
            
            # Социальное
            "Dating": ("Знакомства", "Dating"),
            "VPN & Tools": ("VPN и Инструменты", "VPN & Tools"),
            "Education": ("Обучение", "Education"),
            "Lifestyle": ("Лайфстайл", "Lifestyle"),
            "Music": ("Музыка", "Music"),
            
            # Прочее
            "Stickers & Emojis": ("Стикеры", "Stickers"),
            "Customization": ("Оформление", "Customization"),
            "Utilities": ("Полезное", "Utilities"),
        }

        # Обновляем Категории
        for cat in Category.objects.all():
            # Пытаемся найти по частичному совпадению
            for key, (ru, en) in cat_map.items():
                if key.lower() in cat.name.lower():
                    cat.name_ru = ru
                    cat.name_en = en
                    cat.save()
                    self.stdout.write(f"Updated Category: {cat.name} -> {ru}")
                    break

        # Обновляем Подкатегории
        for sub in SubCategory.objects.all():
            for key, (ru, en) in sub_map.items():
                if key.lower() in sub.name.lower():
                    sub.name_ru = ru
                    sub.name_en = en
                    sub.save()
                    self.stdout.write(f"Updated Sub: {sub.name} -> {ru}")
                    break
        
        self.stdout.write(self.style.SUCCESS("✅ Переводы успешно применены!"))