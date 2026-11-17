from django.db import models


class Department(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    institution_id = models.CharField(max_length=50, default="college")
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    head_of_department = models.CharField(max_length=255, blank=True)
    faculty_count = models.IntegerField(default=12)
    student_count = models.IntegerField(default=350)
    labs_count = models.IntegerField(default=4)
    image_url = models.CharField(max_length=255, blank=True)
    vision = models.TextField(blank=True)
    mission = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.code})"


class Programme(models.Model):
    LEVEL_CHOICES = (
        ("UG", "Undergraduate"),
        ("PG", "Postgraduate"),
        ("Doctoral", "Doctoral / Ph.D."),
        ("Diploma", "Diploma"),
        ("Certificate", "Certificate"),
    )
    id = models.CharField(max_length=100, primary_key=True)
    institution_id = models.CharField(max_length=50, default="college")
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name="programmes")
    title = models.CharField(max_length=255)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default="UG")
    duration_years = models.IntegerField(default=3)
    seats = models.IntegerField(default=60)
    curriculum_type = models.CharField(max_length=50, default="NEP 2020 / LOCF")
    eligibility = models.TextField(blank=True)
    syllabus_url = models.CharField(max_length=255, blank=True)
    fee_per_year = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} ({self.level})"


class ClassSection(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    institution_id = models.CharField(max_length=50, default="school")
    name = models.CharField(max_length=100)
    grade = models.CharField(max_length=50)
    section = models.CharField(max_length=20, default="A")
    academic_year = models.CharField(max_length=30, default="2026-2027")
    room_number = models.CharField(max_length=50, blank=True)
    capacity = models.IntegerField(default=40)
    class_teacher = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.name} ({self.academic_year})"


class CourseSubject(models.Model):
    code = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(max_length=255)
    credits = models.IntegerField(default=4)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    syllabus_description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.code}: {self.title}"
