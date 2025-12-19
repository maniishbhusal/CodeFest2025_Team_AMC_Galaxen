from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import Child, ChildEducation, ChildHealth, MedicalHistory
from .serializers import (
    ChildSerializer,
    ChildDetailSerializer,
    ChildCreateSerializer,
    ChildEducationSerializer,
    ChildHealthSerializer,
    MedicalHistorySerializer,
    ChildFullRegistrationSerializer,
)


class ChildListCreateView(APIView):
    """
    List all children for the authenticated parent or create a new child.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="List all children",
        operation_description="""
        Returns all children registered under the authenticated parent.

        **Use Case**: Display list of children on parent's dashboard/home screen.

        **Response**: Array of child objects with basic info (name, age, gender).
        """,
        responses={
            200: ChildSerializer(many=True),
            401: "Not authenticated"
        },
        tags=["Children"]
    )
    def get(self, request):
        children = Child.objects.filter(parent=request.user)
        serializer = ChildSerializer(children, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="Register a new child",
        operation_description="""
        Creates a new child profile under the authenticated parent.

        **Use Case**: First step after parent registration - add child's basic info.

        **Form Section**: Section 1 - Child's Basic Information
        - Full name (required)
        - Date of birth (required, format: YYYY-MM-DD)
        - Age in years and months (required)
        - Gender: male, female, or other (required)

        **Next Steps**: After creating child, add:
        - Education info via POST /api/children/{id}/education/
        - Health info via POST /api/children/{id}/health/
        - Medical history via POST /api/children/{id}/medical-history/
        - M-CHAT screening via POST /api/children/{id}/mchat/
        """,
        request_body=ChildSerializer,
        responses={
            201: openapi.Response(
                description="Child created successfully",
                examples={
                    "application/json": {
                        "id": 1,
                        "full_name": "Aarav Sharma",
                        "date_of_birth": "2022-03-15",
                        "age_years": 2,
                        "age_months": 8,
                        "gender": "male",
                        "created_at": "2024-01-15T10:30:00Z"
                    }
                }
            ),
            400: "Validation error"
        },
        tags=["Children"]
    )
    def post(self, request):
        serializer = ChildSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(parent=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChildDetailView(APIView):
    """
    Retrieve, update, or delete a specific child.
    """
    permission_classes = [IsAuthenticated]

    def get_child(self, pk, user):
        return get_object_or_404(Child, pk=pk, parent=user)

    @swagger_auto_schema(
        operation_summary="Get child details",
        operation_description="""
        Returns detailed information about a specific child, including:
        - Basic info (Section 1)
        - Education & routine (Section 5) if filled
        - Health info (Section 6) if filled
        - Medical history (A1-A4) if filled

        **Use Case**: View complete child profile, review before assessment submission.
        """,
        responses={
            200: ChildDetailSerializer,
            404: "Child not found"
        },
        tags=["Children"]
    )
    def get(self, request, pk):
        child = self.get_child(pk, request.user)
        serializer = ChildDetailSerializer(child)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="Update child basic info",
        operation_description="""
        Updates the child's basic information (Section 1 fields).

        **Supports partial updates** - only send fields you want to change.
        """,
        request_body=ChildSerializer,
        responses={
            200: ChildSerializer,
            400: "Validation error",
            404: "Child not found"
        },
        tags=["Children"]
    )
    def put(self, request, pk):
        child = self.get_child(pk, request.user)
        serializer = ChildSerializer(child, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_summary="Delete a child",
        operation_description="""
        Permanently deletes a child and all associated data.

        **Warning**: This action cannot be undone. All education, health,
        medical history, assessments, and progress data will be deleted.
        """,
        responses={
            204: "Child deleted successfully",
            404: "Child not found"
        },
        tags=["Children"]
    )
    def delete(self, request, pk):
        child = self.get_child(pk, request.user)
        child.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ChildEducationView(APIView):
    """
    Manage child's education and daily routine information (Section 5).
    """
    permission_classes = [IsAuthenticated]

    def get_child(self, pk, user):
        return get_object_or_404(Child, pk=pk, parent=user)

    @swagger_auto_schema(
        operation_summary="Get child's education info",
        operation_description="""
        Returns education and daily routine information for a child.

        **Form Section**: Section 5 - Education & Daily Routine
        """,
        responses={
            200: ChildEducationSerializer,
            404: "Child or education info not found"
        },
        tags=["Child Education"]
    )
    def get(self, request, pk):
        child = self.get_child(pk, request.user)
        try:
            education = child.education
            return Response(ChildEducationSerializer(education).data)
        except ChildEducation.DoesNotExist:
            return Response({'detail': 'Education info not found'}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(
        operation_summary="Create/Update child's education info",
        operation_description="""
        Creates or updates education and daily routine information.

        **Form Section**: Section 5 - Education & Daily Routine

        **School Fields** (if goes_to_school is true):
        - school_name: Name of the school
        - grade_class: Grade or class
        - school_type: government, private, or special
        - transport_mode: walk, bus, private_vehicle, or other

        **Daily Routine** (time format: HH:MM):
        - wake_up_time, breakfast_time
        - school_start_time, school_end_time
        - lunch_time, nap_start_time, nap_end_time
        - evening_activities (text description)
        - dinner_time, sleep_time
        """,
        request_body=ChildEducationSerializer,
        responses={
            201: ChildEducationSerializer,
            400: "Validation error"
        },
        tags=["Child Education"]
    )
    def post(self, request, pk):
        child = self.get_child(pk, request.user)

        try:
            education = child.education
            serializer = ChildEducationSerializer(education, data=request.data, partial=True)
        except ChildEducation.DoesNotExist:
            serializer = ChildEducationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(child=child)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChildHealthView(APIView):
    """
    Manage child's health information (Section 6).
    """
    permission_classes = [IsAuthenticated]

    def get_child(self, pk, user):
        return get_object_or_404(Child, pk=pk, parent=user)

    @swagger_auto_schema(
        operation_summary="Get child's health info",
        operation_description="""
        Returns health information for a child.

        **Form Section**: Section 6 - Health Information
        """,
        responses={
            200: ChildHealthSerializer,
            404: "Child or health info not found"
        },
        tags=["Child Health"]
    )
    def get(self, request, pk):
        child = self.get_child(pk, request.user)
        try:
            health = child.health
            return Response(ChildHealthSerializer(health).data)
        except ChildHealth.DoesNotExist:
            return Response({'detail': 'Health info not found'}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(
        operation_summary="Create/Update child's health info",
        operation_description="""
        Creates or updates health information for a child.

        **Form Section**: Section 6 - Health Information

        **Fields**:
        - height_cm: Child's height in centimeters
        - weight_kg: Child's weight in kilograms
        - has_vaccinations: yes, no, or not_sure
        - medical_conditions: Text description of conditions
        - takes_medication: Boolean
        - medication_list: List of medications if applicable

        **Professionals Seen** (all boolean):
        - seen_pediatrician, seen_psychiatrist
        - seen_speech_therapist, seen_occupational_therapist
        - seen_psychologist, seen_special_educator
        - seen_neurologist, seen_traditional_healer
        - seen_none
        """,
        request_body=ChildHealthSerializer,
        responses={
            201: ChildHealthSerializer,
            400: "Validation error"
        },
        tags=["Child Health"]
    )
    def post(self, request, pk):
        child = self.get_child(pk, request.user)

        try:
            health = child.health
            serializer = ChildHealthSerializer(health, data=request.data, partial=True)
        except ChildHealth.DoesNotExist:
            serializer = ChildHealthSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(child=child)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MedicalHistoryView(APIView):
    """
    Manage child's medical history background (A1-A4).
    """
    permission_classes = [IsAuthenticated]

    def get_child(self, pk, user):
        return get_object_or_404(Child, pk=pk, parent=user)

    @swagger_auto_schema(
        operation_summary="Get child's medical history",
        operation_description="""
        Returns medical history background (A1-A4) for a child.

        **Purpose**: This section helps identify children who may need
        specialist attention before M-CHAT screening.

        **Auto-Flag**: If ANY question is answered YES, the child is
        automatically flagged for specialist review (requires_specialist=true).
        """,
        responses={
            200: MedicalHistorySerializer,
            404: "Child or medical history not found"
        },
        tags=["Child Medical History"]
    )
    def get(self, request, pk):
        child = self.get_child(pk, request.user)
        try:
            history = child.medical_history
            return Response(MedicalHistorySerializer(history).data)
        except MedicalHistory.DoesNotExist:
            return Response({'detail': 'Medical history not found'}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(
        operation_summary="Create/Update medical history",
        operation_description="""
        Creates or updates medical history background (A1-A4).

        **Questions**:
        - **A1 - pregnancy_infection**: Serious infection during pregnancy?
          - pregnancy_infection_desc: Description if yes
        - **A2 - birth_complications**: Emergency birth or special care needed?
          - birth_complications_desc: Description if yes
        - **A3 - brain_injury_first_year**: Brain infection or head injury in first year?
          - brain_injury_desc: Description if yes
        - **A4 - family_autism_history**: Sibling/cousin with autism diagnosis?

        **Auto-Flag**: If any answer is YES, `requires_specialist` is automatically set to true.
        """,
        request_body=MedicalHistorySerializer,
        responses={
            201: MedicalHistorySerializer,
            400: "Validation error"
        },
        tags=["Child Medical History"]
    )
    def post(self, request, pk):
        child = self.get_child(pk, request.user)

        try:
            history = child.medical_history
            serializer = MedicalHistorySerializer(history, data=request.data, partial=True)
        except MedicalHistory.DoesNotExist:
            serializer = MedicalHistorySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(child=child)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChildFullRegistrationView(APIView):
    """
    Register a child with ALL sections in ONE API call.
    Frontend collects all form data and submits at once.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Complete child registration (all sections)",
        operation_description="""
        Creates a child profile with ALL related information in ONE API call.

        **Use Case**: Frontend collects all form data across multiple screens,
        then submits everything together at the end.

        **Sections included**:
        - **Section 1** (required): Child basic info (name, DOB, age, gender)
        - **Section 5** (optional): Education & daily routine
        - **Section 6** (optional): Health information
        - **A1-A4** (optional): Medical history background

        **Example Request**:
        ```json
        {
            "full_name": "Aarav Sharma",
            "date_of_birth": "2022-03-15",
            "age_years": 2,
            "age_months": 8,
            "gender": "male",
            "education": {
                "goes_to_school": true,
                "school_name": "ABC School",
                "grade_class": "Nursery"
            },
            "health": {
                "height_cm": 85,
                "weight_kg": 12,
                "has_vaccinations": "yes"
            },
            "medical_history": {
                "pregnancy_infection": false,
                "birth_complications": false,
                "brain_injury_first_year": false,
                "family_autism_history": false
            }
        }
        ```

        **After this**: Proceed to M-CHAT screening via POST /api/children/{id}/mchat/
        """,
        request_body=ChildFullRegistrationSerializer,
        responses={
            201: openapi.Response(
                description="Child registered successfully with all sections",
                examples={
                    "application/json": {
                        "id": 1,
                        "full_name": "Aarav Sharma",
                        "date_of_birth": "2022-03-15",
                        "age_years": 2,
                        "age_months": 8,
                        "gender": "male",
                        "education": {"goes_to_school": True, "school_name": "ABC School"},
                        "health": {"height_cm": 85, "weight_kg": 12},
                        "medical_history": {"requires_specialist": False},
                        "created_at": "2024-01-15T10:30:00Z"
                    }
                }
            ),
            400: "Validation error"
        },
        tags=["Children"]
    )
    def post(self, request):
        serializer = ChildFullRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            child = serializer.save(parent=request.user)
            # Return full details using ChildDetailSerializer
            return Response(
                ChildDetailSerializer(child).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
