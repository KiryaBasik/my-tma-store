import os
import django
import re
import asyncio
from telethon import TelegramClient, events
from dotenv import load_dotenv

# 1. Загружаем секреты из .env
load_dotenv()

API_ID = os.getenv("TELEGRAM_API_ID")
API_HASH = os.getenv("TELEGRAM_API_HASH")
SESSION_NAME = 'my_monitor_session'

if not API_ID or not API_HASH:
    raise ValueError("❌ ОШИБКА: Не найдены TELEGRAM_API_ID или API_HASH в файле .env")

API_ID = int(API_ID)

# 2. Настройка Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()
from django.core.management import call_command

# 3. Каналы для отслеживания (можно добавлять свои)
CHANNELS_TO_WATCH = [
    'telegram',       # Официальный канал (для теста)
    'durov',          # Канал Павла Дурова (для теста)
    '@findminiapp', 
]
print("🚀 Запуск монитора...")
client = TelegramClient(SESSION_NAME, API_ID, API_HASH)

@client.on(events.NewMessage(chats=CHANNELS_TO_WATCH))
async def handler(event):
    text = event.message.message
    if not text:
        return

    print(f"👀 Новый пост в {event.chat.username}!")

    # Ищем юзернеймы (@bot) и ссылки (t.me/bot)
    usernames = re.findall(r'@([a-zA-Z0-9_]+bot)', text, re.IGNORECASE)
    links = re.findall(r't\.me/([a-zA-Z0-9_]+bot)', text, re.IGNORECASE)
    
    found_apps = set(usernames + links)

    if found_apps:
        print(f"💎 Найдено приложений: {found_apps}")
        for app_username in found_apps:
            print(f"▶️ Обрабатываю @{app_username}...")
            try:
                # Запускаем нашу команду parse_apps
                # sync_to_async нужен, так как Django команды синхронные, а Telethon асинхронный
                from asgiref.sync import sync_to_async
                await sync_to_async(call_command)('parse_apps', [f"@{app_username}"])
            except Exception as e:
                print(f"❌ Ошибка: {e}")
    else:
        print("🤷‍♂️ Ссылок на ботов не найдено.")

print("🤖 Слушаю каналы... (Нажмите Ctrl+C чтобы остановить)")
client.start()
client.run_until_disconnected()