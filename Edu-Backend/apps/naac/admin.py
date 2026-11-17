from django.contrib import admin
from .models import NaacCriterion, NaacMetricEvidence


@admin.register(NaacCriterion)
class NaacCriterionAdmin(admin.ModelAdmin):
    list_display = ("criterion_number", "title", "weightage", "score")


@admin.register(NaacMetricEvidence)
class NaacMetricEvidenceAdmin(admin.ModelAdmin):
    list_display = ("metric_id", "criterion_number", "title", "status", "updated_at")
    list_filter = ("criterion_number", "status")
    search_fields = ("metric_id", "title", "description")
