from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PageViewSet, ContactInquiryViewSet, MediaAssetViewSet

router = DefaultRouter()
router.register(r"pages", PageViewSet, basename="page")
router.register(r"contact-inquiries", ContactInquiryViewSet, basename="contact-inquiry")
router.register(r"media", MediaAssetViewSet, basename="media-asset")

urlpatterns = [
    path("", include(router.urls)),
]
