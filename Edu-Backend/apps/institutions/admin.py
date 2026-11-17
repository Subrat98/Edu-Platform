from django.contrib import admin
from .models import Institution, PlatformSettings


@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "type", "established_year", "phone", "email", "is_visible")
    list_filter = ("type", "is_visible")
    search_fields = ("name", "tagline", "city")


@admin.register(PlatformSettings)
class PlatformSettingsAdmin(admin.ModelAdmin):
    list_display = ("id", "content_mode", "school_visible", "college_visible", "maintenance_mode", "updated_at")
