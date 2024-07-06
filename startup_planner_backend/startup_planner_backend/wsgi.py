import os
import sys
from django.core.wsgi import get_wsgi_application

port = os.getenv('PORT')
sys.stdout.write(
    f"Starting WSGI application with settings: {os.getenv('DJANGO_SETTINGS_MODULE')}\n")
sys.stdout.write(f"Binding to port: {port}\n")

os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'startup_planner_backend.settings')

application = get_wsgi_application()

