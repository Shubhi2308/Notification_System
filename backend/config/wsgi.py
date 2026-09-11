import os

from django.core.wsgi import get_wsgi_application
from django.core.management import call_command

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

application = get_wsgi_application()

# Create or update the demo user when the application starts.
try:
    call_command("create_demo_user")
except Exception as exc:
    print(f"Demo user setup failed: {exc}")