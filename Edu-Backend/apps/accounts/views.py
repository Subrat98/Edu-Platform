from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import models
from django.contrib.auth import login, logout
from .models import User
from .serializers import UserSerializer, LoginSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        inst = self.request.query_params.get("institution")
        role = self.request.query_params.get("role")
        if inst:
            qs = qs.filter(institution_id=inst)
        if role:
            qs = qs.filter(role=role)
        return qs


class AuthLoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_id = serializer.validated_data.get("user_id")
        username = serializer.validated_data.get("username")
        password = serializer.validated_data.get("password")

        user = None
        if user_id:
            user = User.objects.filter(id=user_id).first()
        elif username:
            user = User.objects.filter(username=username).first()
            if user and password and not user.check_password(password):
                return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        login(request, user)
        return Response({
            "message": "Login successful",
            "user": UserSerializer(user).data
        })


class AuthLogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful"})


class CurrentUserView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response(UserSerializer(request.user).data)
        # Fallback to demo default if unauthenticated for preview
        return Response({"authenticated": False, "user": None})


class PersonasList(APIView):
    def get(self, request):
        inst = request.query_params.get("institution")
        qs = User.objects.all()
        if inst:
            qs = qs.filter(models.Q(institution_id=inst) | models.Q(role="platform_admin"))
        return Response(UserSerializer(qs, many=True).data)
