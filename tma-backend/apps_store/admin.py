from django.contrib import admin
from .models import TelegramApp

@admin.register(TelegramApp)
class TelegramAppAdmin(admin.ModelAdmin):
    # Колонки, которые видны в списке
    list_display = ('title', 'username', 'category', 'is_hero', 'is_weekly', 'rating')
    
    # Фильтры справа
    list_filter = ('category', 'is_hero', 'is_weekly')
    
    # Поиск
    search_fields = ('title', 'username')
    
    # Позволяет менять галочки прямо в списке, не заходя внутрь!
    list_editable = ('is_hero', 'is_weekly', 'rating')