from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InstitutionViewSet, PlatformSettingsViewSet

router = DefaultRouter()
router.register(r"institutions", InstitutionViewSet, basename="institution")
router.register(r"platform-settings", PlatformSettingsViewSet, basename="platform-settings")

urlpatterns = [
    path("", include(router.urls)),
]
