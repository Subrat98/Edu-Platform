import uuid
from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "password",
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
        extra_kwargs = {
            "id": {"required": False},
            "username": {"required": False},
        }

    def get_name(self, obj):
        full = f"{obj.first_name} {obj.last_name}".strip()
        return full or obj.username

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        if not validated_data.get("username"):
            email = validated_data.get("email", "")
            if email and "@" in email:
                validated_data["username"] = email.split("@")[0].lower()
            else:
                validated_data["username"] = f"user_{uuid.uuid4().hex[:6]}"
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=True)
    user_id = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(required=False, allow_blank=True)
