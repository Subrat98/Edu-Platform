import re
from django.conf import settings
from django.db import connections
from django.http import JsonResponse
from .db_context import set_current_tenant_db, reset_current_tenant_db, configure_tenant_database
from .models import Tenant

SLUG_RE = re.compile(r'^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$')

class TenantResolutionMiddleware:
    """Resolve tenant by X-Tenant-Slug (local/dev) or registered custom domain/subdomain."""
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        host = request.get_host().split(':', 1)[0].lower()
        slug = request.headers.get('X-Tenant-Slug', '').strip().lower()
        if not slug:
            tenant = Tenant.objects.using('default').filter(domain__iexact=host, is_active=True).first()
            if tenant is None:
                base = getattr(settings, 'TENANT_BASE_DOMAIN', '')
                if base and host.endswith('.' + base):
                    slug = host[:-(len(base) + 1)].split('.')[0]
        else:
            tenant = None
        if slug:
            if not SLUG_RE.fullmatch(slug):
                return JsonResponse({'detail': 'Invalid tenant identifier.'}, status=400)
            tenant = Tenant.objects.using('default').filter(slug=slug, is_active=True).first()
        if tenant is None:
            # Keep non-tenant operational routes available; tenant APIs must provide a tenant.
            if request.path.startswith('/api/') and not request.path.startswith('/api/platform/'):
                return JsonResponse({'detail': 'Tenant not found. Send a valid X-Tenant-Slug header or use a registered tenant domain.'}, status=404)
            return self.get_response(request)

        alias = f'tenant_{tenant.pk}'
        if alias not in settings.DATABASES:
            configure_tenant_database(alias, tenant.database_name)
        request.tenant = tenant
        request.tenant_db = alias
        token = set_current_tenant_db(alias)
        try:
            return self.get_response(request)
        finally:
            reset_current_tenant_db(token)
