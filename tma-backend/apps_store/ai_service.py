import os
import json
import time
import random
import google.generativeai as genai
from django.conf import settings

# --- ЛОГИКА РОТАЦИИ КЛЮЧЕЙ ---
def get_api_keys():
    # Пробуем взять список ключей через запятую
    keys_str = os.getenv("GEMINI_API_KEYS")
    if keys_str:
        return [k.strip() for k in keys_str.split(',') if k.strip()]
    
    # Фолбек на старый одиночный ключ
    single_key = os.getenv("GEMINI_API_KEY")
    if single_key:
        return [single_key]
    
    return []

API_KEYS = get_api_keys()

if not API_KEYS:
    print("⚠️ WARNING: GEMINI_API_KEYS not found in env!")

# Карта категорий
CATEGORY_STRUCTURE = {
    "Crypto and Web3": ["Wallets", "DeFi & Staking", "Exchanges", "Airdrops", "NFT & Collectibles", "Trading Tools", "GameFi"],
    "Games": ["Tap to Earn", "RPG & Strategy", "Arcade & Action", "Puzzles & Quests", "Farming"],
    "Social and Utility": ["Dating", "VPN & Tools", "Education", "Lifestyle", "Account Utils"],
    "Telegram Platform": ["Stickers & Emojis", "Customization", "Catalogs", "Gifts"],
    "Other": ["Misc"]
}

def process_app_with_ai(raw_title, raw_description):
    """
    Анализирует приложение с ротацией ключей API.
    """
    if not API_KEYS:
        return None

    prompt = f"""
    You are a strict App Store Moderator and Editor.
    
    TASK 1: SAFETY CHECK
    Analyze the app title and description.
    Is it related to: 
    - 18+ / Porn / Adult content / Sex dating?
    - Casino / Gambling / Slots / Betting?
    - Scams / Illegal drugs?
    If YES, set "is_unsafe": true. Otherwise "is_unsafe": false.

    TASK 2: CATEGORIZATION
    Assign ONE category and ONE subcategory strictly from this list:
    {json.dumps(CATEGORY_STRUCTURE)}
    If unsure, use "Other" -> "Misc".

    TASK 3: CONTENT GENERATION
    Write catchy content in English (EN) and Russian (RU).
    
    INPUT:
    Title: {raw_title}
    Desc: {raw_description}

    OUTPUT JSON:
    {{
        "is_unsafe": boolean,
        "title_en": "...",
        "short_description_en": "...",
        "description_en": "...",
        "title_ru": "...",
        "short_description_ru": "...",
        "description_ru": "...",
        "category": "Exact Main Category Name",
        "subcategory": "Exact Subcategory Name"
    }}
    """

    models_to_try = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-flash-latest']
    
    # Перемешиваем ключи, чтобы нагрузка распределялась равномерно
    random.shuffle(API_KEYS)

    for api_key in API_KEYS:
        # Настраиваем библиотеку на текущий ключ
        genai.configure(api_key=api_key)
        
        for model_name in models_to_try:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(prompt)
                
                clean_text = response.text.replace('```json', '').replace('```', '').strip()
                data = json.loads(clean_text)
                
                if data.get('is_unsafe') == True:
                    print(f"   🚫 AI: Контент 18+/Casino. Пропуск.")
                    return None 

                return data

            except Exception as e:
                error_msg = str(e)
                # Если лимит (429) - пробуем следующую модель или СЛЕДУЮЩИЙ КЛЮЧ
                if "429" in error_msg or "Quota" in error_msg:
                    print(f"   ⏳ Лимит на ключе ...{api_key[-4:]} (модель {model_name}). Меняю...")
                    time.sleep(2) # Небольшая пауза перед сменой
                    continue # Идем к следующей модели/ключу
                else:
                    # Если другая ошибка (например, перегрузка сервера), просто пишем лог
                    # print(f"⚠️ Ошибка AI: {error_msg[:50]}")
                    continue

    print("❌ Все ключи и модели исчерпаны. Ждем 30 сек...")
    time.sleep(30)
    return None