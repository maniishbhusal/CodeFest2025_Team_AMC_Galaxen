from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import date

from .models import Curriculum, CurriculumTask, ChildCurriculum, DailyProgress, DoctorReview, DiagnosisReport
from .serializers import (
    CurriculumSerializer, CurriculumDetailSerializer, CurriculumTaskSerializer,
    ChildCurriculumSerializer, AssignCurriculumSerializer,
    DailyProgressSerializer, ProgressSubmitSerializer, TodayTaskSerializer,
    DoctorReviewSerializer, CreateReviewSerializer,
    DiagnosisReportSerializer, CreateDiagnosisReportSerializer
)
from children.models import Child
from assessments.models import ChildAssessment


# ============== CURRICULUM ENDPOINTS ==============

class CurriculumListView(generics.ListAPIView):
    """List all available curricula (for doctors)"""
    serializer_class = CurriculumSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Curriculum.objects.all()
        # Optional filters
        curriculum_type = self.request.query_params.get('type')
        spectrum = self.request.query_params.get('spectrum')
        duration = self.request.query_params.get('duration')

        if curriculum_type:
            queryset = queryset.filter(type=curriculum_type)
        if spectrum:
            queryset = queryset.filter(spectrum_type__icontains=spectrum)
        if duration:
            queryset = queryset.filter(duration_days=duration)

        return queryset


class CurriculumDetailView(generics.RetrieveAPIView):
    """Get curriculum details with all tasks"""
    queryset = Curriculum.objects.all()
    serializer_class = CurriculumDetailSerializer
    permission_classes = [IsAuthenticated]


# ============== DOCTOR DASHBOARD ENDPOINTS ==============

class DoctorPendingPatientsView(APIView):
    """Get list of patients pending review for doctor"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'doctor':
            return Response({'error': 'Only doctors can access this'}, status=status.HTTP_403_FORBIDDEN)

        # Get pending assessments
        pending = ChildAssessment.objects.filter(status='pending').select_related('child', 'child__parent')

        data = []
        for assessment in pending:
            child = assessment.child
            mchat = getattr(child, 'mchat', None)
            data.append({
                'assessment_id': assessment.id,
                'child_id': child.id,
                'child_name': child.full_name,
                'age': f"{child.age_years}y {child.age_months}m",
                'parent_name': child.parent.full_name,
                'mchat_score': mchat.total_score if mchat else None,
                'mchat_risk': mchat.risk_level if mchat else None,
                'submitted_at': assessment.submitted_at,
            })

        return Response(data)


class DoctorAcceptedPatientsView(APIView):
    """Get list of patients accepted by this doctor"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'doctor':
            return Response({'error': 'Only doctors can access this'}, status=status.HTTP_403_FORBIDDEN)

        doctor = request.user.doctor_profile
        accepted = ChildAssessment.objects.filter(
            assigned_doctor=doctor,
            status__in=['accepted', 'completed']
        ).select_related('child', 'child__parent')

        data = []
        for assessment in accepted:
            child = assessment.child
            # Get active curriculum if any
            active_curriculum = ChildCurriculum.objects.filter(
                child=child, status='active'
            ).first()

            data.append({
                'assessment_id': assessment.id,
                'child_id': child.id,
                'child_name': child.full_name,
                'age': f"{child.age_years}y {child.age_months}m",
                'parent_name': child.parent.full_name,
                'status': assessment.status,
                'has_curriculum': active_curriculum is not None,
                'curriculum_day': active_curriculum.current_day if active_curriculum else None,
                'reviewed_at': assessment.reviewed_at,
            })

        return Response(data)


class DoctorPatientDetailView(APIView):
    """Get detailed info about a patient for doctor review"""
    permission_classes = [IsAuthenticated]

    def get(self, request, child_id):
        if request.user.role != 'doctor':
            return Response({'error': 'Only doctors can access this'}, status=status.HTTP_403_FORBIDDEN)

        child = get_object_or_404(Child, pk=child_id)

        # Get all related data
        mchat = getattr(child, 'mchat', None)
        medical_history = getattr(child, 'medical_history', None)
        education = getattr(child, 'education', None)
        health = getattr(child, 'health', None)
        videos = child.videos.all()
        assessment = getattr(child, 'assessment', None)

        data = {
            'id': assessment.id if assessment else None,
            'child': {
                'id': child.id,
                'full_name': child.full_name,
                'date_of_birth': child.date_of_birth,
                'age_years': child.age_years,
                'age_months': child.age_months,
                'gender': child.gender,
            },
            'parent': {
                'id': child.parent.id,
                'full_name': child.parent.full_name,
                'email': child.parent.email,
                'phone': child.parent.phone,
            },
            'mchat_result': {
                'id': mchat.id,
                'total_score': mchat.total_score,
                'risk_level': mchat.risk_level,
                'created_at': mchat.created_at,
            } if mchat else None,
            'medical_history': {
                'pregnancy_infection': medical_history.pregnancy_infection,
                'pregnancy_infection_desc': medical_history.pregnancy_infection_desc,
                'birth_complications': medical_history.birth_complications,
                'birth_complications_desc': medical_history.birth_complications_desc,
                'brain_injury_first_year': medical_history.brain_injury_first_year,
                'brain_injury_desc': medical_history.brain_injury_desc,
                'family_autism_history': medical_history.family_autism_history,
                'requires_specialist': medical_history.requires_specialist,
            } if medical_history else None,
            'education': {
                'is_in_school': education.goes_to_school,
                'school_name': education.school_name,
                'grade_class': education.grade_class,
                'school_type': education.school_type,
            } if education else None,
            'health': {
                'height': str(health.height_cm) if health.height_cm else None,
                'weight': str(health.weight_kg) if health.weight_kg else None,
                'has_vaccinations': health.has_vaccinations,
                'medical_conditions': health.medical_conditions,
                'taking_medication': health.takes_medication,
                'medication_list': health.medication_list,
            } if health else None,
            'videos': [
                {
                    'id': v.id,
                    'video_type': v.video_type,
                    'video_url': v.video_url,
                    'description': v.description,
                    'uploaded_at': v.uploaded_at,
                }
                for v in videos
            ],
            'status': assessment.status if assessment else 'pending',
            'submitted_at': assessment.submitted_at if assessment else None,
        }

        return Response(data)


class DoctorAcceptPatientView(APIView):
    """Doctor accepts a patient for treatment"""
    permission_classes = [IsAuthenticated]

    def post(self, request, child_id):
        if request.user.role != 'doctor':
            return Response({'error': 'Only doctors can access this'}, status=status.HTTP_403_FORBIDDEN)

        child = get_object_or_404(Child, pk=child_id)
        assessment = get_object_or_404(ChildAssessment, child=child)

        if assessment.status != 'pending':
            return Response({'error': 'Patient already accepted'}, status=status.HTTP_400_BAD_REQUEST)

        # Get or create doctor profile
        from accounts.models import Doctor
        doctor, created = Doctor.objects.get_or_create(
            user=request.user,
            defaults={
                'license_number': 'PENDING',
                'specialization': 'General',
                'is_approved': True,
            }
        )

        assessment.assigned_doctor = doctor
        assessment.status = 'accepted'
        assessment.reviewed_at = timezone.now()
        assessment.save()

        return Response({
            'message': 'Patient accepted successfully',
            'child_id': child.id,
            'child_name': child.full_name,
        })


class DoctorAssignCurriculumView(APIView):
    """Doctor assigns a curriculum to a child"""
    permission_classes = [IsAuthenticated]

    def post(self, request, child_id):
        if request.user.role != 'doctor':
            return Response({'error': 'Only doctors can access this'}, status=status.HTTP_403_FORBIDDEN)

        child = get_object_or_404(Child, pk=child_id)
        doctor = request.user.doctor_profile

        # Check if child is assigned to this doctor
        assessment = get_object_or_404(ChildAssessment, child=child, assigned_doctor=doctor)

        # Check if child already has an active curriculum
        if ChildCurriculum.objects.filter(child=child, status='active').exists():
            return Response({'error': 'Child already has an active curriculum'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AssignCurriculumSerializer(data=request.data)
        if serializer.is_valid():
            child_curriculum = serializer.save(child=child, doctor=doctor)
            return Response({
                'message': 'Curriculum assigned successfully',
                'child_curriculum_id': child_curriculum.id,
                'curriculum': child_curriculum.curriculum.title,
                'start_date': child_curriculum.start_date,
                'end_date': child_curriculum.end_date,
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DoctorPatientProgressView(APIView):
    """Get patient's curriculum progress for doctor"""
    permission_classes = [IsAuthenticated]

    def get(self, request, child_id):
        if request.user.role != 'doctor':
            return Response({'error': 'Only doctors can access this'}, status=status.HTTP_403_FORBIDDEN)

        child = get_object_or_404(Child, pk=child_id)

        # Get active or most recent curriculum
        child_curriculum = ChildCurriculum.objects.filter(child=child).first()

        if not child_curriculum:
            return Response({'error': 'No curriculum assigned'}, status=status.HTTP_404_NOT_FOUND)

        # Get all progress entries
        progress_entries = DailyProgress.objects.filter(
            child_curriculum=child_curriculum
        ).select_related('task')

        # Get reviews
        reviews = DoctorReview.objects.filter(child_curriculum=child_curriculum)

        # Calculate stats
        total_tasks = progress_entries.count()
        done_tasks = progress_entries.filter(status__in=['done_with_help', 'done_without_help']).count()
        done_without_help = progress_entries.filter(status='done_without_help').count()

        data = {
            'curriculum': {
                'id': child_curriculum.id,
                'title': child_curriculum.curriculum.title,
                'duration_days': child_curriculum.curriculum.duration_days,
                'current_day': child_curriculum.current_day,
                'status': child_curriculum.status,
                'start_date': child_curriculum.start_date,
                'end_date': child_curriculum.end_date,
            },
            'stats': {
                'total_tasks_submitted': total_tasks,
                'tasks_done': done_tasks,
                'tasks_done_without_help': done_without_help,
                'completion_rate': round(done_tasks / total_tasks * 100, 1) if total_tasks > 0 else 0,
            },
            'progress': DailyProgressSerializer(progress_entries, many=True).data,
            'reviews': DoctorReviewSerializer(reviews, many=True).data,
        }

        return Response(data)


class DoctorCreateReviewView(APIView):
    """Doctor creates a review for child at checkpoint"""
    permission_classes = [IsAuthenticated]

    def post(self, request, child_id):
        if request.user.role != 'doctor':
            return Response({'error': 'Only doctors can access this'}, status=status.HTTP_403_FORBIDDEN)

        child = get_object_or_404(Child, pk=child_id)
        doctor = request.user.doctor_profile

        child_curriculum = ChildCurriculum.objects.filter(
            child=child, status='active'
        ).first()

        if not child_curriculum:
            return Response({'error': 'No active curriculum'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CreateReviewSerializer(data=request.data)
        if serializer.is_valid():
            review = DoctorReview.objects.create(
                child_curriculum=child_curriculum,
                doctor=doctor,
                review_period=serializer.validated_data['review_period'],
                observations=serializer.validated_data['observations'],
                spectrum_identified=serializer.validated_data.get('spectrum_identified', ''),
                recommendations=serializer.validated_data['recommendations'],
            )
            return Response({
                'message': 'Review created successfully',
                'review_id': review.id,
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============== PARENT ENDPOINTS ==============

class TodayTasksView(APIView):
    """Get today's tasks for parent's child"""
    permission_classes = [IsAuthenticated]

    def get(self, request, child_id):
        if request.user.role != 'parent':
            return Response({'error': 'Only parents can access this'}, status=status.HTTP_403_FORBIDDEN)

        child = get_object_or_404(Child, pk=child_id, parent=request.user)

        # Get active curriculum
        child_curriculum = ChildCurriculum.objects.filter(
            child=child, status='active'
        ).first()

        if not child_curriculum:
            return Response({'error': 'No active curriculum'}, status=status.HTTP_404_NOT_FOUND)

        # Get tasks for current day
        current_day = child_curriculum.current_day
        tasks = CurriculumTask.objects.filter(
            curriculum=child_curriculum.curriculum,
            day_number=current_day
        )

        today = date.today()
        result = []

        for task in tasks:
            # Check if progress already submitted
            progress = DailyProgress.objects.filter(
                child_curriculum=child_curriculum,
                task=task,
                date=today
            ).first()

            result.append({
                'task': CurriculumTaskSerializer(task).data,
                'progress': DailyProgressSerializer(progress).data if progress else None,
                'is_completed': progress is not None and progress.status != 'not_done',
            })

        return Response({
            'curriculum_title': child_curriculum.curriculum.title,
            'current_day': current_day,
            'total_days': child_curriculum.curriculum.duration_days,
            'date': today,
            'tasks': result,
        })


class SubmitProgressView(APIView):
    """Parent submits progress for a task"""
    permission_classes = [IsAuthenticated]

    def post(self, request, child_id):
        if request.user.role != 'parent':
            return Response({'error': 'Only parents can access this'}, status=status.HTTP_403_FORBIDDEN)

        child = get_object_or_404(Child, pk=child_id, parent=request.user)

        child_curriculum = ChildCurriculum.objects.filter(
            child=child, status='active'
        ).first()

        if not child_curriculum:
            return Response({'error': 'No active curriculum'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProgressSubmitSerializer(data=request.data)
        if serializer.is_valid():
            task = get_object_or_404(CurriculumTask, pk=serializer.validated_data['task_id'])

            # Create or update progress
            today = date.today()
            progress, created = DailyProgress.objects.update_or_create(
                child_curriculum=child_curriculum,
                task=task,
                date=today,
                defaults={
                    'day_number': child_curriculum.current_day,
                    'status': serializer.validated_data['status'],
                    'video_url': serializer.validated_data.get('video_url', ''),
                    'parent_notes': serializer.validated_data.get('notes', ''),
                }
            )

            return Response({
                'message': 'Progress submitted successfully',
                'progress_id': progress.id,
                'created': created,
            }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdvanceDayView(APIView):
    """Advance curriculum to next day (called automatically or manually)"""
    permission_classes = [IsAuthenticated]

    def post(self, request, child_id):
        if request.user.role != 'parent':
            return Response({'error': 'Only parents can access this'}, status=status.HTTP_403_FORBIDDEN)

        child = get_object_or_404(Child, pk=child_id, parent=request.user)

        child_curriculum = ChildCurriculum.objects.filter(
            child=child, status='active'
        ).first()

        if not child_curriculum:
            return Response({'error': 'No active curriculum'}, status=status.HTTP_404_NOT_FOUND)

        # Check tasks for current day (for info, but don't block)
        current_tasks = CurriculumTask.objects.filter(
            curriculum=child_curriculum.curriculum,
            day_number=child_curriculum.current_day
        )

        # Count completed tasks (any date, not just today - for flexibility)
        completed = DailyProgress.objects.filter(
            child_curriculum=child_curriculum,
            task__in=current_tasks,
            day_number=child_curriculum.current_day,
            status__in=['done_with_help', 'done_without_help']
        ).count()

        # For hackathon: Allow advancing even if not all tasks done
        # The mobile app shows a warning dialog before calling this

        # Advance day
        if child_curriculum.current_day >= child_curriculum.curriculum.duration_days:
            child_curriculum.status = 'completed'
            child_curriculum.save()
            return Response({
                'message': 'Curriculum completed!',
                'status': 'completed',
            })

        child_curriculum.current_day += 1
        child_curriculum.save()

        return Response({
            'message': 'Advanced to next day',
            'current_day': child_curriculum.current_day,
        })


class ProgressHistoryView(APIView):
    """Get progress history for a child"""
    permission_classes = [IsAuthenticated]

    def get(self, request, child_id):
        child = get_object_or_404(Child, pk=child_id)

        # Check access
        if request.user.role == 'parent' and child.parent != request.user:
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

        child_curriculum = ChildCurriculum.objects.filter(child=child).first()

        if not child_curriculum:
            return Response({'error': 'No curriculum found'}, status=status.HTTP_404_NOT_FOUND)

        progress_entries = DailyProgress.objects.filter(
            child_curriculum=child_curriculum
        ).select_related('task').order_by('-date', '-submitted_at')

        # Group by day
        days = {}
        for entry in progress_entries:
            day = entry.day_number
            if day not in days:
                days[day] = {
                    'day_number': day,
                    'date': entry.date,
                    'tasks': []
                }
            days[day]['tasks'].append(DailyProgressSerializer(entry).data)

        return Response({
            'curriculum': ChildCurriculumSerializer(child_curriculum).data,
            'history': list(days.values()),
        })


class ChildCurriculumStatusView(APIView):
    """Get curriculum status for a child"""
    permission_classes = [IsAuthenticated]

    def get(self, request, child_id):
        child = get_object_or_404(Child, pk=child_id)

        # Check access
        if request.user.role == 'parent' and child.parent != request.user:
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

        curricula = ChildCurriculum.objects.filter(child=child)

        return Response({
            'child_id': child.id,
            'child_name': child.full_name,
            'curricula': ChildCurriculumSerializer(curricula, many=True).data,
        })


# ============== DIAGNOSIS REPORT ENDPOINTS ==============

class DoctorCreateDiagnosisView(APIView):
    """Doctor creates a diagnosis report for a child"""
    permission_classes = [IsAuthenticated]

    def post(self, request, child_id):
        if request.user.role != 'doctor':
            return Response({'error': 'Only doctors can access this'}, status=status.HTTP_403_FORBIDDEN)

        child = get_object_or_404(Child, pk=child_id)
        doctor = request.user.doctor_profile

        # Verify doctor has accepted this patient
        assessment = ChildAssessment.objects.filter(
            child=child,
            assigned_doctor=doctor,
            status__in=['accepted', 'completed']
        ).first()

        if not assessment:
            return Response({'error': 'You are not assigned to this patient'}, status=status.HTTP_403_FORBIDDEN)

        serializer = CreateDiagnosisReportSerializer(data=request.data)
        if serializer.is_valid():
            report = DiagnosisReport.objects.create(
                child=child,
                doctor=doctor,
                has_autism=serializer.validated_data['has_autism'],
                spectrum_type=serializer.validated_data['spectrum_type'],
                detailed_report=serializer.validated_data['detailed_report'],
                next_steps=serializer.validated_data['next_steps'],
                shared_with_parent=serializer.validated_data.get('shared_with_parent', False),
            )

            # Mark assessment as completed
            assessment.status = 'completed'
            assessment.save()

            return Response({
                'message': 'Diagnosis report created successfully',
                'report_id': report.id,
                'has_autism': report.has_autism,
                'spectrum_type': report.get_spectrum_type_display(),
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChildDiagnosisReportsView(APIView):
    """Get diagnosis reports for a child (parent or doctor)"""
    permission_classes = [IsAuthenticated]

    def get(self, request, child_id):
        child = get_object_or_404(Child, pk=child_id)

        # Check access
        if request.user.role == 'parent':
            if child.parent != request.user:
                return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            # Parents can only see shared reports
            reports = DiagnosisReport.objects.filter(child=child, shared_with_parent=True)
        elif request.user.role == 'doctor':
            # Doctors can see all reports for their patients
            doctor = request.user.doctor_profile
            # Verify doctor is assigned to this patient
            assessment = ChildAssessment.objects.filter(
                child=child,
                assigned_doctor=doctor
            ).first()
            if assessment:
                reports = DiagnosisReport.objects.filter(child=child)
            else:
                return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

        return Response({
            'child_id': child.id,
            'child_name': child.full_name,
            'reports': DiagnosisReportSerializer(reports, many=True).data,
        })


class ChildDoctorFeedbackView(APIView):
    """Get doctor reviews/feedback for a child (for parent home screen)"""
    permission_classes = [IsAuthenticated]

    def get(self, request, child_id):
        child = get_object_or_404(Child, pk=child_id)

        # Check access - parent can only see their own child's feedback
        if request.user.role == 'parent' and child.parent != request.user:
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

        # Get active or most recent curriculum
        child_curriculum = ChildCurriculum.objects.filter(child=child).order_by('-created_at').first()

        if not child_curriculum:
            return Response({
                'has_feedback': False,
                'reviews': [],
                'message': 'No curriculum assigned yet'
            })

        # Get all reviews for this curriculum
        reviews = DoctorReview.objects.filter(
            child_curriculum=child_curriculum
        ).select_related('doctor', 'doctor__user').order_by('-reviewed_at')

        if not reviews.exists():
            return Response({
                'has_feedback': False,
                'reviews': [],
                'message': 'No doctor feedback yet'
            })

        return Response({
            'has_feedback': True,
            'reviews': DoctorReviewSerializer(reviews, many=True).data,
            'latest_review': DoctorReviewSerializer(reviews.first()).data,
        })


class DoctorToggleReportShareView(APIView):
    """Toggle whether a diagnosis report is shared with parent"""
    permission_classes = [IsAuthenticated]

    def post(self, request, report_id):
        if request.user.role != 'doctor':
            return Response({'error': 'Only doctors can access this'}, status=status.HTTP_403_FORBIDDEN)

        report = get_object_or_404(DiagnosisReport, pk=report_id)

        # Verify doctor owns this report
        if report.doctor != request.user.doctor_profile:
            return Response({'error': 'You can only modify your own reports'}, status=status.HTTP_403_FORBIDDEN)

        report.shared_with_parent = not report.shared_with_parent
        report.save()

        return Response({
            'message': f'Report {"shared with" if report.shared_with_parent else "hidden from"} parent',
            'report_id': report.id,
            'shared_with_parent': report.shared_with_parent,
        })
