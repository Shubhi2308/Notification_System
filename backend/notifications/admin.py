from django.contrib import admin
from .models import Trigger, NotificationTemplate, NotificationProfile


admin.site.register(Trigger)
admin.site.register(NotificationTemplate)
admin.site.register(NotificationProfile)
