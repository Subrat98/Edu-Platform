from pathlib import Path
from uuid import uuid4
from django.core.files.storage import default_storage
from rest_framework import filters, permissions, viewsets
from rest_framework.exceptions import NotFound
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from tenants.permissions import TenantStaffOnly, TenantStaffOrPublicRead
from tenants.models import TenantMembership
from .models import (
    Notice, Department, Banner, Page, GalleryImage, ContactMessage, MenuSection,
    Hostel, HostelRoomType, HostelMessMenu, HostelNotice, HostelFeeHead, HostelFee,
)
from .serializers import (
    NoticeSerializer, DepartmentSerializer, BannerSerializer, PageSerializer, GallerySerializer, ContactMessageSerializer, MenuSectionSerializer,
    HostelSerializer, HostelRoomTypeSerializer, HostelMessMenuSerializer, HostelNoticeSerializer, HostelFeeHeadSerializer, HostelFeeSerializer,
)


def is_tenant_staff(request):
    tenant = getattr(request, 'tenant', None)
    user = getattr(request, 'user', None)
    if not tenant or not user or not user.is_authenticated:
        return False
    if user.is_superuser:
        return True
    return TenantMembership.objects.using('default').filter(tenant=tenant, user=user, is_active=True).exists()

class TenantContentViewSet(viewsets.ModelViewSet):
    permission_classes = [TenantStaffOrPublicRead]

    def get_object(self):
        """Allow lookup by either primary key integer or slug string seamlessly."""
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        val = self.kwargs.get(lookup_url_kwarg)
        if val is not None:
            if str(val).isdigit():
                obj = queryset.filter(pk=int(val)).first()
                if obj is not None:
                    self.check_object_permissions(self.request, obj)
                    return obj
            if hasattr(self.serializer_class.Meta.model, 'slug'):
                obj = queryset.filter(slug=val).first()
                if obj is not None:
                    self.check_object_permissions(self.request, obj)
                    return obj
        return super().get_object()

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
    pagination_class = None

    def create(self, request, *args, **kwargs):
        if not (request.user and request.user.is_authenticated and request.user.is_superuser):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only Super Admin can create new content pages.')
        return super().create(request, *args, **kwargs)

    def get_queryset(self):
        qs = Page.objects.all().order_by('id')
        if not is_tenant_staff(self.request):
            qs = qs.filter(is_published=True)
        user = getattr(self.request, 'user', None)
        tenant = getattr(self.request, 'tenant', None)
        if tenant and not (user and user.is_authenticated and user.is_superuser):
            allowed_sections = (getattr(tenant, 'permissions', None) or {}).get('sections')
            if isinstance(allowed_sections, list):
                qs = qs.filter(section__in=allowed_sections)
        return qs

class GalleryViewSet(TenantContentViewSet):
    queryset = GalleryImage.objects.all()
    serializer_class = GallerySerializer
    def get_queryset(self):
        qs = GalleryImage.objects.all()
        return qs if is_tenant_staff(self.request) else qs.filter(is_published=True)

class MenuSectionViewSet(TenantContentViewSet):
    queryset = MenuSection.objects.all()
    serializer_class = MenuSectionSerializer
    lookup_field = 'slug'
    pagination_class = None
    def get_queryset(self):
        qs = MenuSection.objects.all().order_by('sort_order', 'id')
        if not is_tenant_staff(self.request):
            qs = qs.filter(is_active=True)
        user = getattr(self.request, 'user', None)
        tenant = getattr(self.request, 'tenant', None)
        if tenant and not (user and user.is_authenticated and user.is_superuser):
            allowed_sections = (getattr(tenant, 'permissions', None) or {}).get('sections')
            if isinstance(allowed_sections, list):
                qs = qs.filter(slug__in=allowed_sections)
        return qs

class HostelViewSet(TenantContentViewSet):
    queryset = Hostel.objects.all()
    serializer_class = HostelSerializer
    lookup_field = 'slug'
    def get_queryset(self):
        qs = Hostel.objects.all()
        if not is_tenant_staff(self.request):
            qs = qs.filter(is_published=True)
        if self.request.query_params.get('hostel_type'):
            qs = qs.filter(hostel_type=self.request.query_params['hostel_type'])
        return qs

class HostelRoomTypeViewSet(TenantContentViewSet):
    queryset = HostelRoomType.objects.all()
    serializer_class = HostelRoomTypeSerializer
    def get_queryset(self):
        qs = HostelRoomType.objects.all()
        if not is_tenant_staff(self.request):
            qs = qs.filter(is_published=True)
        if self.request.query_params.get('hostel'):
            qs = qs.filter(hostel__slug=self.request.query_params['hostel'])
        if self.request.query_params.get('category'):
            qs = qs.filter(category=self.request.query_params['category'])
        return qs

class HostelMessMenuViewSet(TenantContentViewSet):
    queryset = HostelMessMenu.objects.all()
    serializer_class = HostelMessMenuSerializer
    def get_queryset(self):
        qs = HostelMessMenu.objects.all()
        if self.request.query_params.get('hostel'):
            qs = qs.filter(hostel__slug=self.request.query_params['hostel'])
        return qs

class HostelNoticeViewSet(TenantContentViewSet):
    queryset = HostelNotice.objects.all()
    serializer_class = HostelNoticeSerializer
    def get_queryset(self):
        qs = HostelNotice.objects.all()
        if not is_tenant_staff(self.request):
            qs = qs.filter(is_published=True)
        if self.request.query_params.get('hostel'):
            qs = qs.filter(hostel__slug=self.request.query_params['hostel'])
        if self.request.query_params.get('notice_type'):
            qs = qs.filter(notice_type=self.request.query_params['notice_type'])
        if self.request.query_params.get('year'):
            qs = qs.filter(academic_year=self.request.query_params['year'])
        return qs

class HostelFeeHeadViewSet(TenantContentViewSet):
    queryset = HostelFeeHead.objects.all()
    serializer_class = HostelFeeHeadSerializer
    lookup_field = 'slug'
    def get_queryset(self):
        qs = HostelFeeHead.objects.all()
        return qs if is_tenant_staff(self.request) else qs.filter(is_active=True)

class HostelFeeViewSet(TenantContentViewSet):
    queryset = HostelFee.objects.all()
    serializer_class = HostelFeeSerializer
    def get_queryset(self):
        qs = HostelFee.objects.all()
        if not is_tenant_staff(self.request):
            qs = qs.filter(is_active=True)
        if self.request.query_params.get('hostel'):
            qs = qs.filter(hostel__slug=self.request.query_params['hostel'])
        if self.request.query_params.get('room_type'):
            qs = qs.filter(room_type_id=self.request.query_params['room_type'])
        if self.request.query_params.get('year'):
            qs = qs.filter(academic_year=self.request.query_params['year'])
        if self.request.query_params.get('category'):
            qs = qs.filter(category=self.request.query_params['category'])
        return qs

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
            'menu_sections': MenuSection.objects.count(),
            'gallery_images': GalleryImage.objects.count(),
            'unread_messages': ContactMessage.objects.filter(is_read=False).count(),
            'hostels': Hostel.objects.count(),
            'hostel_notices': HostelNotice.objects.count(),
            'tenant': {'name': request.tenant.name, 'slug': request.tenant.slug},
        })


class TenantConfigView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        tenant = getattr(request, 'tenant', None)
        if not tenant:
            return Response({'detail': 'Tenant not found.'}, status=404)
        return Response({
            'name': tenant.name,
            'slug': tenant.slug,
            'permissions': tenant.permissions or {},
        })


class PageImageUploadView(APIView):
    permission_classes = [TenantStaffOnly]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file_obj = request.FILES.get('image') or request.FILES.get('file')
        if not file_obj:
            return Response({'detail': 'No image file provided.'}, status=400)
        alias = getattr(request, 'tenant_db', None) or 'unassigned'
        safe_name = Path(file_obj.name).name
        rel_path = f'tenants/{alias}/pages/{uuid4().hex[:8]}_{safe_name}'
        saved_path = default_storage.save(rel_path, file_obj)
        url = request.build_absolute_uri(default_storage.url(saved_path))
        return Response({'url': url})
