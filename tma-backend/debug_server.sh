#!/bin/bash

echo "============================================"
echo "   ДИАГНОСТИКА СЕРВЕРА (FINDMINI CLONE)   "
echo "============================================"

PROJECT_PATH="/var/www/my-tma-store"
BACKEND_PATH="$PROJECT_PATH/tma-backend"
MEDIA_PATH="$BACKEND_PATH/media"
NGINX_CONF="/etc/nginx/sites-enabled/my-tma-store"

echo -e "\n1. ПРОВЕРКА ПАПОК И ФАЙЛОВ:"
if [ -d "$MEDIA_PATH" ]; then
    echo "✅ Папка media существует: $MEDIA_PATH"
    ls -ld "$MEDIA_PATH"
    
    echo "   --- Содержимое папки icons ---"
    if [ -d "$MEDIA_PATH/icons" ]; then
        COUNT=$(ls "$MEDIA_PATH/icons" | wc -l)
        echo "   ✅ Папка icons есть. Файлов внутри: $COUNT"
        echo "   Первые 3 файла:"
        ls -l "$MEDIA_PATH/icons" | head -n 4 | tail -n 3
        
        # Запоминаем имя одного файла для теста
        TEST_FILE=$(ls "$MEDIA_PATH/icons" | head -n 1)
    else
        echo "   ❌ ПАПКИ icons НЕТ!"
    fi
else
    echo "❌ ПАПКИ media НЕТ ПО ПУТИ $MEDIA_PATH"
fi

echo -e "\n2. ПРОВЕРКА NGINX:"
if [ -f "$NGINX_CONF" ]; then
    echo "✅ Конфиг найден."
    echo "   Вот как настроена раздача медиа:"
    grep -A 4 "location /media/" "$NGINX_CONF"
else
    echo "❌ Конфиг Nginx не найден в sites-enabled!"
fi

echo -e "\n3. ПРОВЕРКА NEXT.JS CONFIG:"
NEXT_CONF="$PROJECT_PATH/next.config.ts"
if [ -f "$NEXT_CONF" ]; then
    echo "✅ Конфиг Next.js найден."
    echo "   Разрешенные домены (remotePatterns):"
    grep -A 20 "remotePatterns" "$NEXT_CONF"
else
    echo "❌ Конфиг Next.js не найден!"
fi

echo -e "\n4. ТЕСТ ДОСТУПА (curl localhost):"
if [ ! -z "$TEST_FILE" ]; then
    echo "Попытка скачать файл: $TEST_FILE"
    HTTP_CODE=$(curl -o /dev/null -s -w "%{http_code}\n" http://127.0.0.1/media/icons/$TEST_FILE)
    if [ "$HTTP_CODE" == "200" ]; then
        echo "✅ УСПЕХ! Nginx отдает картинку (Код 200)."
    else
        echo "❌ ОШИБКА! Nginx не отдает картинку. Код ответа: $HTTP_CODE"
        echo "   (403 = нет прав, 404 = не тот путь в конфиге)"
    fi
else
    echo "⚠️ Не могу протестировать загрузку, так как папка icons пуста."
fi

echo -e "\n5. ПРАВА ДОСТУПА:"
namei -l "$MEDIA_PATH/icons"

echo "============================================"
