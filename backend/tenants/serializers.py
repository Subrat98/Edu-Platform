from rest_framework import serializers
from .models import Tenant

class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = ('id', 'name', 'slug', 'database_name', 'domain', 'is_active', 'created_at')
        read_only_fields = ('id', 'database_name', 'created_at')
