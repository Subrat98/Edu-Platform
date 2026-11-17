from rest_framework import serializers
from .models import (
    Student,
    AttendanceRecord,
    Examination,
    ExamResult,
    AdmissionApplication,
    CertificateRequest,
    FeeTransaction,
)


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"


class AttendanceRecordSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.full_name", read_only=True)
    roll_number = serializers.CharField(source="student.roll_number", read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = "__all__"


class ExaminationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Examination
        fields = "__all__"


class ExamResultSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.full_name", read_only=True)
    roll_number = serializers.CharField(source="student.roll_number", read_only=True)

    class Meta:
        model = ExamResult
        fields = "__all__"


class AdmissionApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdmissionApplication
        fields = "__all__"


class CertificateRequestSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.full_name", read_only=True)

    class Meta:
        model = CertificateRequest
        fields = "__all__"


class FeeTransactionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.full_name", read_only=True)
    roll_number = serializers.CharField(source="student.roll_number", read_only=True)

    class Meta:
        model = FeeTransaction
        fields = "__all__"
