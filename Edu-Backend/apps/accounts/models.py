from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ("platform_admin", "Platform Super Admin"),
        ("school_principal", "School Principal"),
        ("college_principal", "College Principal"),
        ("hod", "Head of Department"),
        ("teacher", "Teacher / Faculty"),
        ("student", "Student"),
        ("parent", "Parent / Guardian"),
        ("librarian", "Chief Librarian"),
        ("exam_controller", "Controller of Examinations"),
    )

    id = models.CharField(max_length=100, primary_key=True)
    role = models.CharField(max_length=40, choices=ROLE_CHOICES, default="student")
    institution_id = models.CharField(max_length=50, default="school")
    avatar = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    department = models.CharField(max_length=100, blank=True)
    designation = models.CharField(max_length=100, blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.role} - {self.institution_id})"
