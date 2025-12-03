from django.db import models

class TelegramApp(models.Model):
    title = models.CharField(max_length=255, verbose_name="Название")
    version = models.CharField(max_length=50, default="1.0", verbose_name="Версия")
    username = models.CharField(max_length=100, unique=True, help_text="Например: @notcoin_bot")
    telegram_url = models.URLField(verbose_name="Ссылка на бота")
    
    # Описание для ИИ и для сайта
    description = models.TextField(blank=True, verbose_name="Описание")
    short_description = models.CharField(max_length=255, blank=True, verbose_name="Короткое описание (для карточек)")
    
    # Картинка (пока текстом, парсер будет вставлять ссылку)
    icon = models.ImageField(upload_to='icons/', blank=True, null=True, verbose_name="Иконка (Файл)")    
    CATEGORY_CHOICES = [
        ('DeFi', 'DeFi'),
        ('Game', 'Game'),
        ('Social', 'Social'),
        ('Utility', 'Utility'),
        ('Marketplace', 'Marketplace'),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, verbose_name="Категория")
    
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0, verbose_name="Рейтинг")
    users_count = models.CharField(max_length=50, default="N/A", verbose_name="Кол-во пользователей")
    
    # ВАЖНЫЕ ПОЛЯ ДЛЯ ТВОЕЙ ЗАДАЧИ
    is_hero = models.BooleanField(default=False, verbose_name="🔥 Показать в Hero (Главный баннер)")
    is_weekly = models.BooleanField(default=False, verbose_name="🏆 Приложение недели")
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Приложение"
        verbose_name_plural = "Приложения"