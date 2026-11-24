from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from cms.views import NoticeViewSet, DepartmentViewSet, BannerViewSet, PageViewSet, GalleryViewSet, ContactMessageViewSet, DashboardStatsView, MenuSectionViewSet
from tenants.views import TenantLoginView, PlatformTenantViewSet

router = DefaultRouter()
router.register('notices', NoticeViewSet, basename='notices')
router.register('departments', DepartmentViewSet, basename='departments')
router.register('banners', BannerViewSet, basename='banners')
router.register('pages', PageViewSet, basename='pages')
router.register('menu-sections', MenuSectionViewSet, basename='menu-sections')
router.register('gallery', GalleryViewSet, basename='gallery')
router.register('contact-messages', ContactMessageViewSet, basename='contact-messages')
platform_router = DefaultRouter()
platform_router.register('tenants', PlatformTenantViewSet, basename='platform-tenants')

urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('api/auth/token/', TenantLoginView.as_view(), name='tenant-token'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('api/dashboard/', DashboardStatsView.as_view()),
    path('api/platform/', include(platform_router.urls)),
    path('api/', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
