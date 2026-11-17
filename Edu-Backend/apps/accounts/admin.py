from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("username", "email", "first_name", "last_name", "role", "institution_id", "is_staff")
    list_filter = ("role", "institution_id", "is_staff", "is_superuser", "is_active")
    search_fields = ("username", "first_name", "last_name", "email", "department")
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Institution & Role", {
            "fields": ("role", "institution_id", "department", "designation", "avatar", "phone", "metadata")
        }),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Institution & Role", {
            "fields": ("role", "institution_id", "department", "designation", "phone")
        }),
    )
