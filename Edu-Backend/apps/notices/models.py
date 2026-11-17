from django.db import models


class Notice(models.Model):
    CATEGORY_CHOICES = (
        ("Academic", "Academic"),
        ("Examination", "Examination"),
        ("Admission", "Admission"),
        ("General", "General"),
        ("Recruitment", "Recruitment"),
        ("Tender", "Tender"),
        ("Sports", "Sports"),
        ("Event", "Event"),
    )

    AUDIENCE_CHOICES = (
        ("All", "All"),
        ("Students", "Students"),
        ("Faculty", "Faculty"),
        ("Staff", "Staff"),
        ("Public", "Public"),
    )

    id = models.CharField(max_length=100, primary_key=True)
    title = models.CharField(max_length=255)
    institution_id = models.CharField(max_length=50, default="college")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="General")
    date = models.DateField()
    pinned = models.BooleanField(default=False)
    important = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    pdf_url = models.CharField(max_length=255, blank=True)
    audience = models.CharField(max_length=50, choices=AUDIENCE_CHOICES, default="All")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-pinned", "-date", "-created_at"]

    def __str__(self):
        return f"{self.title} ({self.date})"
