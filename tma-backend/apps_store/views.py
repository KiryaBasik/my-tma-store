from rest_framework import generics
from .models import TelegramApp
from .serializers import TelegramAppSerializer

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