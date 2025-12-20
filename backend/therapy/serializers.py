from rest_framework import serializers
from datetime import timedelta
from .models import Curriculum, CurriculumTask, ChildCurriculum, DailyProgress, DoctorReview, DiagnosisReport


class CurriculumTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurriculumTask
        fields = ['id', 'day_number', 'title', 'why_description', 'instructions', 'demo_video_url', 'order_index']


class CurriculumSerializer(serializers.ModelSerializer):
    tasks_count = serializers.SerializerMethodField()

    class Meta:
        model = Curriculum
        fields = ['id', 'title', 'description', 'duration_days', 'type', 'spectrum_type', 'tasks_count', 'created_at']

    def get_tasks_count(self, obj):
        return obj.tasks.count()


class CurriculumDetailSerializer(serializers.ModelSerializer):
    """Curriculum with all tasks included"""
    tasks = CurriculumTaskSerializer(many=True, read_only=True)
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Curriculum
        fields = ['id', 'title', 'description', 'duration_days', 'type', 'spectrum_type', 'tasks', 'created_by_name', 'created_at']

    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.user.full_name
        return None


class ChildCurriculumSerializer(serializers.ModelSerializer):
    curriculum_title = serializers.CharField(source='curriculum.title', read_only=True)
    curriculum_duration = serializers.IntegerField(source='curriculum.duration_days', read_only=True)
    child_name = serializers.CharField(source='child.full_name', read_only=True)
    assigned_by_name = serializers.SerializerMethodField()
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = ChildCurriculum
        fields = [
            'id', 'child', 'child_name', 'curriculum', 'curriculum_title', 'curriculum_duration',
            'assigned_by_name', 'start_date', 'end_date', 'current_day', 'status',
            'progress_percentage', 'created_at'
        ]
        read_only_fields = ['id', 'end_date', 'current_day', 'created_at']

    def get_assigned_by_name(self, obj):
        if obj.assigned_by:
            return obj.assigned_by.user.full_name
        return None

    def get_progress_percentage(self, obj):
        if obj.curriculum.duration_days > 0:
            return round((obj.current_day - 1) / obj.curriculum.duration_days * 100, 1)
        return 0


class AssignCurriculumSerializer(serializers.Serializer):
    """Serializer for assigning curriculum to a child"""
    curriculum_id = serializers.IntegerField()
    start_date = serializers.DateField()

    def validate_curriculum_id(self, value):
        try:
            Curriculum.objects.get(pk=value)
        except Curriculum.DoesNotExist:
            raise serializers.ValidationError("Curriculum not found")
        return value

    def create(self, validated_data):
        child = validated_data['child']
        curriculum = Curriculum.objects.get(pk=validated_data['curriculum_id'])
        doctor = validated_data['doctor']
        start_date = validated_data['start_date']
        end_date = start_date + timedelta(days=curriculum.duration_days)

        child_curriculum = ChildCurriculum.objects.create(
            child=child,
            curriculum=curriculum,
            assigned_by=doctor,
            start_date=start_date,
            end_date=end_date
        )
        return child_curriculum


class DailyProgressSerializer(serializers.ModelSerializer):
    task = CurriculumTaskSerializer(read_only=True)

    class Meta:
        model = DailyProgress
        fields = ['id', 'task', 'day_number', 'date', 'status', 'video_url', 'parent_notes', 'submitted_at']
        read_only_fields = ['id', 'submitted_at']


class ProgressSubmitSerializer(serializers.Serializer):
    """Serializer for submitting daily progress"""
    task_id = serializers.IntegerField()
    status = serializers.ChoiceField(choices=['not_done', 'done_with_help', 'done_without_help'])
    video_url = serializers.CharField(required=False, allow_blank=True)  # Accept local file paths
    notes = serializers.CharField(required=False, allow_blank=True)


class TodayTaskSerializer(serializers.Serializer):
    """Serializer for today's tasks"""
    task = CurriculumTaskSerializer()
    progress = DailyProgressSerializer(allow_null=True)
    is_completed = serializers.BooleanField()


class DoctorReviewSerializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = DoctorReview
        fields = ['id', 'review_period', 'observations', 'spectrum_identified', 'recommendations', 'doctor_name', 'reviewed_at']
        read_only_fields = ['id', 'reviewed_at']

    def get_doctor_name(self, obj):
        if obj.doctor:
            return obj.doctor.user.full_name
        return None


class CreateReviewSerializer(serializers.Serializer):
    """Serializer for doctor to create a review"""
    review_period = serializers.IntegerField()
    observations = serializers.CharField()
    spectrum_identified = serializers.CharField(required=False, allow_blank=True)
    recommendations = serializers.CharField()


class DiagnosisReportSerializer(serializers.ModelSerializer):
    """Serializer for viewing diagnosis reports"""
    doctor_name = serializers.SerializerMethodField()
    child_name = serializers.CharField(source='child.full_name', read_only=True)
    spectrum_type_display = serializers.CharField(source='get_spectrum_type_display', read_only=True)

    class Meta:
        model = DiagnosisReport
        fields = [
            'id', 'child', 'child_name', 'doctor_name', 'has_autism',
            'spectrum_type', 'spectrum_type_display', 'detailed_report',
            'next_steps', 'shared_with_parent', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_doctor_name(self, obj):
        if obj.doctor:
            return obj.doctor.user.full_name
        return None


class CreateDiagnosisReportSerializer(serializers.Serializer):
    """Serializer for doctor to create a diagnosis report"""
    has_autism = serializers.BooleanField()
    spectrum_type = serializers.ChoiceField(
        choices=['none', 'mild', 'moderate', 'severe'],
        default='none'
    )
    detailed_report = serializers.CharField()
    next_steps = serializers.CharField()
    shared_with_parent = serializers.BooleanField(default=False)
