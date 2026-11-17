from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, AuthLoginView, AuthLogoutView, CurrentUserView, PersonasList

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")

urlpatterns = [
    path("login/", AuthLoginView.as_view(), name="auth-login"),
    path("logout/", AuthLogoutView.as_view(), name="auth-logout"),
    path("me/", CurrentUserView.as_view(), name="auth-me"),
    path("personas/", PersonasList.as_view(), name="auth-personas"),
    path("", include(router.urls)),
]
