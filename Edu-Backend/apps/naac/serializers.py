from rest_framework import serializers
from .models import NaacCriterion, NaacMetricEvidence


class NaacCriterionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NaacCriterion
        fields = "__all__"


class NaacMetricEvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NaacMetricEvidence
        fields = "__all__"
