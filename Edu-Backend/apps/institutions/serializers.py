from rest_framework import serializers
from .models import Institution, PlatformSettings


class InstitutionSerializer(serializers.ModelSerializer):
    contact = serializers.SerializerMethodField()
    socials = serializers.SerializerMethodField()
    theme = serializers.SerializerMethodField()

    class Meta:
        model = Institution
        fields = [
            "id",
            "type",
            "name",
            "short_name",
            "tagline",
            "description",
            "established_year",
            "affiliation",
            "contact",
            "socials",
            "theme",
            "stats",
            "is_visible",
            "created_at",
            "updated_at",
        ]

    def get_contact(self, obj):
        return {
            "address": obj.address,
            "city": obj.city,
            "state": obj.state,
            "pincode": obj.pincode,
            "phone": obj.phone,
            "altPhone": obj.alt_phone,
            "email": obj.email,
            "mapQuery": obj.map_query,
        }

    def get_socials(self, obj):
        return {
            "facebook": obj.facebook,
            "youtube": obj.youtube,
            "instagram": obj.instagram,
            "linkedin": obj.linkedin,
            "twitter": obj.twitter,
        }

    def get_theme(self, obj):
        return {
            "colors": {
                "primary": obj.primary_color,
                "accent": obj.accent_color,
                "background": obj.background_color,
                "textPrimary": obj.text_primary_color,
            },
            "logoUrl": obj.logo_url,
        }


class PlatformSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformSettings
        fields = "__all__"
