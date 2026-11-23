from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import TenantMembership

class TenantStaffOrPublicRead(BasePermission):
    """Public read; writes require an active staff membership in the selected tenant."""
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        tenant = getattr(request, 'tenant', None)
        user = request.user
        return bool(tenant and user and user.is_authenticated and TenantMembership.objects.using('default').filter(tenant=tenant, user=user, is_active=True).exists())

class TenantStaffOnly(BasePermission):
    def has_permission(self, request, view):
        tenant = getattr(request, 'tenant', None)
        user = request.user
        return bool(tenant and user and user.is_authenticated and TenantMembership.objects.using('default').filter(tenant=tenant, user=user, is_active=True).exists())
