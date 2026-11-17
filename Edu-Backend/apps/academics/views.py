from rest_framework import viewsets
from .models import Department, Programme, ClassSection, CourseSubject
from .serializers import (
    DepartmentSerializer,
    ProgrammeSerializer,
    ClassSectionSerializer,
    CourseSubjectSerializer,
)


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        inst = self.request.query_params.get("institution")
        if inst:
            qs = qs.filter(institution_id=inst)
        return qs


class ProgrammeViewSet(viewsets.ModelViewSet):
    queryset = Programme.objects.all()
    serializer_class = ProgrammeSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        inst = self.request.query_params.get("institution")
        level = self.request.query_params.get("level")
        dept = self.request.query_params.get("department")
        if inst:
            qs = qs.filter(institution_id=inst)
        if level:
            qs = qs.filter(level=level)
        if dept:
            qs = qs.filter(department_id=dept)
        return qs


class ClassSectionViewSet(viewsets.ModelViewSet):
    queryset = ClassSection.objects.all()
    serializer_class = ClassSectionSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        inst = self.request.query_params.get("institution")
        if inst:
            qs = qs.filter(institution_id=inst)
        return qs


class CourseSubjectViewSet(viewsets.ModelViewSet):
    queryset = CourseSubject.objects.all()
    serializer_class = CourseSubjectSerializer
