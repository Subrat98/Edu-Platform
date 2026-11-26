from rest_framework import serializers
from .models import Tenant

class TenantSerializer(serializers.ModelSerializer):
    admin_usernames = serializers.SerializerMethodField()

    class Meta:
        model = Tenant
        fields = ('id', 'name', 'slug', 'database_name', 'domain', 'is_active', 'permissions', 'admin_usernames', 'created_at')
        read_only_fields = ('id', 'database_name', 'created_at')

    def get_admin_usernames(self, obj):
        return list(obj.memberships.filter(is_active=True).values_list('user__username', flat=True))
