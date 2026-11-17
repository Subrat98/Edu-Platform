from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "name",
            "first_name",
            "last_name",
            "role",
            "institution_id",
            "avatar",
            "phone",
            "department",
            "designation",
            "metadata",
            "is_active",
        ]

    def get_name(self, obj):
        full = f"{obj.first_name} {obj.last_name}".strip()
        return full or obj.username


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=True)
    user_id = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(required=False, allow_blank=True)
