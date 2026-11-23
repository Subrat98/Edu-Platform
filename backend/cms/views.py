from rest_framework import filters, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from tenants.permissions import TenantStaffOnly, TenantStaffOrPublicRead
from tenants.models import TenantMembership
from .models import Notice, Department, Banner, Page, GalleryImage, ContactMessage
from .serializers import NoticeSerializer, DepartmentSerializer, BannerSerializer, PageSerializer, GallerySerializer, ContactMessageSerializer


def is_tenant_staff(request):
    tenant = getattr(request, 'tenant', None)
    user = getattr(request, 'user', None)
    return bool(tenant and user and user.is_authenticated and TenantMembership.objects.using('default').filter(tenant=tenant, user=user, is_active=True).exists())

class TenantContentViewSet(viewsets.ModelViewSet):
    permission_classes = [TenantStaffOrPublicRead]

class NoticeViewSet(TenantContentViewSet):
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'category']
    ordering_fields = ['date', 'created_at']

    def get_queryset(self):
        qs = Notice.objects.all()
        if not is_tenant_staff(self.request):
            qs = qs.filter(is_published=True)
        if self.request.query_params.get('category'):
            qs = qs.filter(category=self.request.query_params['category'])
        if self.request.query_params.get('year'):
            qs = qs.filter(date__year=self.request.query_params['year'])
        return qs

class DepartmentViewSet(TenantContentViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    lookup_field = 'slug'
    def get_queryset(self):
        qs = Department.objects.all()
        return qs if is_tenant_staff(self.request) else qs.filter(is_published=True)

class BannerViewSet(TenantContentViewSet):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer
    def get_queryset(self):
        qs = Banner.objects.all()
        return qs if is_tenant_staff(self.request) else qs.filter(is_active=True)

class PageViewSet(TenantContentViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    lookup_field = 'slug'
    def get_queryset(self):
        qs = Page.objects.all()
        return qs if is_tenant_staff(self.request) else qs.filter(is_published=True)

class GalleryViewSet(TenantContentViewSet):
    queryset = GalleryImage.objects.all()
    serializer_class = GallerySerializer
    def get_queryset(self):
        qs = GalleryImage.objects.all()
        return qs if is_tenant_staff(self.request) else qs.filter(is_published=True)

class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.AllowAny()]
        return [TenantStaffOnly()]

    def get_queryset(self):
        return ContactMessage.objects.all()

class DashboardStatsView(APIView):
    permission_classes = [TenantStaffOnly]
    def get(self, request):
        return Response({
            'notices': Notice.objects.count(),
            'departments': Department.objects.count(),
            'banners': Banner.objects.count(),
            'pages': Page.objects.count(),
            'gallery_images': GalleryImage.objects.count(),
            'unread_messages': ContactMessage.objects.filter(is_read=False).count(),
            'tenant': {'name': request.tenant.name, 'slug': request.tenant.slug},
        })
