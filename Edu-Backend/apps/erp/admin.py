from django.contrib import admin
from .models import (
    Student,
    AttendanceRecord,
    Examination,
    ExamResult,
    AdmissionApplication,
    CertificateRequest,
    FeeTransaction,
)


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("roll_number", "full_name", "class_or_programme", "section", "institution_id", "phone", "status")
    list_filter = ("institution_id", "class_or_programme", "status")
    search_fields = ("roll_number", "full_name", "guardian_name")


@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ("student", "date", "status", "remarks")
    list_filter = ("status", "date")
    search_fields = ("student__full_name", "student__roll_number")


@admin.register(Examination)
class ExaminationAdmin(admin.ModelAdmin):
    list_display = ("title", "academic_year", "semester_or_term", "start_date", "end_date", "institution_id", "is_published")
    list_filter = ("academic_year", "institution_id", "is_published")


@admin.register(ExamResult)
class ExamResultAdmin(admin.ModelAdmin):
    list_display = ("student", "examination", "subject_code", "marks_obtained", "max_marks", "grade", "passed")
    list_filter = ("grade", "passed", "examination")
    search_fields = ("student__full_name", "subject_code")


@admin.register(AdmissionApplication)
class AdmissionApplicationAdmin(admin.ModelAdmin):
    list_display = ("applicant_name", "programme_or_grade", "email", "phone", "merit_percentage", "status", "applied_date")
    list_filter = ("status", "institution_id")
    search_fields = ("applicant_name", "email", "phone")


@admin.register(CertificateRequest)
class CertificateRequestAdmin(admin.ModelAdmin):
    list_display = ("student", "certificate_type", "status", "request_date", "issued_date")
    list_filter = ("certificate_type", "status")


@admin.register(FeeTransaction)
class FeeTransactionAdmin(admin.ModelAdmin):
    list_display = ("transaction_id", "student", "fee_type", "amount", "payment_date", "payment_mode", "status")
    list_filter = ("status", "payment_mode")
    search_fields = ("transaction_id", "student__full_name")
