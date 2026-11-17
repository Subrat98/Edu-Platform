"""
Edu-Backend URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def api_root(request):
    return Response({
        "status": "online",
        "service": "EduPlatform Django REST API",
        "version": "1.0.0",
        "documentation": "/api/",
        "endpoints": {
            "auth": "/api/auth/",
            "personas": "/api/auth/personas/",
            "institutions": "/api/institutions/",
            "platform_settings": "/api/platform-settings/",
            "departments": "/api/departments/",
            "programmes": "/api/programmes/",
            "classes": "/api/classes/",
            "notices": "/api/notices/",
            "students": "/api/students/",
            "attendance": "/api/attendance/",
            "examinations": "/api/examinations/",
            "exam_results": "/api/exam-results/",
            "admissions": "/api/admissions/",
            "certificate_requests": "/api/certificate-requests/",
            "fee_transactions": "/api/fee-transactions/",
            "books": "/api/books/",
            "library_loans": "/api/loans/",
            "naac_criteria": "/api/criteria/",
            "naac_evidence": "/api/evidence/",
            "pages": "/api/pages/",
            "contact_inquiries": "/api/contact-inquiries/",
            "media": "/api/media/",
        }
    })


@api_view(["GET"])
def health_check(request):
    return Response({"status": "healthy", "database": "connected"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api_root, name="api-root"),
    path("api/health/", health_check, name="health-check"),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/", include("apps.institutions.urls")),
    path("api/", include("apps.academics.urls")),
    path("api/", include("apps.notices.urls")),
    path("api/", include("apps.erp.urls")),
    path("api/", include("apps.library.urls")),
    path("api/", include("apps.naac.urls")),
    path("api/", include("apps.cms.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
