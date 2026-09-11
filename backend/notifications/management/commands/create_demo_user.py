import os

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = "Create or update the demo user."

    def handle(self, *args, **options):
        username = os.getenv("DEMO_USERNAME", "admin")
        email = os.getenv("DEMO_EMAIL")
        password = os.getenv("DEMO_PASSWORD")

        if not email or not password:
            self.stdout.write(
                self.style.WARNING(
                    "DEMO_EMAIL or DEMO_PASSWORD is not configured. "
                    "Skipping demo user creation."
                )
            )
            return

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": username,
                "is_staff": True,
                "is_superuser": True,
            },
        )

        user.username = username
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save()

        if created:
            self.stdout.write(
                self.style.SUCCESS("Demo user created successfully.")
            )
        else:
            self.stdout.write(
                self.style.SUCCESS("Demo user already exists. Password updated.")
            )