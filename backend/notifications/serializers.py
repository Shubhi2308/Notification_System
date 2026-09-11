from rest_framework import serializers
from .models import Trigger, NotificationTemplate


class TriggerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trigger
        fields = [
            "id",
            "name",
            "description",
            "is_active",
            "created_at",
        ]


class NotificationTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationTemplate
        fields = [
            "id",
            "trigger",
            "channel",
            "title",
            "subject",
            "body",
            "is_active",
            "created_at",
            "updated_at",
        ]