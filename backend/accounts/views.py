from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

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
    """
    Register a new parent account.

    Parents can register their children for autism screening and therapy.
    After registration, parents receive JWT tokens for authentication.
    """
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_summary="Register a new parent",
        operation_description="""
        Creates a new parent account in the AutiSahara platform.

        **Use Case**: First step for parents wanting to register their child for autism screening.

        **Flow**:
        1. Parent provides email, password, full name, and phone
        2. Account is created with role='parent'
        3. JWT tokens are returned for immediate login

        **Next Steps**: After registration, parent should:
        - Add child information via /api/children/
        - Complete parent profile via /api/parent/profile/
        - Submit M-CHAT screening via /api/children/{id}/mchat/
        """,
        request_body=ParentRegisterSerializer,
        responses={
            201: openapi.Response(
                description="Parent registered successfully",
                examples={
                    "application/json": {
                        "user": {
                            "id": 1,
                            "email": "parent@example.com",
                            "full_name": "Ram Sharma",
                            "phone": "9841234567",
                            "role": "parent"
                        },
                        "tokens": {
                            "refresh": "eyJ...",
                            "access": "eyJ..."
                        }
                    }
                }
            ),
            400: "Validation error (email already exists, weak password, etc.)"
        },
        tags=["Authentication"]
    )
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
    """
    Register a new doctor/therapist account.

    Doctors can review patient assessments, assign curricula, and track progress.
    For hackathon: doctors are auto-approved upon registration.
    """
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_summary="Register a new doctor/therapist",
        operation_description="""
        Creates a new doctor account in the AutiSahara platform.

        **Use Case**: Therapists and doctors who want to review autism screenings and provide treatment.

        **Flow**:
        1. Doctor provides credentials + license number
        2. Account is created with role='doctor'
        3. Doctor profile is auto-approved (hackathon mode)
        4. JWT tokens are returned for immediate login

        **Doctor Capabilities**:
        - View pending patient assessments
        - Review M-CHAT scores and videos
        - Assign therapy curricula
        - Track daily progress
        - Generate diagnosis reports
        """,
        request_body=DoctorRegisterSerializer,
        responses={
            201: openapi.Response(
                description="Doctor registered successfully",
                examples={
                    "application/json": {
                        "user": {
                            "id": 2,
                            "email": "doctor@example.com",
                            "full_name": "Dr. Sita Thapa",
                            "phone": "9851234567",
                            "role": "doctor"
                        },
                        "tokens": {
                            "refresh": "eyJ...",
                            "access": "eyJ..."
                        }
                    }
                }
            ),
            400: "Validation error"
        },
        tags=["Authentication"]
    )
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
    """
    Authenticate user and receive JWT tokens.

    Works for both parents and doctors.
    """
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_summary="Login with email and password",
        operation_description="""
        Authenticates a user (parent or doctor) and returns JWT tokens.

        **Use Case**: Login to the platform after registration.

        **Token Usage**:
        - `access`: Short-lived token (60 min) for API requests
        - `refresh`: Long-lived token (1 day) to get new access tokens

        **Include in requests**:
        ```
        Authorization: Bearer <access_token>
        ```
        """,
        request_body=LoginSerializer,
        responses={
            200: openapi.Response(
                description="Login successful",
                examples={
                    "application/json": {
                        "user": {
                            "id": 1,
                            "email": "parent@example.com",
                            "full_name": "Ram Sharma",
                            "role": "parent"
                        },
                        "tokens": {
                            "refresh": "eyJ...",
                            "access": "eyJ..."
                        }
                    }
                }
            ),
            401: "Invalid credentials"
        },
        tags=["Authentication"]
    )
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
    """
    Get the currently authenticated user's profile.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Get current user profile",
        operation_description="""
        Returns the profile of the currently authenticated user.

        **Use Case**:
        - Verify authentication is working
        - Get user details for display in app header/profile
        - Check user role (parent/doctor) to show appropriate UI
        """,
        responses={
            200: UserSerializer,
            401: "Not authenticated"
        },
        tags=["User Profile"]
    )
    def get(self, request):
        return Response(UserSerializer(request.user).data)


class ParentDetailsView(APIView):
    """
    Manage parent/guardian detailed information.

    Includes Sections 2, 3, and 7 from the registration form:
    - Parent/Guardian Information (mother, father details)
    - Contact Information (address, phone)
    - Technology Access & Consent
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Get parent profile details",
        operation_description="""
        Retrieves the parent's detailed profile information.

        **Includes**:
        - Mother's details (name, age, occupation)
        - Father's details (name, age, occupation)
        - Primary caregiver selection
        - Contact information (address, municipality, district, province)
        - Phone numbers and WhatsApp availability
        - Technology comfort level
        - Research consent status
        """,
        responses={
            200: ParentDetailsSerializer,
            404: "Parent details not yet created"
        },
        tags=["Parent Profile"]
    )
    def get(self, request):
        try:
            details = request.user.parent_details
            return Response(ParentDetailsSerializer(details).data)
        except ParentDetails.DoesNotExist:
            return Response({'detail': 'Parent details not found'}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(
        operation_summary="Create or update parent profile",
        operation_description="""
        Creates or updates the parent's detailed profile.

        **Form Sections Covered**:
        - Section 2: Parent/Guardian Information
        - Section 3: Contact Information
        - Section 7: Technology Access & Consent

        **Nepal-Specific Fields**:
        - Province: 1, 2, Bagmati, Gandaki, Lumbini, Karnali, Sudurpaschim
        - Municipality and District for local address
        - WhatsApp availability for communication
        """,
        request_body=ParentDetailsSerializer,
        responses={
            201: ParentDetailsSerializer,
            400: "Validation error"
        },
        tags=["Parent Profile"]
    )
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

    @swagger_auto_schema(
        operation_summary="Update parent profile",
        operation_description="""
        Updates existing parent profile details. Supports partial updates.
        """,
        request_body=ParentDetailsSerializer,
        responses={
            200: ParentDetailsSerializer,
            404: "Parent details not found"
        },
        tags=["Parent Profile"]
    )
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
    """
    Manage household and family information.

    Section 4 of the registration form - who lives with the child.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Get household information",
        operation_description="""
        Retrieves information about who lives in the child's household.

        **Purpose**: Understanding the child's home environment helps doctors
        recommend appropriate therapy activities that family members can assist with.

        **Includes**:
        - Mother/Father presence
        - Number of siblings
        - Grandparents (maternal/paternal)
        - Extended family (uncle/aunt)
        - Helper/maid availability
        """,
        responses={
            200: HouseholdSerializer,
            404: "Household info not yet created"
        },
        tags=["Parent Profile"]
    )
    def get(self, request):
        try:
            household = request.user.household
            return Response(HouseholdSerializer(household).data)
        except Household.DoesNotExist:
            return Response({'detail': 'Household info not found'}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(
        operation_summary="Create or update household information",
        operation_description="""
        Creates or updates the household/family composition.

        **Form Section 4**: Who lives in your home? (Check all that apply)

        **Fields**:
        - `has_mother`: Mother lives at home
        - `has_father`: Father lives at home
        - `siblings_count`: Number of siblings
        - `has_maternal_grandparents`: Mother's parents live at home
        - `has_paternal_grandparents`: Father's parents live at home
        - `has_uncle_aunt`: Uncle or aunt lives at home
        - `has_other_relatives`: Other relatives live at home
        - `has_helper`: Household help/maid
        """,
        request_body=HouseholdSerializer,
        responses={
            201: HouseholdSerializer,
            400: "Validation error"
        },
        tags=["Parent Profile"]
    )
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
