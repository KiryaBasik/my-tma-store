from rest_framework import generics
from django.db.models import Q
from .models import TelegramApp, Category, SubCategory
from .serializers import (
    TelegramAppSerializer, 
    CategorySerializer, 
    SubCategoryDetailSerializer
)

# 1. Hero: Список, без пагинации (чтобы отдать чистый массив)
class HeroAppView(generics.ListAPIView):
    serializer_class = TelegramAppSerializer
    pagination_class = None # <--- ВАЖНО! Отключает { count: ... }

    def get_queryset(self):
        return TelegramApp.objects.filter(is_hero=True)

# 2. Weekly: Тоже отключаем пагинацию
class WeeklyAppsView(generics.ListAPIView):
    serializer_class = TelegramAppSerializer
    pagination_class = None # <--- ВАЖНО!

    def get_queryset(self):
        return TelegramApp.objects.filter(is_weekly=True).order_by('-rating')

# 3. Top Apps (Приложения дня): Тоже отключаем
class TopAppsView(generics.ListAPIView):
    serializer_class = TelegramAppSerializer
    pagination_class = None # <--- ВАЖНО!

    def get_queryset(self):
        return TelegramApp.objects.filter(is_hero=False).order_by('-rating')[:8]

# 4. Категории: Тоже отключаем
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.prefetch_related('subcategories__apps').all()
    serializer_class = CategorySerializer
    pagination_class = None # <--- ВАЖНО!

# 5. Детальная категория
class SubCategoryDetailView(generics.RetrieveAPIView):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategoryDetailSerializer
    lookup_field = 'slug'

# 6. Поиск
class SearchAppsView(generics.ListAPIView):
    serializer_class = TelegramAppSerializer
    pagination_class = None # <--- ВАЖНО!

    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        if not query:
            return TelegramApp.objects.none()
        
        return TelegramApp.objects.filter(
            Q(title_en__icontains=query) | 
            Q(title_ru__icontains=query) | 
            Q(username__icontains=query) |
            Q(subcategory__name__icontains=query) |
            Q(subcategory__name_en__icontains=query) |
            Q(subcategory__name_ru__icontains=query) |
            Q(subcategory__parent_category__name__icontains=query) |
            Q(subcategory__parent_category__name_en__icontains=query) |
            Q(subcategory__parent_category__name_ru__icontains=query)
        ).distinct()