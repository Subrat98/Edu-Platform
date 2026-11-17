from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    Student,
    AttendanceRecord,
    Examination,
    ExamResult,
    AdmissionApplication,
    CertificateRequest,
    FeeTransaction,
)
from .serializers import (
    StudentSerializer,
    AttendanceRecordSerializer,
    ExaminationSerializer,
    ExamResultSerializer,
    AdmissionApplicationSerializer,
    CertificateRequestSerializer,
    FeeTransactionSerializer,
)


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["full_name", "roll_number", "class_or_programme"]

    def get_queryset(self):
        qs = super().get_queryset()
        inst = self.request.query_params.get("institution")
        if inst:
            qs = qs.filter(institution_id=inst)
        return qs


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        student_id = self.request.query_params.get("student_id")
        date_str = self.request.query_params.get("date")
        if student_id:
            qs = qs.filter(student_id=student_id)
        if date_str:
            qs = qs.filter(date=date_str)
        return qs

    @action(detail=False, methods=["get"])
    def summary(self, request):
        student_id = request.query_params.get("student_id")
        qs = self.get_queryset()
        if student_id:
            qs = qs.filter(student_id=student_id)
        total = qs.count()
        present = qs.filter(status="Present").count()
        pct = round((present / total) * 100, 1) if total > 0 else 100.0
        return Response({
            "total_days": total,
            "present_days": present,
            "attendance_percentage": pct
        })


class ExaminationViewSet(viewsets.ModelViewSet):
    queryset = Examination.objects.all()
    serializer_class = ExaminationSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        inst = self.request.query_params.get("institution")
        if inst:
            qs = qs.filter(institution_id=inst)
        return qs


class ExamResultViewSet(viewsets.ModelViewSet):
    queryset = ExamResult.objects.all()
    serializer_class = ExamResultSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        exam_id = self.request.query_params.get("exam_id")
        student_id = self.request.query_params.get("student_id")
        if exam_id:
            qs = qs.filter(examination_id=exam_id)
        if student_id:
            qs = qs.filter(student_id=student_id)
        return qs


class AdmissionApplicationViewSet(viewsets.ModelViewSet):
    queryset = AdmissionApplication.objects.all()
    serializer_class = AdmissionApplicationSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        inst = self.request.query_params.get("institution")
        if inst:
            qs = qs.filter(institution_id=inst)
        return qs


class CertificateRequestViewSet(viewsets.ModelViewSet):
    queryset = CertificateRequest.objects.all()
    serializer_class = CertificateRequestSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        student_id = self.request.query_params.get("student_id")
        if student_id:
            qs = qs.filter(student_id=student_id)
        return qs


class FeeTransactionViewSet(viewsets.ModelViewSet):
    queryset = FeeTransaction.objects.all()
    serializer_class = FeeTransactionSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        student_id = self.request.query_params.get("student_id")
        if student_id:
            qs = qs.filter(student_id=student_id)
        return qs
