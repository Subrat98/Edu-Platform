from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DepartmentViewSet,
    ProgrammeViewSet,
    ClassSectionViewSet,
    CourseSubjectViewSet,
)

router = DefaultRouter()
router.register(r"departments", DepartmentViewSet, basename="department")
router.register(r"programmes", ProgrammeViewSet, basename="programme")
router.register(r"classes", ClassSectionViewSet, basename="class")
router.register(r"courses", CourseSubjectViewSet, basename="course")

urlpatterns = [
    path("", include(router.urls)),
]
