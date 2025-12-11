import os
import json
import re
from openai import OpenAI
from django.conf import settings

API_KEY = os.getenv("AIML_API_KEY")
BASE_URL = os.getenv("AIML_BASE_URL", "https://api.aimlapi.com/v1")

if not API_KEY:
    print("⚠️ WARNING: AIML_API_KEY not found in env!")

# --- БАЗА ЗАПРЕЩЕННЫХ СЛОВ (STOP WORDS) ---
STOP_WORDS = [
    # === 18+ / PORN (RU) ===
    "порно", "секс", "интим", "член", "вагина", "сиськи", "шлюха", "проститутка", "эротика", "насилие",
    "порнуха", "соски", "минет", "куни", "анал", "оргазм", "свингер", "эскорт", "дрочить", "хентай",
    "педофил", "зоофил", "изнасилование", "бдсм", "голые", "обнаженка", "сливы", "онлифанс", "onlyfans",
    "шмара", "давалка", "путана", "мастурбация", "стояк", "кончить", "сперма", "порн", "xxx", "18+", 
    "18 plus", "18 плюс", "эро", "нюдсы", "nuds",

    # === 18+ / PORN (EN) ===
    "porn", "sex", "nude", "naked", "adult", "boobs", "pussy", "dick", "cock", "whore",
    "slut", "prostitute", "erotic", "hentai", "milf", "anal", "oral", "blowjob", "cum", "masturbate",
    "escort", "swinger", "incest", "pedophile", "rape", "bdsm", "tits", "vagina", "penis", "fuck", 
    "horny", "booty", "ass", "xxx", "uncensored", "leaked",

    # === CASINO / SCAM (RU) ===
    "казино", "ставки", "слоты", "рулетка", "азарт", "беттинг", "вулкан", "vulkan", "1win", "1xbet", 
    "melbet", "mostbet", "покер", "блэкджек", "выигрыш", "занос", "лудомания", "джекпот", "авиатор", 
    "aviator", "lucky jet", "crash game",

    # === CASINO / SCAM (EN) ===
    "casino", "betting", "slots", "roulette", "gambling", "poker", "blackjack", "jackpot", "bet", 
    "wagering", "bookmaker",

    # === HATE / PROFANITY (RU) ===
    "пидор", "гей", "лесбиянка", "лгбт", "даун", "аутист", "урод", "чмо", "тварь", "сука", "блядь", 
    "ебать", "хуй", "пизда", "еблан", "мудак", "гандон", "шлюха", "мать", "хохол", "москаль", "жид", 
    "чурка", "хач", "ниггер", "смерть", "убить", "суицид", "наркотики", "кокаин", "героин", "мефедрон", 
    "соли", "спайс", "закладки", "кладмен",

    # === HATE / PROFANITY (EN) ===
    "gay", "lesbian", "lgbt", "faggot", "retard", "autist", "idiot", "bitch", "shit", "asshole", 
    "cunt", "motherfucker", "bastard", "nigger", "nigga", "kill", "die", "suicide", "terrorist", 
    "drug", "cocaine", "heroin", "weed", "dealer"
]

CATEGORY_STRUCTURE = {
    "Crypto and Web3": ["Wallets", "DeFi & Staking", "Exchanges", "Airdrops", "NFT & Collectibles", "Trading Tools", "GameFi"],
    "Games": ["Tap to Earn", "RPG & Strategy", "Arcade & Action", "Puzzles & Quests", "Farming"],
    "Social and Utility": ["Dating", "VPN & Tools", "Education", "Lifestyle", "Account Utils"],
    "Telegram Platform": ["Stickers & Emojis", "Customization", "Catalogs", "Gifts"],
    "Other": ["Misc"]
}

def process_app_with_ai(raw_title, raw_description):
    if not API_KEY:
        return None

    # 1. НОРМАЛИЗАЦИЯ И ПОДГОТОВКА ТЕКСТА
    # Собираем всё в одну строку и переводим в нижний регистр для проверки
    full_text = (str(raw_title) + " " + str(raw_description)).lower()
    
    print(f"      📝 Checking text for STOP WORDS ({len(full_text)} chars)...")

    # 2. ЖЕСТКАЯ ПРОВЕРКА ПО СЛОВАРЮ (БЕЗ ИИ)
    for bad_word in STOP_WORDS:
        # Ищем слово как отдельное слово или как часть (в зависимости от жесткости)
        # Если нужно только целые слова: 
        # if re.search(r'\b' + re.escape(bad_word) + r'\b', full_text):
        
        # Сейчас сделаем простую проверку вхождения (строже):
        if bad_word in full_text:
            # Исключение для слова "sex" если оно внутри "sexual" (хотя мы и sexual не хотим)
            # Исключение для "ass" внутри "class" или "pass"
            if bad_word in ["ass", "hell", "sex", "gay", "bet"]:
                 # Для коротких английских слов используем проверку границ слова, чтобы не банить "class" из-за "ass"
                 if not re.search(r'\b' + re.escape(bad_word) + r'\b', full_text):
                     continue

            print(f"      🚫 БЛОКИРОВКА: Найдено запрещенное слово '{bad_word}'")
            return None

    print(f"      ✅ Текст чист. Отправляю в AI...")

    # 3. ЕСЛИ ЧИСТО — ОТПРАВЛЯЕМ В ИИ
    client = OpenAI(
        api_key=API_KEY,
        base_url=BASE_URL,
    )

    prompt = f"""
    You are an expert App Store Editor for Telegram Mini Apps.
    
    TASK:
    1. Categorize the app using this structure: {json.dumps(CATEGORY_STRUCTURE)}.
    2. Write catchy content (Title, Short Desc, Full Desc) in English (EN) and Russian (RU).
    
    INPUT DATA:
    Name: "{raw_title}"
    About: "{raw_description}"

    OUTPUT JSON FORMAT (Strictly JSON, no Markdown):
    {{
        "is_unsafe": false,
        "title_en": "String",
        "short_description_en": "String",
        "description_en": "String",
        "title_ru": "String",
        "short_description_ru": "String",
        "description_ru": "String",
        "category": "String (from list)",
        "subcategory": "String (from list)"
    }}
    """

    models_to_try = [
        'gpt-4o-mini', 
        'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    ]

    for model_name in models_to_try:
        try:
            response = client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that outputs strictly JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
            )
            
            content = response.choices[0].message.content
            clean_text = content.replace('```json', '').replace('```', '').strip()
            
            try:
                data = json.loads(clean_text)
            except json.JSONDecodeError:
                print(f"   ⚠️ Ошибка JSON ({model_name})")
                continue

            # Принудительно ставим false, так как мы уже проверили стоп-слова сами
            data['is_unsafe'] = False
            
            print(f"   ✅ Успех через модель: {model_name}")
            return data

        except Exception as e:
            print(f"   ⚠️ Ошибка модели {model_name}: {str(e)[:100]}...")
            continue

    return None