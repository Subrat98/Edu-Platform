from django.contrib import admin
from .models import Notice


@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "institution_id", "date", "pinned", "important", "audience")
    list_filter = ("category", "institution_id", "pinned", "important", "audience")
    search_fields = ("title", "description")
