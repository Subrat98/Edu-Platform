import re
import psycopg
from psycopg import sql
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.core.management import call_command
from django.db import connections
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from cms.models import Banner, Department, GalleryImage, Hostel, HostelFee, HostelFeeHead, HostelMessMenu, HostelNotice, HostelRoomType, MenuSection, Notice, Page
from .db_context import configure_tenant_database
from .models import Tenant, TenantMembership
from .serializers import TenantSerializer

SLUG_RE = re.compile(r'^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$')

ALL_MODULES = [
    {'key': 'menu-sections', 'label': 'Menu Bar'},
    {'key': 'pages', 'label': 'Content Pages'},
    {'key': 'departments', 'label': 'Departments'},
    {'key': 'notices', 'label': 'Notices'},
    {'key': 'hostels', 'label': 'Hostels & Fees'},
    {'key': 'gallery', 'label': 'Gallery'},
    {'key': 'contact-messages', 'label': 'Contact Messages'},
]


def _clone_cms_data(source_alias, target_alias):
    for model in [MenuSection, Page, Department, Notice, Banner, GalleryImage]:
        for item in model.objects.using(source_alias).all():
            fields = {
                f.name: getattr(item, f.name)
                for f in model._meta.fields
                if f.name not in ['id', 'created_at', 'updated_at']
            }
            lookup = {}
            if 'slug' in fields and fields['slug']:
                lookup = {'slug': fields['slug']}
            elif 'title' in fields:
                lookup = {'title': fields['title']}
            elif 'name' in fields:
                lookup = {'name': fields['name']}
            if lookup:
                model.objects.using(target_alias).get_or_create(**lookup, defaults=fields)
            else:
                model.objects.using(target_alias).create(**fields)


class TenantLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        tenant = getattr(request, 'tenant', None)
        if tenant is None:
            return Response({'detail': 'Tenant header/domain is required.'}, status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(request, username=request.data.get('username'), password=request.data.get('password'))
        if not user or not user.is_active:
            return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
        is_member = user.is_superuser or TenantMembership.objects.using('default').filter(tenant=tenant, user=user, is_active=True).exists()
        if not is_member:
            return Response({'detail': 'No access to this college.'}, status=status.HTTP_401_UNAUTHORIZED)
        refresh = RefreshToken.for_user(user)
        refresh['tenant'] = tenant.slug
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'is_superuser': bool(user.is_superuser),
            'tenant': {'name': tenant.name, 'slug': tenant.slug, 'permissions': tenant.permissions or {}},
        })


class PlatformLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        user = authenticate(request, username=request.data.get('username'), password=request.data.get('password'))
        if not user or not user.is_active or not user.is_superuser:
            return Response({'detail': 'Invalid super admin credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
        refresh = RefreshToken.for_user(user)
        refresh['platform_admin'] = True
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {'username': user.username, 'email': user.email, 'is_superuser': True},
        })


class PlatformMasterCatalogView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        master_slug = request.query_params.get('template', 'our-college')
        master = Tenant.objects.using('default').filter(slug=master_slug, is_active=True).first() or Tenant.objects.using('default').filter(is_active=True).first()
        sections = []
        if master:
            alias = f'tenant_{master.pk}'
            configure_tenant_database(alias, master.database_name)
            sections = list(MenuSection.objects.using(alias).order_by('sort_order', 'id').values('title', 'slug', 'link'))
        return Response({
            'master_slug': master.slug if master else None,
            'modules': ALL_MODULES,
            'sections': sections,
        })


class PlatformTenantViewSet(viewsets.ModelViewSet):
    """Super Admin control plane: create colleges, assign RBAC permissions, and inspect tenants."""
    queryset = Tenant.objects.using('default').all().order_by('id')
    serializer_class = TenantSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class = None

    def create(self, request, *args, **kwargs):
        name = str(request.data.get('name', '')).strip()
        slug = str(request.data.get('slug', '')).strip().lower()
        domain = str(request.data.get('domain', '')).strip() or None
        admin_username = str(request.data.get('admin_username', '')).strip()
        admin_password = str(request.data.get('admin_password', ''))
        admin_email = str(request.data.get('admin_email', '')).strip()
        template_slug = str(request.data.get('template_slug', 'our-college')).strip().lower()
        perms = request.data.get('permissions') or {}

        if not name or not slug:
            return Response({'detail': 'College name and slug are required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not SLUG_RE.fullmatch(slug):
            return Response({'detail': 'Slug must contain lowercase letters, numbers, and hyphens only.'}, status=status.HTTP_400_BAD_REQUEST)
        if not admin_username or not admin_password:
            return Response({'detail': 'College admin username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        if Tenant.objects.using('default').filter(slug=slug).exists():
            return Response({'detail': f'College slug "{slug}" already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        db_name = f'college_{slug.replace("-", "_")}'[:63]
        if Tenant.objects.using('default').filter(database_name=db_name).exists():
            return Response({'detail': f'Database "{db_name}" already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with psycopg.connect(
                host=settings.TENANT_DB_HOST,
                port=settings.TENANT_DB_PORT,
                user=settings.TENANT_DB_USER,
                password=settings.TENANT_DB_PASSWORD,
                dbname='postgres',
                autocommit=True,
            ) as conn:
                with conn.cursor() as cur:
                    cur.execute('SELECT 1 FROM pg_database WHERE datname = %s', (db_name,))
                    if cur.fetchone():
                        return Response({'detail': f'PostgreSQL database "{db_name}" already exists.'}, status=status.HTTP_400_BAD_REQUEST)
                    cur.execute('CREATE DATABASE ' + sql.Identifier(db_name).as_string(conn))
        except psycopg.Error as exc:
            return Response({'detail': f'Database provisioning failed: {exc}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        tenant = Tenant.objects.using('default').create(
            name=name,
            slug=slug,
            database_name=db_name,
            domain=domain,
            permissions=perms,
        )
        alias = f'tenant_{tenant.pk}'
        configure_tenant_database(alias, db_name)
        call_command('migrate', database=alias, interactive=False, verbosity=0)

        User = get_user_model()
        user, created = User.objects.using('default').get_or_create(
            username=admin_username,
            defaults={'email': admin_email, 'is_staff': True},
        )
        user.is_staff = True
        if admin_email:
            user.email = admin_email
        user.set_password(admin_password)
        user.save(using='default')
        TenantMembership.objects.using('default').get_or_create(
            tenant=tenant,
            user=user,
            defaults={'role': 'admin', 'is_active': True},
        )

        master = Tenant.objects.using('default').filter(slug=template_slug, is_active=True).first()
        if master and master.pk != tenant.pk:
            master_alias = f'tenant_{master.pk}'
            configure_tenant_database(master_alias, master.database_name)
            _clone_cms_data(master_alias, alias)

        return Response(TenantSerializer(tenant).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='set-admin')
    def set_admin(self, request, pk=None):
        tenant = self.get_object()
        username = str(request.data.get('username', '')).strip()
        password = str(request.data.get('password', ''))
        email = str(request.data.get('email', '')).strip()
        if not username or not password:
            return Response({'detail': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        User = get_user_model()
        user, _ = User.objects.using('default').get_or_create(username=username, defaults={'email': email, 'is_staff': True})
        user.is_staff = True
        if email:
            user.email = email
        user.set_password(password)
        user.save(using='default')
        TenantMembership.objects.using('default').update_or_create(
            tenant=tenant,
            user=user,
            defaults={'role': 'admin', 'is_active': True},
        )
        return Response(TenantSerializer(tenant).data)

    @action(detail=True, methods=['post'], url_path='sync-master')
    def sync_master(self, request, pk=None):
        tenant = self.get_object()
        template_slug = str(request.data.get('template_slug', 'our-college')).strip().lower()
        master = Tenant.objects.using('default').filter(slug=template_slug, is_active=True).first()
        if not master:
            return Response({'detail': 'Master template tenant not found.'}, status=status.HTTP_404_NOT_FOUND)
        if master.pk == tenant.pk:
            return Response({'detail': 'Cannot sync a college with itself.'}, status=status.HTTP_400_BAD_REQUEST)
        master_alias = f'tenant_{master.pk}'
        target_alias = f'tenant_{tenant.pk}'
        configure_tenant_database(master_alias, master.database_name)
        configure_tenant_database(target_alias, tenant.database_name)
        _clone_cms_data(master_alias, target_alias)
        return Response({'detail': f'Synced new items from {master.name} to {tenant.name}.'})

    def destroy(self, request, *args, **kwargs):
        tenant = self.get_object()
        if tenant.slug == 'our-college':
            return Response({'detail': 'Cannot delete the master base college (our-college).'}, status=status.HTTP_400_BAD_REQUEST)
        alias = f'tenant_{tenant.pk}'
        if alias in connections:
            connections[alias].close()
        db_name = tenant.database_name
        try:
            with psycopg.connect(
                host=settings.TENANT_DB_HOST,
                port=settings.TENANT_DB_PORT,
                user=settings.TENANT_DB_USER,
                password=settings.TENANT_DB_PASSWORD,
                dbname='postgres',
                autocommit=True,
            ) as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        'SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = %s AND pid <> pg_backend_pid()',
                        (db_name,),
                    )
                    cur.execute('DROP DATABASE IF EXISTS ' + sql.Identifier(db_name).as_string(conn))
        except psycopg.Error:
            pass
        tenant.delete(using='default')
        return Response(status=status.HTTP_204_NO_CONTENT)
