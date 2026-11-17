from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NaacCriterionViewSet, NaacMetricEvidenceViewSet

router = DefaultRouter()
router.register(r"criteria", NaacCriterionViewSet, basename="naac-criterion")
router.register(r"evidence", NaacMetricEvidenceViewSet, basename="naac-evidence")

urlpatterns = [
    path("", include(router.urls)),
]
