from django.contrib.auth import authenticate
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Tenant, TenantMembership
from .serializers import TenantSerializer

class TenantLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        tenant = getattr(request, 'tenant', None)
        if tenant is None:
            return Response({'detail': 'Tenant header/domain is required.'}, status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(request, username=request.data.get('username'), password=request.data.get('password'))
        if not user or not user.is_active or not TenantMembership.objects.using('default').filter(tenant=tenant, user=user, is_active=True).exists():
            return Response({'detail': 'Invalid credentials or no access to this tenant.'}, status=status.HTTP_401_UNAUTHORIZED)
        refresh = RefreshToken.for_user(user)
        refresh['tenant'] = tenant.slug
        return Response({'refresh': str(refresh), 'access': str(refresh.access_token), 'tenant': {'name': tenant.name, 'slug': tenant.slug}})

class PlatformTenantViewSet(viewsets.ReadOnlyModelViewSet):
    """Platform superusers can inspect the tenant registry; provisioning uses management commands."""
    queryset = Tenant.objects.using('default').all()
    serializer_class = TenantSerializer
    permission_classes = [permissions.IsAdminUser]
