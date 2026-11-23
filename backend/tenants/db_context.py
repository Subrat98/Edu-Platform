from contextvars import ContextVar
from django.conf import settings
from django.db import connections

_current_tenant_db = ContextVar('current_tenant_db', default=None)

def set_current_tenant_db(alias):
    return _current_tenant_db.set(alias)

def reset_current_tenant_db(token):
    _current_tenant_db.reset(token)

def get_current_tenant_db():
    return _current_tenant_db.get()

def configure_tenant_database(alias, database_name):
    """Register a tenant PostgreSQL database with all standard Django connection settings."""
    config = {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': database_name,
        'USER': getattr(settings, 'TENANT_DB_USER', ''),
        'PASSWORD': getattr(settings, 'TENANT_DB_PASSWORD', ''),
        'HOST': getattr(settings, 'TENANT_DB_HOST', '127.0.0.1'),
        'PORT': getattr(settings, 'TENANT_DB_PORT', '5432'),
        'CONN_MAX_AGE': 600,
        'CONN_HEALTH_CHECKS': False,
        'ATOMIC_REQUESTS': False,
        'AUTOCOMMIT': True,
        'TIME_ZONE': None,
        'OPTIONS': {'connect_timeout': 5},
        'TEST': {
            'CHARSET': None,
            'COLLATION': None,
            'MIGRATE': True,
            'MIRROR': None,
            'NAME': None,
        },
    }
    settings.DATABASES[alias] = config
    connections.databases[alias] = config
    return config
