from rest_framework import serializers
from .models import Notice,Department,Banner,Page,GalleryImage,ContactMessage,MenuSection
class NoticeSerializer(serializers.ModelSerializer):
    is_new=serializers.ReadOnlyField()
    class Meta: model=Notice; fields='__all__'
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta: model=Department; fields='__all__'
class BannerSerializer(serializers.ModelSerializer):
    class Meta: model=Banner; fields='__all__'
class PageSerializer(serializers.ModelSerializer):
    class Meta: model=Page; fields='__all__'
class GallerySerializer(serializers.ModelSerializer):
    class Meta: model=GalleryImage; fields='__all__'
class MenuSectionSerializer(serializers.ModelSerializer):
    class Meta: model=MenuSection; fields='__all__'
class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model=ContactMessage; fields='__all__'; read_only_fields=('is_read','created_at','updated_at')
