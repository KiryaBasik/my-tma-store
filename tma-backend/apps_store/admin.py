from django.contrib import admin
from django.urls import path
from django.http import HttpResponseRedirect
from django.utils.html import format_html
from django.core.management import call_command
from django.contrib import messages
from .models import ParsingSource, TelegramApp, Category, SubCategory, NewsPost, HeroAppProxy, WeeklyAppProxy, TelegramSource

# --- Общая настройка ---
admin.site.site_header = "FindMini Admin"
admin.site.site_title = "FindMini Portal"
admin.site.index_title = "Управление контентом"

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon_emoji', 'color_theme', 'slug')
    prepopulated_fields = {'slug': ('name',)} 

@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'name_ru', 'parent_category', 'icon_emoji')
    list_filter = ('parent_category',)
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'name_ru')

# --- Настройка редактора приложений ---
class TelegramAppAdmin(admin.ModelAdmin):
    list_display = ('get_icon', 'title_display', 'username', 'subcategory', 'rating', 'is_hero', 'is_weekly')
    list_display_links = ('title_display', 'get_icon')
    list_filter = ('is_hero', 'is_weekly', 'subcategory__parent_category', 'affiliate_status')
    search_fields = ('title_en', 'title_ru', 'username')
    list_editable = ('rating', 'is_hero', 'is_weekly')
    readonly_fields = ('created_at',)

    # Группировка полей (Табы/Секции)
    fieldsets = (
        ("Основное", {
            "fields": (("username", "telegram_url"), "subcategory", "icon", "rating", "users_count_str")
        }),
        ("🇬🇧 English Content", {
            "fields": ("title_en", "short_description_en", "description_en"),
            "classes": ("collapse",), # Свернуто по умолчанию (можно убрать)
        }),
        ("🇷🇺 Russian Content", {
            "fields": ("title_ru", "short_description_ru", "description_ru"),
        }),
        ("Маркетинг и Продвижение", {
            "fields": (("is_hero", "is_weekly"), ("has_affiliate", "affiliate_status"), "affiliate_link")
        }),
    )

    def get_icon(self, obj):
        if obj.icon:
            return format_html('<img src="{}" width="30" height="30" style="border-radius:5px;" />', obj.icon.url)
        return "No Icon"
    get_icon.short_description = "Icon"

    def title_display(self, obj):
        return obj.title_en or obj.title_ru or obj.username
    title_display.short_description = "Название"

# Регистрируем основную модель
@admin.register(TelegramApp)
class MainAppAdmin(TelegramAppAdmin):
    pass

# --- Специальные разделы меню ---

@admin.register(HeroAppProxy)
class HeroAdmin(TelegramAppAdmin):
    """Показывает только те, что выбраны в Hero"""
    def get_queryset(self, request):
        return super().get_queryset(request).filter(is_hero=True)
    
    # Скрываем фильтр is_hero, так как он тут по умолчанию
    list_filter = ('is_weekly', 'subcategory') 

@admin.register(WeeklyAppProxy)
class WeeklyAdmin(TelegramAppAdmin):
    """Показывает только те, что выбраны в Weekly"""
    def get_queryset(self, request):
        return super().get_queryset(request).filter(is_weekly=True)

# --- НОВОСТИ ---
@admin.register(NewsPost)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('title_en', 'category', 'created_at', 'is_published')
    list_filter = ('category', 'is_published', 'created_at')
    search_fields = ('title_en', 'title_ru')

@admin.register(ParsingSource)
class ParsingSourceAdmin(admin.ModelAdmin):
    list_display = ('url', 'target_category', 'is_active', 'last_parsed')
    list_filter = ('is_active', 'target_category')
    
    # Добавляем кастомную кнопку в шаблон
    change_list_template = "admin/parsing_source_changelist.html"

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path('run-parser/', self.run_parser_view, name='run_super_parser'),
        ]
        return my_urls + urls

    def run_parser_view(self, request):
        # ЗАПУСК КОМАНДЫ
        # Внимание: Это синхронный запуск. Если парсинг долгий, страница зависнет.
        # В идеале это нужно делать через Celery, но для MVP так сработает.
        try:
            call_command('super_parser')
            self.message_user(request, "✅ Парсер успешно отработал! Проверьте новые приложения.", messages.SUCCESS)
        except Exception as e:
            self.message_user(request, f"❌ Ошибка парсера: {e}", messages.ERROR)
            
        return HttpResponseRedirect("../")
    
@admin.register(TelegramSource)
class TelegramSourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'url', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('url', 'title')