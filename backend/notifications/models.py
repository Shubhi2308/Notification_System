from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Trigger(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class NotificationTemplate(models.Model):
    CHANNEL_CHOICES = [
        ("WHATSAPP", "WhatsApp"),
        ("EMAIL", "Email"),
        ("WEB_PUSH", "Web Push"),
    ]

    trigger = models.ForeignKey(
        Trigger,
        on_delete=models.CASCADE,
        related_name="templates"
    )

    channel = models.CharField(
        max_length=20,
        choices=CHANNEL_CHOICES
    )

    title = models.CharField(max_length=255, blank=True)
    subject = models.CharField(max_length=255, blank=True)
    body = models.TextField()

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.trigger.name} - {self.channel}"

class NotificationProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="notification_profile"
    )
    phone_number = models.CharField(max_length=20, blank=True)
    onesignal_player_id = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.user.username