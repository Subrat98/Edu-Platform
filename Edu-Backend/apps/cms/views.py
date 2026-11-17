from rest_framework import viewsets, filters
from .models import Page, ContactInquiry, MediaAsset
from .serializers import PageSerializer, ContactInquirySerializer, MediaAssetSerializer


class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        inst = self.request.query_params.get("institution")
        if inst:
            qs = qs.filter(institution_id=inst)
        return qs


class ContactInquiryViewSet(viewsets.ModelViewSet):
    queryset = ContactInquiry.objects.all().order_by("-created_at")
    serializer_class = ContactInquirySerializer


class MediaAssetViewSet(viewsets.ModelViewSet):
    queryset = MediaAsset.objects.all()
    serializer_class = MediaAssetSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "category"]

    def get_queryset(self):
        qs = super().get_queryset()
        inst = self.request.query_params.get("institution")
        cat = self.request.query_params.get("category")
        if inst:
            qs = qs.filter(institution_id=inst)
        if cat:
            qs = qs.filter(category=cat)
        return qs
