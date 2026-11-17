from rest_framework import serializers
from .models import Notice


class NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = [
            "id",
            "title",
            "institution_id",
            "category",
            "date",
            "pinned",
            "important",
            "description",
            "pdf_url",
            "audience",
            "created_at",
            "updated_at",
        ]
