import random
from datetime import date
from rest_framework import generics
from django.db.models import Q
from .models import TelegramApp, Category, SubCategory, NewsPost
from .serializers import (
    TelegramAppSerializer, 
    CategorySerializer, 
    SubCategoryDetailSerializer,
    NewsPostSerializer
)

# 1. Hero: Список, без пагинации
class HeroAppView(generics.ListAPIView):
    serializer_class = TelegramAppSerializer
    pagination_class = None

    def get_queryset(self):
        return TelegramApp.objects.filter(is_hero=True)

# 2. Weekly: Тоже отключаем пагинацию
class WeeklyAppsView(generics.ListAPIView):
    serializer_class = TelegramAppSerializer
    pagination_class = None

    def get_queryset(self):
        return TelegramApp.objects.filter(is_weekly=True).order_by('-rating')

# 3. Top Apps (Приложения дня): Исправленная логика
class TopAppsView(generics.ListAPIView):
    serializer_class = TelegramAppSerializer
    pagination_class = None 

    def get_queryset(self):
        # 1. Берем ВСЕ приложения из базы
        queryset = list(TelegramApp.objects.all())
        
        if not queryset:
            return []

        # 2. Генерация "случайности" на основе сегодняшней даты
        # Это гарантирует, что список меняется раз в 24 часа, но одинаков для всех юзеров
        today_seed = date.today().toordinal()
        random.seed(today_seed)
        random.shuffle(queryset)
        
        # 3. Возвращаем первые 6 штук для сетки (или меньше, если их мало)
        return queryset[:6]

# 4. Категории
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.prefetch_related('subcategories__apps').all()
    serializer_class = CategorySerializer
    pagination_class = None

# 5. Детальная категория
class SubCategoryDetailView(generics.RetrieveAPIView):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategoryDetailSerializer
    lookup_field = 'slug'

# 6. Поиск
class SearchAppsView(generics.ListAPIView):
    serializer_class = TelegramAppSerializer
    pagination_class = None 

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

# 7. Детальная страница приложения (по username)
class AppDetailView(generics.RetrieveAPIView):
    queryset = TelegramApp.objects.all()
    serializer_class = TelegramAppSerializer
    lookup_field = 'username'

    def get_object(self):
        # Получаем username из URL
        username = self.kwargs.get('username')
        # Если фронт передал "notcoin_bot", а в базе "@notcoin_bot", добавляем собачку
        if username and not username.startswith('@'):
            username = f"@{username}"
        
        # Ищем в базе
        try:
            return TelegramApp.objects.get(username__iexact=username)
        except TelegramApp.DoesNotExist:
            # Если не нашли, пробуем без собачки (на всякий случай)
            return generics.get_object_or_404(TelegramApp, username__iexact=username.replace('@', ''))

class NewsListView(generics.ListAPIView):
    serializer_class = NewsPostSerializer
    pagination_class = None

    def get_queryset(self):
        return NewsPost.objects.filter(is_published=True).order_by('-created_at')
    
class NewsDetailView(generics.RetrieveAPIView):
    queryset = NewsPost.objects.filter(is_published=True)
    serializer_class = NewsPostSerializer
    lookup_field = 'id'