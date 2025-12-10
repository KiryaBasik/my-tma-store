from django.core.management.base import BaseCommand
from apps_store.models import ParsingSource

class Command(BaseCommand):
    help = 'Массово добавляет список URL в источники парсинга'

    def handle(self, *args, **options):
        # Твой список, который мы нашли
        urls = [
            "https://findmini.app/category/account_utils",
            "https://findmini.app/category/ai_assistants_and_chatbots",
            "https://findmini.app/category/ai_characters",
            "https://findmini.app/category/airdrops",
            "https://findmini.app/category/analytics",
            "https://findmini.app/category/anonymous_chats",
            "https://findmini.app/category/anonymous_questions",
            "https://findmini.app/category/arcade_and_action",
            "https://findmini.app/category/astrology",
            "https://findmini.app/category/board_and_classic",
            "https://findmini.app/category/builders",
            "https://findmini.app/category/business_services",
            "https://findmini.app/category/calculators",
            "https://findmini.app/category/catalogs",
            "https://findmini.app/category/classifieds",
            "https://findmini.app/category/community_management",
            "https://findmini.app/category/content_downloaders",
            "https://findmini.app/category/contests_and_giveaways",
            "https://findmini.app/category/courses_and_guides",
            "https://findmini.app/category/crm",
            "https://findmini.app/category/customization",
            "https://findmini.app/category/dating",
            "https://findmini.app/category/defi_and_staking",
            "https://findmini.app/category/discounts_and_deals",
            "https://findmini.app/category/exchanges",
            "https://findmini.app/category/farming_games",
            "https://findmini.app/category/file_management",
            "https://findmini.app/category/fitness",
            "https://findmini.app/category/food_and_recipes",
            "https://findmini.app/category/food_delivery",
            "https://findmini.app/category/gamefi",
            "https://findmini.app/category/gifts",
            "https://findmini.app/category/health",
            "https://findmini.app/category/homework_help",
            "https://findmini.app/category/humor_and_memes",
            "https://findmini.app/category/image_generation",
            "https://findmini.app/category/job_search",
            "https://findmini.app/category/kids",
            "https://findmini.app/category/language_learning",
            "https://findmini.app/category/legal_services",
            "https://findmini.app/category/marketplaces",
            "https://findmini.app/category/monetization",
            "https://findmini.app/category/movies_and_series",
            "https://findmini.app/category/music_and_shazam",
            "https://findmini.app/category/news_and_blogs",
            "https://findmini.app/category/nft_and_collectibles",
            "https://findmini.app/category/photo_and_video_editors",
            "https://findmini.app/category/posting_and_broadcasts",
            "https://findmini.app/category/prediction_markets",
            "https://findmini.app/category/productivity",
            "https://findmini.app/category/programming_and_it",
            "https://findmini.app/category/promotion_and_ads",
            "https://findmini.app/category/psychology_and_selfdev",
            "https://findmini.app/category/puzzle_and_quests",
            "https://findmini.app/category/role_playing",
            "https://findmini.app/category/stars",
            "https://findmini.app/category/stickers_and_emojis",
            "https://findmini.app/category/strategy",
            "https://findmini.app/category/tap_to_earn_and_clickers",
            "https://findmini.app/category/task_marketplaces",
            "https://findmini.app/category/text_generation",
            "https://findmini.app/category/trading_tools",
            "https://findmini.app/category/translators",
            "https://findmini.app/category/travel",
            "https://findmini.app/category/video_content",
            "https://findmini.app/category/video_generation",
            "https://findmini.app/category/voice_and_circles",
            "https://findmini.app/category/wallets",
            "https://findmini.app/category/weather"
        ]

        self.stdout.write(f"🚀 Добавляю {len(urls)} источников в базу...")
        
        added = 0
        skipped = 0

        for url in urls:
            # get_or_create предотвращает дубликаты
            obj, created = ParsingSource.objects.get_or_create(
                url=url,
                defaults={'is_active': True}
            )
            if created:
                added += 1
            else:
                skipped += 1

        self.stdout.write(self.style.SUCCESS(f"✅ Готово! Добавлено: {added}. Пропущено (уже были): {skipped}."))
        self.stdout.write("Теперь иди в Админку -> Parsing Sources и жми кнопку 'ЗАПУСТИТЬ ПАРСЕР'")