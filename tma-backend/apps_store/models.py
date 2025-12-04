from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название (Техническое)")
    slug = models.SlugField(unique=True)
    icon_emoji = models.CharField(max_length=10, blank=True)
    color_theme = models.CharField(max_length=20, default='blue')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

class SubCategory(models.Model):
    parent_category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=100)
    slug = models.SlugField()
    icon_emoji = models.CharField(max_length=10, blank=True)

    def __str__(self):
        return f"{self.parent_category.name} -> {self.name}"
    
    class Meta:
        verbose_name = "Подкатегория"
        verbose_name_plural = "Подкатегории"

class TelegramApp(models.Model):
    # Технические поля
    username = models.CharField(max_length=100, unique=True)
    telegram_url = models.URLField()
    icon = models.ImageField(upload_to='icons/', blank=True, null=True)
    
    # === МУЛЬТИЯЗЫЧНОСТЬ ===
    title_en = models.CharField(max_length=255, blank=True, verbose_name="Title (EN)")
    title_ru = models.CharField(max_length=255, blank=True, verbose_name="Название (RU)")
    
    description_en = models.TextField(blank=True, verbose_name="Desc (EN)")
    description_ru = models.TextField(blank=True, verbose_name="Описание (RU)")
    
    short_description_en = models.CharField(max_length=255, blank=True)
    short_description_ru = models.CharField(max_length=255, blank=True)

    subcategory = models.ForeignKey(SubCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='apps')
    
    # Рейтинг и юзеры
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    users_count_str = models.CharField(max_length=50, default="N/A")
    
    # === ПАРТНЕРКА (Важно для ошибки get_affiliate_status_display) ===
    has_affiliate = models.BooleanField(default=False)
    affiliate_link = models.CharField(max_length=255, blank=True, null=True)
    
    STATUS_CHOICES = [
        ('pending', '⏳ Ожидание'),
        ('connected', '✅ Подключена'),
        ('manual', '🛠 Вручную'),
        ('none', '❌ Нет'),
    ]
    affiliate_status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, # <--- Вот это дает метод get_..._display()
        default='pending'
    )
    
    # Статусы
    is_ai_processed = models.BooleanField(default=False)
    is_hero = models.BooleanField(default=False)
    is_weekly = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)

    # Свойство для удобного отображения (не поле БД!)
    @property
    def title(self):
        return self.title_ru or self.title_en or self.username

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Приложение"
        verbose_name_plural = "Приложения"