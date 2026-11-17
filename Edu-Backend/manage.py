#!/usr/bin/env python3
"""Django's command-line utility for administrative tasks."""
import os
import sys
from pathlib import Path

# Automatically inject deps and apps into Python module search path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR / "deps"))
sys.path.insert(0, str(BASE_DIR / "apps"))
sys.path.insert(0, str(BASE_DIR))


def main():
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "edu_backend.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
