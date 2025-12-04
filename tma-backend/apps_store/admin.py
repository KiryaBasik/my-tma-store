from django.contrib import admin
from .models import TelegramApp, Category, SubCategory

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'color_theme', 'icon_emoji')
    prepopulated_fields = {'slug': ('name',)} # Авто-заполнение слага

@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent_category', 'slug')
    list_filter = ('parent_category',)
    prepopulated_fields = {'slug': ('name',)}

@admin.register(TelegramApp)
class TelegramAppAdmin(admin.ModelAdmin):
    # Исправили 'category' на 'subcategory'
    list_display = ('title', 'username', 'subcategory', 'is_hero', 'is_weekly', 'rating')
    
    # Исправили фильтр
    list_filter = ('subcategory', 'is_hero', 'is_weekly')
    
    search_fields = ('title', 'username')
    
    list_editable = ('is_hero', 'is_weekly', 'rating')