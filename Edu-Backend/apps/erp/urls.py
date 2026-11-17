from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StudentViewSet,
    AttendanceViewSet,
    ExaminationViewSet,
    ExamResultViewSet,
    AdmissionApplicationViewSet,
    CertificateRequestViewSet,
    FeeTransactionViewSet,
)

router = DefaultRouter()
router.register(r"students", StudentViewSet, basename="student")
router.register(r"attendance", AttendanceViewSet, basename="attendance")
router.register(r"examinations", ExaminationViewSet, basename="examination")
router.register(r"exam-results", ExamResultViewSet, basename="exam-result")
router.register(r"admissions", AdmissionApplicationViewSet, basename="admission")
router.register(r"certificate-requests", CertificateRequestViewSet, basename="certificate-request")
router.register(r"fee-transactions", FeeTransactionViewSet, basename="fee-transaction")

urlpatterns = [
    path("", include(router.urls)),
]
