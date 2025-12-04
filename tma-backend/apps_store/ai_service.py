import os
import json
import google.generativeai as genai
from django.conf import settings

# Настройка API
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GENAI_API_KEY:
    print("⚠️ WARNING: GEMINI_API_KEY not found in env!")

genai.configure(api_key=GENAI_API_KEY)

# Карта категорий
CATEGORY_STRUCTURE = {
    "Crypto and Web3": ["Wallets", "DeFi & Staking", "Exchanges", "Airdrops", "NFT & Collectibles", "Trading Tools", "GameFi"],
    "Games": ["Tap to Earn", "RPG & Strategy", "Arcade & Action", "Puzzles & Quests", "Farming"],
    "Social and Utility": ["Dating", "VPN & Tools", "Education", "Lifestyle", "Account Utils"],
    "Telegram Platform": ["Stickers & Emojis", "Customization", "Catalogs", "Gifts"]
}

def process_app_with_ai(raw_title, raw_description):
    """
    Отправляет сырые данные в Gemini и возвращает JSON с переводами и категорией.
    """
    
    prompt = f"""
    You are an expert App Store Editor. I will give you raw information about a Telegram Mini App.
    
    YOUR TASK:
    1. Analyze the app based on the description.
    2. Write a catchy Title, Short Description (1 sentence), and Full Description (2-3 paragraphs, SEO optimized).
    3. Generate this content in TWO languages: English (EN) and Russian (RU).
    4. Categorize the app strictly using the provided Category Map.

    CATEGORY MAP:
    {json.dumps(CATEGORY_STRUCTURE)}

    INPUT DATA:
    Raw Title: {raw_title}
    Raw Description: {raw_description}

    OUTPUT FORMAT (Strict JSON, no markdown):
    {{
        "title_en": "...",
        "short_description_en": "...",
        "description_en": "...",
        "title_ru": "...",
        "short_description_ru": "...",
        "description_ru": "...",
        "category": "Name of Main Category from Map",
        "subcategory": "Name of Subcategory from Map"
    }}
    """

    # ИСПОЛЬЗУЕМ МОДЕЛИ ИЗ ТВОЕГО СПИСКА
    # Приоритет: 2.0 Flash (быстрая и стабильная) -> 2.5 Flash (новейшая) -> Flash Latest
    models_to_try = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-flash-latest']
    
    response = None
    used_model = ""

    for model_name in models_to_try:
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            used_model = model_name
            break 
        except Exception as e:
            print(f"⚠️ Модель {model_name} не сработала: {e}")
            continue

    if not response:
        print("❌ Все модели AI недоступны.")
        return None

    try:
        # Очищаем ответ от маркдауна
        clean_text = response.text.replace('```json', '').replace('```', '').strip()
        data = json.loads(clean_text)
        print(f"   🤖 (Обработано через {used_model})")
        return data
    except Exception as e:
        print(f"❌ Ошибка парсинга JSON от AI: {e}")
        return None