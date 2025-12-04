import google.generativeai as genai
import os
import sys
from dotenv import load_dotenv

# Загружаем переменные
load_dotenv()

print(f"Python version: {sys.version}")
try:
    import importlib.metadata
    version = importlib.metadata.version("google-generativeai")
    print(f"Google Generative AI version: {version}")
except:
    print("Не удалось определить версию библиотеки")

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ ОШИБКА: GEMINI_API_KEY не найден в .env!")
    exit()

print(f"✅ Ключ найден: {api_key[:5]}... (скрыт)")

genai.configure(api_key=api_key)

print("\n📡 Запрашиваю список моделей...")

try:
    found_any = False
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ Доступна модель: {m.name}")
            found_any = True
    
    if not found_any:
        print("❌ Список моделей пуст. Возможно, проблема с ключом или регионом.")

except Exception as e:
    print(f"❌ Критическая ошибка при запросе: {e}")