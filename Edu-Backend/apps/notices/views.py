from rest_framework import viewsets, filters
from .models import Notice
from .serializers import NoticeSerializer


class NoticeViewSet(viewsets.ModelViewSet):
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description", "category"]
    ordering_fields = ["date", "pinned", "created_at"]

    def get_queryset(self):
        qs = super().get_queryset()
        inst = self.request.query_params.get("institution")
        cat = self.request.query_params.get("category")
        pinned = self.request.query_params.get("pinned")

        if inst:
            qs = qs.filter(models_q_filter(inst))
        if cat:
            qs = qs.filter(category=cat)
        if pinned is not None:
            qs = qs.filter(pinned=pinned.lower() in ("true", "1"))
        return qs


def models_q_filter(inst):
    from django.db.models import Q
    return Q(institution_id=inst) | Q(institution_id="all")
