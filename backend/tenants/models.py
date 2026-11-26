from django.conf import settings
from django.db import models

class Tenant(models.Model):
    name = models.CharField(max_length=180)
    slug = models.SlugField(max_length=63, unique=True)
    database_name = models.CharField(max_length=63, unique=True)
    domain = models.CharField(max_length=255, blank=True, unique=True, null=True)
    is_active = models.BooleanField(default=True)
    permissions = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f'{self.name} ({self.slug})'

class TenantMembership(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tenant_memberships')
    is_active = models.BooleanField(default=True)
    role = models.CharField(max_length=30, default='admin')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['tenant', 'user'], name='unique_tenant_user_membership')]

    def __str__(self):
        return f'{self.user} @ {self.tenant}'
