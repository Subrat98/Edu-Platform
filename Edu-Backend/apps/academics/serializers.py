from rest_framework import serializers
from .models import Department, Programme, ClassSection, CourseSubject


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"


class ProgrammeSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)

    class Meta:
        model = Programme
        fields = "__all__"


class ClassSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassSection
        fields = "__all__"


class CourseSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseSubject
        fields = "__all__"
