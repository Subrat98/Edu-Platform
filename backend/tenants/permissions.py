from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import TenantMembership

RESOURCE_MAP = {
    'notices': 'notices',
    'departments': 'departments',
    'banners': 'banners',
    'pages': 'pages',
    'menu-sections': 'menu-sections',
    'gallery': 'gallery',
    'contact-messages': 'contact-messages',
    'hostels': 'hostels',
    'hostel-room-types': 'hostels',
    'hostel-mess-menu': 'hostels',
    'hostel-notices': 'hostels',
    'hostel-fee-heads': 'hostels',
    'hostel-fees': 'hostels',
}

METHOD_ACTION_MAP = {
    'GET': 'read',
    'HEAD': 'read',
    'OPTIONS': 'read',
    'POST': 'create',
    'PUT': 'edit',
    'PATCH': 'edit',
    'DELETE': 'delete',
}


def has_tenant_resource_access(request, view):
    tenant = getattr(request, 'tenant', None)
    user = getattr(request, 'user', None)
    if not tenant or not user or not user.is_authenticated:
        return False
    if user.is_superuser:
        return True
    is_member = TenantMembership.objects.using('default').filter(tenant=tenant, user=user, is_active=True).exists()
    if not is_member:
        return False

    perms = getattr(tenant, 'permissions', None) or {}
    basename = getattr(view, 'basename', None)
    resource_key = RESOURCE_MAP.get(basename)
    if not resource_key:
        return True

    allowed_resources = perms.get('resources')
    if isinstance(allowed_resources, list) and resource_key not in allowed_resources:
        return False

    actions = perms.get('actions')
    if isinstance(actions, dict) and resource_key in actions:
        mod_perms = actions.get(resource_key) or {}
        action_name = METHOD_ACTION_MAP.get(request.method, 'read')
        if not mod_perms.get(action_name, False):
            return False

    return True


class TenantStaffOrPublicRead(BasePermission):
    """Public read; writes require an active staff membership (or superuser) with RBAC CRUD permission."""
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return has_tenant_resource_access(request, view)


class TenantStaffOnly(BasePermission):
    def has_permission(self, request, view):
        return has_tenant_resource_access(request, view)
