from django.contrib import admin
from .models import Page, ContactInquiry, MediaAsset


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ("slug", "title", "institution_id", "is_published", "updated_at")
    list_filter = ("institution_id", "is_published")
    search_fields = ("slug", "title", "content")


@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "institution_id", "is_resolved", "created_at")
    list_filter = ("institution_id", "is_resolved")
    search_fields = ("name", "email", "subject", "message")


@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "asset_type", "institution_id", "uploaded_at")
    list_filter = ("category", "asset_type", "institution_id")
