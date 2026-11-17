from django.db import models


class NaacCriterion(models.Model):
    criterion_number = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255)
    weightage = models.IntegerField(default=100)
    score = models.DecimalField(max_digits=4, decimal_places=2, default=3.42)
    summary = models.TextField(blank=True)
    key_indicators = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"Criterion {self.criterion_number}: {self.title}"


class NaacMetricEvidence(models.Model):
    STATUS_CHOICES = (
        ("Verified", "Verified"),
        ("In Review", "In Review"),
        ("Pending", "Pending"),
        ("Uploaded", "Uploaded"),
    )
    metric_id = models.CharField(max_length=50, primary_key=True)
    criterion_number = models.IntegerField(default=1)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    document_url = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Verified")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Metric {self.metric_id}: {self.title}"
