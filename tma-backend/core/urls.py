"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

# ДОБАВЛЯЕМ TopAppsView и AppDetailView в импорты
from apps_store.views import (
    HeroAppView, 
    WeeklyAppsView, 
    TopAppsView,  # <--- БЫЛО ПРОПУЩЕНО
    CategoryListView, 
    SubCategoryDetailView, 
    SearchAppsView, 
    AppDetailView,
    NewsListView,
    NewsDetailView,
    StatsView
)

urlpatterns = [
    path('', RedirectView.as_view(url='/admin/', permanent=False)),
    path('admin/', admin.site.urls),
    
    path('api/hero/', HeroAppView.as_view()),
    path('api/weekly/', WeeklyAppsView.as_view()),
    
    # ВОТ ЭТОГО НЕ ХВАТАЛО:
    path('api/apps/', TopAppsView.as_view()), 
    
    path('api/categories/', CategoryListView.as_view()),
    path('api/subcategory/<slug:slug>/', SubCategoryDetailView.as_view()),
    path('api/search/', SearchAppsView.as_view()),
    path('api/app/<str:username>/', AppDetailView.as_view()),
    path('ckeditor/', include('ckeditor_uploader.urls')),
    path('api/news/', NewsListView.as_view()),
    path('api/news/<int:id>/', NewsDetailView.as_view()), 
    path('api/stats/', StatsView.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)