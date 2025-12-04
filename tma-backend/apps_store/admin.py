from django.contrib import admin
from .models import TelegramApp, Category, SubCategory

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'name_ru', 'slug', 'color_theme') # Видно RU название
    prepopulated_fields = {'slug': ('name',)} 

@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'name_ru', 'parent_category')
    list_filter = ('parent_category',)
    prepopulated_fields = {'slug': ('name',)}
    
@admin.register(TelegramApp)
class TelegramAppAdmin(admin.ModelAdmin):
    # Исправили 'category' на 'subcategory'
    list_display = ('title', 'username', 'subcategory', 'is_hero', 'is_weekly', 'rating')
    
    # Исправили фильтр
    list_filter = ('subcategory', 'is_hero', 'is_weekly')
    
    search_fields = ('title_en', 'title_ru', 'username')
    
    list_editable = ('is_hero', 'is_weekly', 'rating')