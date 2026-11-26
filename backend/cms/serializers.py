from rest_framework import serializers
from .models import (
    Notice,Department,Banner,Page,GalleryImage,ContactMessage,MenuSection,
    Hostel,HostelRoomType,HostelMessMenu,HostelNotice,HostelFeeHead,HostelFee,
)
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
class HostelSerializer(serializers.ModelSerializer):
    class Meta: model=Hostel; fields='__all__'
class HostelRoomTypeSerializer(serializers.ModelSerializer):
    class Meta: model=HostelRoomType; fields='__all__'
class HostelMessMenuSerializer(serializers.ModelSerializer):
    class Meta: model=HostelMessMenu; fields='__all__'
class HostelNoticeSerializer(serializers.ModelSerializer):
    class Meta: model=HostelNotice; fields='__all__'
class HostelFeeHeadSerializer(serializers.ModelSerializer):
    class Meta: model=HostelFeeHead; fields='__all__'
class HostelFeeSerializer(serializers.ModelSerializer):
    class Meta: model=HostelFee; fields='__all__'; read_only_fields=('slug',)
