from django.db import models


class Student(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    institution_id = models.CharField(max_length=50, default="school")
    roll_number = models.CharField(max_length=50)
    full_name = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    class_or_programme = models.CharField(max_length=100)
    section = models.CharField(max_length=20, default="A")
    guardian_name = models.CharField(max_length=255, blank=True)
    guardian_phone = models.CharField(max_length=30, blank=True)
    admission_year = models.IntegerField(default=2024)
    status = models.CharField(max_length=30, default="Active")

    def __str__(self):
        return f"{self.full_name} ({self.roll_number})"


class AttendanceRecord(models.Model):
    STATUS_CHOICES = (
        ("Present", "Present"),
        ("Absent", "Absent"),
        ("Late", "Late"),
        ("Excused", "Excused"),
    )
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="attendance_records")
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Present")
    remarks = models.CharField(max_length=255, blank=True)

    class Meta:
        unique_together = ("student", "date")
        ordering = ["-date"]

    def __str__(self):
        return f"{self.student.full_name} - {self.date}: {self.status}"


class Examination(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    institution_id = models.CharField(max_length=50, default="college")
    title = models.CharField(max_length=255)
    academic_year = models.CharField(max_length=50, default="2025-2026")
    semester_or_term = models.CharField(max_length=50, default="Odd Semester")
    start_date = models.DateField()
    end_date = models.DateField()
    is_published = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} ({self.academic_year})"


class ExamResult(models.Model):
    examination = models.ForeignKey(Examination, on_delete=models.CASCADE, related_name="results")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="exam_results")
    subject_code = models.CharField(max_length=50)
    subject_title = models.CharField(max_length=255)
    marks_obtained = models.DecimalField(max_digits=5, decimal_places=2)
    max_marks = models.DecimalField(max_digits=5, decimal_places=2, default=100.00)
    grade = models.CharField(max_length=10, default="A")
    passed = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.student.full_name} - {self.subject_code}: {self.marks_obtained}/{self.max_marks}"


class AdmissionApplication(models.Model):
    STATUS_CHOICES = (
        ("Pending", "Pending"),
        ("Approved", "Approved"),
        ("Waitlisted", "Waitlisted"),
        ("Rejected", "Rejected"),
    )
    id = models.CharField(max_length=100, primary_key=True)
    institution_id = models.CharField(max_length=50, default="college")
    applicant_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    programme_or_grade = models.CharField(max_length=100)
    merit_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="Pending")
    applied_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.applicant_name} ({self.programme_or_grade}) - {self.status}"


class CertificateRequest(models.Model):
    TYPE_CHOICES = (
        ("Transfer Certificate (TC)", "Transfer Certificate (TC)"),
        ("Bonafide Certificate", "Bonafide Certificate"),
        ("Character Certificate", "Character Certificate"),
        ("Migration Certificate", "Migration Certificate"),
    )
    STATUS_CHOICES = (
        ("Submitted", "Submitted"),
        ("In Review", "In Review"),
        ("Approved", "Approved"),
        ("Issued", "Issued"),
        ("Rejected", "Rejected"),
    )
    id = models.CharField(max_length=100, primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="certificate_requests")
    certificate_type = models.CharField(max_length=100, choices=TYPE_CHOICES)
    reason = models.TextField()
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="Submitted")
    request_date = models.DateField(auto_now_add=True)
    issued_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.student.full_name} - {self.certificate_type}"


class FeeTransaction(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="fee_transactions")
    fee_type = models.CharField(max_length=100, default="Tuition & Examination Fee")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField()
    payment_mode = models.CharField(max_length=50, default="SBI Collect Online")
    transaction_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=30, default="Success")

    def __str__(self):
        return f"{self.student.full_name} - ₹{self.amount} ({self.status})"
