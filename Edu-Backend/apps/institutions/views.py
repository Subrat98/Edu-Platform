from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Institution, PlatformSettings
from .serializers import InstitutionSerializer, PlatformSettingsSerializer


class InstitutionViewSet(viewsets.ModelViewSet):
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer

    @action(detail=False, methods=["get"], url_path="by-type/(?P<type_name>[^/.]+)")
    def get_by_type(self, request, type_name=None):
        inst = Institution.objects.filter(type=type_name).first()
        if not inst:
            return Response({"error": "Institution not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(InstitutionSerializer(inst).data)


class PlatformSettingsViewSet(viewsets.ModelViewSet):
    queryset = PlatformSettings.objects.all()
    serializer_class = PlatformSettingsSerializer

    def list(self, request, *args, **kwargs):
        settings, _ = PlatformSettings.objects.get_or_create(id=1)
        return Response(PlatformSettingsSerializer(settings).data)
