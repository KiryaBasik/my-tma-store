from django.db import models
from ckeditor.fields import RichTextField

# 1. КАТЕГОРИИ (Вернули поля name_en / name_ru)
class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название (Техническое)")
    
    # --- ВОТ ЭТИ ПОЛЯ БЫЛИ ПОТЕРЯНЫ, ВОЗВРАЩАЕМ: ---
    name_en = models.CharField(max_length=100, verbose_name="Name (EN)", blank=True)
    name_ru = models.CharField(max_length=100, verbose_name="Название (RU)", blank=True)
    # -----------------------------------------------
    
    slug = models.SlugField(unique=True)
    icon_emoji = models.CharField(max_length=10, blank=True)
    color_theme = models.CharField(max_length=20, default='blue')

    def __str__(self): return self.name
    class Meta: 
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

class SubCategory(models.Model):
    parent_category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100, verbose_name="Name (EN)", blank=True)
    name_ru = models.CharField(max_length=100, verbose_name="Название (RU)", blank=True)
    slug = models.SlugField()
    icon_emoji = models.CharField(max_length=10, blank=True)

    def __str__(self): return f"{self.parent_category.name} -> {self.name}"
    class Meta: 
        verbose_name = "Подкатегория" 
        verbose_name_plural = "Подкатегории"

# 2. ПРИЛОЖЕНИЯ
class TelegramApp(models.Model):
    username = models.CharField(max_length=100, unique=True)
    telegram_url = models.URLField()
    icon = models.ImageField(upload_to='icons/', blank=True, null=True)
    
    # Тексты
    title_en = models.CharField(max_length=255, blank=True, verbose_name="Title (EN)")
    title_ru = models.CharField(max_length=255, blank=True, verbose_name="Название (RU)")
    description_en = models.TextField(blank=True, verbose_name="Desc (EN)")
    description_ru = models.TextField(blank=True, verbose_name="Описание (RU)")
    short_description_en = models.CharField(max_length=255, blank=True)
    short_description_ru = models.CharField(max_length=255, blank=True)

    subcategory = models.ForeignKey(SubCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='apps')
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    users_count_str = models.CharField(max_length=50, default="N/A")
    
    # Партнерка
    has_affiliate = models.BooleanField(default=False)
    affiliate_link = models.CharField(max_length=255, blank=True, null=True)
    STATUS_CHOICES = [('pending', '⏳ Ожидание'), ('connected', '✅ Подключена'), ('manual', '🛠 Вручную'), ('none', '❌ Нет')]
    affiliate_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Флаги
    is_ai_processed = models.BooleanField(default=False)
    is_hero = models.BooleanField(default=False, verbose_name="🔥 В Hero баннер")
    is_weekly = models.BooleanField(default=False, verbose_name="🏆 В выбор недели")
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def title(self): return self.title_ru or self.title_en or self.username
    def __str__(self): return self.title
    class Meta: 
        verbose_name = "Приложение" 
        verbose_name_plural = "Все приложения"

# --- ПРОКСИ МОДЕЛИ ---
class HeroAppProxy(TelegramApp):
    class Meta:
        proxy = True
        verbose_name = "🔥 Hero Приложение"
        verbose_name_plural = "🔥 Hero Баннер (Топ)"

class WeeklyAppProxy(TelegramApp):
    class Meta:
        proxy = True
        verbose_name = "🏆 Weekly Приложение"
        verbose_name_plural = "🏆 Выбор недели"

# 3. НОВОСТИ
class NewsPost(models.Model):
    title_en = models.CharField(max_length=255, verbose_name="Заголовок (EN)")
    title_ru = models.CharField(max_length=255, verbose_name="Заголовок (RU)", blank=True)
    
    content_en = RichTextField(verbose_name="Контент (EN)")
    content_ru = RichTextField(verbose_name="Контент (RU)", blank=True)
    
    image = models.ImageField(upload_to='news/', verbose_name="Обложка")
    category = models.CharField(max_length=50, default="Guide", verbose_name="Тег (Guide, News...)")
    
    created_at = models.DateTimeField(auto_now_add=True)
    is_published = models.BooleanField(default=True, verbose_name="Опубликовано")

    def __str__(self): return self.title_en
    class Meta: 
        verbose_name = "Новость" 
        verbose_name_plural = "📰 Новости и Статьи"