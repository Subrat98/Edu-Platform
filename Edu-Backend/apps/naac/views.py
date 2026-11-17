from rest_framework import viewsets, filters
from .models import NaacCriterion, NaacMetricEvidence
from .serializers import NaacCriterionSerializer, NaacMetricEvidenceSerializer


class NaacCriterionViewSet(viewsets.ModelViewSet):
    queryset = NaacCriterion.objects.all().order_by("criterion_number")
    serializer_class = NaacCriterionSerializer


class NaacMetricEvidenceViewSet(viewsets.ModelViewSet):
    queryset = NaacMetricEvidence.objects.all()
    serializer_class = NaacMetricEvidenceSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["metric_id", "title", "description"]

    def get_queryset(self):
        qs = super().get_queryset()
        crit = self.request.query_params.get("criterion")
        if crit:
            qs = qs.filter(criterion_number=crit)
        return qs
