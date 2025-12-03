from rest_framework import serializers
from .models import TelegramApp

class TelegramAppSerializer(serializers.ModelSerializer):
    class Meta:
        model = TelegramApp
        fields = '__all__'