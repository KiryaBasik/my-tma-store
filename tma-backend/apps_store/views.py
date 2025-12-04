from rest_framework import generics
from .models import TelegramApp, Category, SubCategory  # <-- ВАЖНО: Добавлен SubCategory
from .serializers import (
    TelegramAppSerializer, 
    CategorySerializer, 
    SubCategoryDetailSerializer # <-- Убедись, что этот сериализатор есть в serializers.py
)

# 1. API для получения ОДНОГО приложения для Hero секции
class HeroAppView(generics.RetrieveAPIView):
    serializer_class = TelegramAppSerializer

    def get_object(self):
        # Берем первое попавшееся, у которого стоит галочка is_hero
        return TelegramApp.objects.filter(is_hero=True).first()

# 2. API для получения списка "Приложения недели"
class WeeklyAppsView(generics.ListAPIView):
    serializer_class = TelegramAppSerializer

    def get_queryset(self):
        # Возвращаем только те, где is_weekly = True
        return TelegramApp.objects.filter(is_weekly=True).order_by('-rating')

# 3. API для получения списка всех категорий
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.prefetch_related('subcategories__apps').all()
    serializer_class = CategorySerializer

# 4. API для детальной страницы раздела (например, /category/tap-to-earn)
class SubCategoryDetailView(generics.RetrieveAPIView):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategoryDetailSerializer
    lookup_field = 'slug'