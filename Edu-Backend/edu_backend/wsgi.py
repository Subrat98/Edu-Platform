"""
WSGI config for Edu-Backend project.
"""
import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "deps"))
sys.path.insert(0, str(BASE_DIR / "apps"))
sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "edu_backend.settings")

from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()
