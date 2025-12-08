from rest_framework import serializers
from .models import TelegramApp, Category, SubCategory, NewsPost

# 1. Сериализатор для Приложений (Умный: меняет язык EN/RU)
class TelegramAppSerializer(serializers.ModelSerializer):
    # Создаем динамические поля, которые будут менять значение
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    short_description = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()

    class Meta:
        model = TelegramApp
        fields = '__all__'

    def get_lang(self):
        # Пытаемся получить язык из запроса (?lang=ru)
        request = self.context.get('request')
        if request:
            return request.query_params.get('lang', 'en')
        return 'en'

    def get_title(self, obj):
        lang = self.get_lang()
        # Если запросили RU и он есть - отдаем RU, иначе EN, иначе технический заголовок
        if lang == 'ru' and obj.title_ru:
            return obj.title_ru
        return obj.title_en or obj.title

    def get_description(self, obj):
        lang = self.get_lang()
        if lang == 'ru' and obj.description_ru:
            return obj.description_ru
        # ИСПРАВЛЕНИЕ: Убрали 'or obj.description', так как поля больше нет
        return obj.description_en or ""
        
    def get_short_description(self, obj):
        lang = self.get_lang()
        if lang == 'ru' and obj.short_description_ru:
            return obj.short_description_ru
        # ИСПРАВЛЕНИЕ: Убрали 'or obj.short_description'
        return obj.short_description_en or ""

    def get_category(self, obj):
        # ЗАЩИТА: Если подкатегория не выбрана (None), возвращаем заглушку
        if not obj.subcategory:
            return "Other"
        
        lang = self.get_lang()
        # Возвращаем название подкатегории
        if lang == 'ru' and obj.subcategory.name_ru:
            return obj.subcategory.name_ru
        return obj.subcategory.name_en or obj.subcategory.name

# 2. Сериализатор для Подкатегорий (Используется внутри категорий на главной)
class SubCategorySerializer(serializers.ModelSerializer):
    apps = serializers.SerializerMethodField()
    count = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField() # <-- Добавляем динамическое поле

    class Meta:
        model = SubCategory
        fields = ['name', 'slug', 'icon_emoji', 'count', 'apps']

    def get_name(self, obj):
        # Логика выбора языка
        request = self.context.get('request')
        lang = request.query_params.get('lang', 'en') if request else 'en'
        
        if lang == 'ru' and obj.name_ru:
            return obj.name_ru
        return obj.name_en or obj.name

    def get_apps(self, obj):
        request = self.context.get('request')
        lang = request.query_params.get('lang', 'en') if request else 'en'
        # Берем первые 4 приложения
        apps = obj.apps.all()[:4]
        data = []
        for app in apps:
            # Сборка иконки...
            icon_url = app.icon.url if app.icon else None
            if icon_url and request:
                icon_url = request.build_absolute_uri(icon_url)
            
            # Выбор названия приложения
            title = app.title_ru if (lang == 'ru' and app.title_ru) else (app.title_en or app.title)
            
            data.append({"title": title, "icon": icon_url})
        return data

    def get_count(self, obj):
        return obj.apps.count()

# 3. Сериализатор для Категорий (включает в себя подкатегории)
class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True)
    name = serializers.SerializerMethodField() # <-- Динамическое имя
    description = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'slug', 'icon_emoji', 'color_theme', 'subcategories']
    
    def get_name(self, obj):
        request = self.context.get('request')
        lang = request.query_params.get('lang', 'en') if request else 'en'
        
        if lang == 'ru' and obj.name_ru:
            return obj.name_ru
        return obj.name_en or obj.name

    def get_description(self, obj):
        request = self.context.get('request')
        lang = request.query_params.get('lang', 'en') if request else 'en'
        name = self.get_name(obj)
        if lang == 'ru':
            return f"Лучшие приложения в категории {name}"
        return f"Explore best {name} apps."

# 4. Сериализатор для детальной страницы раздела
class SubCategoryDetailSerializer(serializers.ModelSerializer):
    apps = TelegramAppSerializer(many=True, read_only=True)
    name = serializers.SerializerMethodField() 

    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'slug', 'icon_emoji', 'apps']

    def get_name(self, obj):
        request = self.context.get('request')
        lang = request.query_params.get('lang', 'en') if request else 'en'
        if lang == 'ru' and obj.name_ru:
            return obj.name_ru
        return obj.name_en or obj.name
    
class NewsPostSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()

    class Meta:
        model = NewsPost
        fields = ['id', 'title', 'content', 'image', 'category', 'date']

    def get_lang(self):
        request = self.context.get('request')
        return request.query_params.get('lang', 'en') if request else 'en'

    def get_title(self, obj):
        return obj.title_ru if self.get_lang() == 'ru' and obj.title_ru else obj.title_en

    def get_content(self, obj):
        return obj.content_ru if self.get_lang() == 'ru' and obj.content_ru else obj.content_en

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_date(self, obj):
        return obj.created_at.strftime("%b %d, %Y")