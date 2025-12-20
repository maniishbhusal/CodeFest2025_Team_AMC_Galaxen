from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import date, timedelta
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from children.models import Child
from .models import MChatResponse, AssessmentVideo, ChildAssessment
from .serializers import (
    MChatResponseSerializer,
    MChatResultSerializer,
    AssessmentVideoSerializer,
    ChildAssessmentSerializer,
    AssessmentSubmitSerializer,
)


class MChatView(APIView):
    """
    M-CHAT-R/F Screening Questionnaire
    20 questions for autism screening in toddlers (16-30 months)
    """
    permission_classes = [IsAuthenticated]

    def get_child(self, pk, user):
        return get_object_or_404(Child, pk=pk, parent=user)

    @swagger_auto_schema(
        operation_summary="Get M-CHAT results",
        operation_description="""
        Returns the M-CHAT screening results for a child.

        **Response includes**:
        - All 20 question responses (true = YES, false = NO)
        - `total_score`: Calculated score (0-20)
        - `risk_level`: low (0-2), medium (3-7), or high (8-20)

        **Use Case**: View completed screening results, show to doctors.
        """,
        responses={
            200: MChatResultSerializer,
            404: "M-CHAT not yet submitted"
        },
        tags=["M-CHAT Screening"]
    )
    def get(self, request, pk):
        child = self.get_child(pk, request.user)
        try:
            mchat = child.mchat
            return Response(MChatResultSerializer(mchat).data)
        except MChatResponse.DoesNotExist:
            return Response({'detail': 'M-CHAT not submitted yet'}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(
        operation_summary="Submit M-CHAT screening",
        operation_description="""
        Submits the M-CHAT-R/F screening questionnaire (20 questions).

        **Important**: All 20 questions are required.

        **Question Format**:
        - `true` = YES (child does this behavior)
        - `false` = NO (child does not do this behavior)

        **Scoring**:
        - Most questions: NO = 1 point (concerning)
        - Reverse questions (q2, q5, q12): YES = 1 point (concerning)

        **Risk Levels**:
        - 0-2 points: **Low Risk** - No immediate concern
        - 3-7 points: **Medium Risk** - Recommend follow-up
        - 8-20 points: **High Risk** - Priority for doctor review

        **Example**: A healthy child would answer YES to most questions
        (except q2, q5, q12 which should be NO), resulting in a low score.
        """,
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10',
                      'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18', 'q19', 'q20'],
            properties={
                'q1': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Points & looks at what you point to"),
                'q2': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Wondered if deaf (REVERSE)"),
                'q3': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Pretend play"),
                'q4': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Likes climbing"),
                'q5': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Unusual finger movements (REVERSE)"),
                'q6': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Points to ask"),
                'q7': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Points to show"),
                'q8': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Interested in children"),
                'q9': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Shows things"),
                'q10': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Responds to name"),
                'q11': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Smiles back"),
                'q12': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Upset by noises (REVERSE)"),
                'q13': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Walks"),
                'q14': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Eye contact"),
                'q15': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Copies actions"),
                'q16': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Follows gaze"),
                'q17': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Seeks attention"),
                'q18': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Understands commands"),
                'q19': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Checks reactions"),
                'q20': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Likes movement"),
            }
        ),
        responses={
            201: openapi.Response(
                description="M-CHAT submitted successfully",
                examples={
                    "application/json": {
                        "q1": True, "q2": False, "q3": True, "q4": True, "q5": False,
                        "q6": True, "q7": True, "q8": True, "q9": True, "q10": True,
                        "q11": True, "q12": False, "q13": True, "q14": True, "q15": True,
                        "q16": True, "q17": True, "q18": True, "q19": True, "q20": True,
                        "total_score": 0,
                        "risk_level": "low"
                    }
                }
            ),
            400: "Validation error - all 20 questions required"
        },
        tags=["M-CHAT Screening"]
    )
    def post(self, request, pk):
        child = self.get_child(pk, request.user)

        # Check if M-CHAT already exists
        try:
            mchat = child.mchat
            serializer = MChatResponseSerializer(mchat, data=request.data)
        except MChatResponse.DoesNotExist:
            serializer = MChatResponseSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(child=child)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AssessmentVideoListView(APIView):
    """
    List and upload assessment videos for a child
    """
    permission_classes = [IsAuthenticated]

    def get_child(self, pk, user):
        return get_object_or_404(Child, pk=pk, parent=user)

    @swagger_auto_schema(
        operation_summary="List child's assessment videos",
        operation_description="""
        Returns all uploaded assessment videos for a child.

        **Video Types**: walking, eating, speaking, behavior, playing, other
        """,
        responses={
            200: AssessmentVideoSerializer(many=True)
        },
        tags=["Assessment Videos"]
    )
    def get(self, request, pk):
        child = self.get_child(pk, request.user)
        videos = child.videos.all()
        serializer = AssessmentVideoSerializer(videos, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="Upload assessment video",
        operation_description="""
        Uploads a video for doctor review.

        **Video Types**:
        - `walking`: Child walking/movement
        - `eating`: Child eating
        - `speaking`: Child speaking/vocalizing
        - `behavior`: General behavior observation
        - `playing`: Child playing
        - `other`: Other relevant video

        **Note**: Video should be uploaded to Cloudflare Stream first,
        then the URL is submitted here.
        """,
        request_body=AssessmentVideoSerializer,
        responses={
            201: AssessmentVideoSerializer,
            400: "Validation error"
        },
        tags=["Assessment Videos"]
    )
    def post(self, request, pk):
        child = self.get_child(pk, request.user)
        serializer = AssessmentVideoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(child=child)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AssessmentVideoDetailView(APIView):
    """
    Delete a specific assessment video
    """
    permission_classes = [IsAuthenticated]

    def get_child(self, pk, user):
        return get_object_or_404(Child, pk=pk, parent=user)

    @swagger_auto_schema(
        operation_summary="Delete assessment video",
        operation_description="Permanently deletes an uploaded video.",
        responses={
            204: "Video deleted",
            404: "Video not found"
        },
        tags=["Assessment Videos"]
    )
    def delete(self, request, pk, video_id):
        child = self.get_child(pk, request.user)
        video = get_object_or_404(AssessmentVideo, pk=video_id, child=child)
        video.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AssessmentSubmitView(APIView):
    """
    Final assessment submission with parent confirmation
    """
    permission_classes = [IsAuthenticated]

    def get_child(self, pk, user):
        return get_object_or_404(Child, pk=pk, parent=user)

    @swagger_auto_schema(
        operation_summary="Submit final assessment",
        operation_description="""
        Submits the child's assessment for doctor review.

        **Prerequisites**:
        - Child profile completed (Section 1)
        - Parent profile completed (Sections 2, 3, 7)
        - M-CHAT screening completed
        - At least one video uploaded (recommended)

        **Parent Declaration**: Must confirm all information is accurate.

        After submission, a doctor will review and accept the case.
        """,
        request_body=AssessmentSubmitSerializer,
        responses={
            201: ChildAssessmentSerializer,
            400: "Must confirm declaration"
        },
        tags=["Assessment Submission"]
    )
    def post(self, request, pk):
        child = self.get_child(pk, request.user)
        serializer = AssessmentSubmitSerializer(data=request.data)

        if serializer.is_valid():
            # Create or update assessment
            assessment, created = ChildAssessment.objects.update_or_create(
                child=child,
                defaults={
                    'parent_confirmed': True,
                    'status': 'pending',
                    'submitted_at': timezone.now()
                }
            )

            # Auto-assign pre-assessment curriculum
            from therapy.models import Curriculum, ChildCurriculum
            pre_curriculum = Curriculum.objects.filter(type='assessment').first()

            if pre_curriculum:
                # Check if child doesn't already have an active curriculum
                if not ChildCurriculum.objects.filter(child=child, status='active').exists():
                    ChildCurriculum.objects.create(
                        child=child,
                        curriculum=pre_curriculum,
                        assigned_by=None,  # System-assigned, no doctor
                        start_date=date.today(),
                        end_date=date.today() + timedelta(days=pre_curriculum.duration_days),
                        current_day=1,
                        status='active'
                    )

            return Response(
                ChildAssessmentSerializer(assessment).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AssessmentStatusView(APIView):
    """
    Check assessment status
    """
    permission_classes = [IsAuthenticated]

    def get_child(self, pk, user):
        return get_object_or_404(Child, pk=pk, parent=user)

    @swagger_auto_schema(
        operation_summary="Get assessment status",
        operation_description="""
        Returns the current status of the child's assessment.

        **Status Values**:
        - `pending`: Waiting for doctor review
        - `in_review`: Doctor is reviewing
        - `accepted`: Doctor has accepted the case
        - `completed`: Assessment completed
        """,
        responses={
            200: ChildAssessmentSerializer,
            404: "Assessment not submitted yet"
        },
        tags=["Assessment Submission"]
    )
    def get(self, request, pk):
        child = self.get_child(pk, request.user)
        try:
            assessment = child.assessment
            return Response(ChildAssessmentSerializer(assessment).data)
        except ChildAssessment.DoesNotExist:
            return Response({'detail': 'Assessment not submitted yet'}, status=status.HTTP_404_NOT_FOUND)
