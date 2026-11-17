from rest_framework import serializers
from .models import Page, ContactInquiry, MediaAsset


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = "__all__"


class ContactInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInquiry
        fields = "__all__"


class MediaAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaAsset
        fields = "__all__"
