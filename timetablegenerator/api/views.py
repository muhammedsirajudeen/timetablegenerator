from asyncio import wait
from http import HTTPStatus
from http.client import ResponseNotReady
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.serializers import ModelSerializer
from .models import CustomUser

# User Serializer
class UserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email']


# Register User
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

    if CustomUser.objects.filter(email=email).exists():
        return Response({"error": "User already exists "}, status=status.HTTP_400_BAD_REQUEST)

    user = CustomUser.objects.create_user(email=email, password=password)
    return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)


# Login User (Obtain Token)
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(email=email, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


# Logout User (Blacklist Token)
@api_view(['POST'])
def logout_user(request):
    try:
        refresh_token = request.data.get("refresh")
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

#teach this as a example of protected routes
# Get User Details (Protected Route)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_details(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    email=request.data.get('email')
    password=request.data.get('password')
    user=authenticate(email=email,password=password)
    if user:
        if user.is_superuser:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                    {
                        "message":"Unauthorized"
                    },
                    status=status.HTTP_401_UNAUTHORIZED
                )
    else:
        return Response({"message":"Invalid Credentials"},status=status.HTTP_401_UNAUTHORIZED)

 
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_details(request):
    serializer=UserSerializer(request.user)
    return Response(serializer.data,status=status.HTTP_200_OK)
