from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model

from .models import ParentDetails, Household
from .serializers import (
    UserSerializer,
    ParentRegisterSerializer,
    DoctorRegisterSerializer,
    LoginSerializer,
    ParentDetailsSerializer,
    HouseholdSerializer,
)

User = get_user_model()


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class ParentRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ParentRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': tokens
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DoctorRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = DoctorRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': tokens
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            user = authenticate(request, username=email, password=password)

            if user is not None:
                tokens = get_tokens_for_user(user)
                return Response({
                    'user': UserSerializer(user).data,
                    'tokens': tokens
                })
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class ParentDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            details = request.user.parent_details
            return Response(ParentDetailsSerializer(details).data)
        except ParentDetails.DoesNotExist:
            return Response({'detail': 'Parent details not found'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        try:
            details = request.user.parent_details
            serializer = ParentDetailsSerializer(details, data=request.data, partial=True)
        except ParentDetails.DoesNotExist:
            serializer = ParentDetailsSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        try:
            details = request.user.parent_details
        except ParentDetails.DoesNotExist:
            return Response({'detail': 'Parent details not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ParentDetailsSerializer(details, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HouseholdView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            household = request.user.household
            return Response(HouseholdSerializer(household).data)
        except Household.DoesNotExist:
            return Response({'detail': 'Household info not found'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        try:
            household = request.user.household
            serializer = HouseholdSerializer(household, data=request.data, partial=True)
        except Household.DoesNotExist:
            serializer = HouseholdSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
