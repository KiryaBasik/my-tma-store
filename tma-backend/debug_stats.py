import os
import sys
import django
import requests
from datetime import timedelta
from django.utils import timezone

# Настройка
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps_store.models import TelegramApp

print("="*40)
print("🕵️‍♂️ ДИАГНОСТИКА СТАТИСТИКИ")
print("="*40)

# 1. ПРОВЕРКА БАЗЫ
count = TelegramApp.objects.count()
print(f"\n[1] В таблице 'TelegramApp' (Приложения): {count} шт.")

if count > 0:
    last = TelegramApp.objects.last()
    print(f"    Последний: {last.title} (создан {last.created_at})")
else:
    print("    ❌ ПУСТО! Вы добавили запись не в ту таблицу.")

# 2. ПРОВЕРКА API
try:
    r = requests.get('http://127.0.0.1:8000/api/stats/', timeout=2)
    if r.status_code == 200:
        print(f"\n[2] Ответ API: {r.json()}")
    else:
        print(f"\n[2] Ошибка API: {r.status_code}")
except:
    print("\n[2] Не удалось подключиться к API (сервер запущен?)")