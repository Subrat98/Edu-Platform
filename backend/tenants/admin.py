from django.contrib import admin
from .models import Tenant, TenantMembership

class TenantMembershipInline(admin.TabularInline):
    model = TenantMembership
    extra = 0

@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'database_name', 'domain', 'is_active', 'created_at')
    search_fields = ('name', 'slug', 'database_name', 'domain')
    list_filter = ('is_active',)
    inlines = [TenantMembershipInline]

@admin.register(TenantMembership)
class TenantMembershipAdmin(admin.ModelAdmin):
    list_display = ('tenant', 'user', 'role', 'is_active')
    list_filter = ('tenant', 'role', 'is_active')
    search_fields = ('tenant__name', 'user__username', 'user__email')
