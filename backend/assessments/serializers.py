from rest_framework import serializers
from .models import MChatResponse, AssessmentVideo, ChildAssessment


class MChatResponseSerializer(serializers.ModelSerializer):
    """Serializer for M-CHAT questionnaire responses"""

    class Meta:
        model = MChatResponse
        fields = [
            'q1', 'q2', 'q3', 'q4', 'q5',
            'q6', 'q7', 'q8', 'q9', 'q10',
            'q11', 'q12', 'q13', 'q14', 'q15',
            'q16', 'q17', 'q18', 'q19', 'q20',
            'total_score', 'risk_level',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['total_score', 'risk_level', 'created_at', 'updated_at']


class MChatResultSerializer(serializers.ModelSerializer):
    """Read-only serializer for M-CHAT results (for doctors)"""
    child_name = serializers.CharField(source='child.full_name', read_only=True)

    class Meta:
        model = MChatResponse
        fields = [
            'child_name',
            'q1', 'q2', 'q3', 'q4', 'q5',
            'q6', 'q7', 'q8', 'q9', 'q10',
            'q11', 'q12', 'q13', 'q14', 'q15',
            'q16', 'q17', 'q18', 'q19', 'q20',
            'total_score', 'risk_level',
            'created_at'
        ]


class AssessmentVideoSerializer(serializers.ModelSerializer):
    """Serializer for assessment videos"""
    video_url = serializers.CharField()  # Accept any string (local path or URL)

    class Meta:
        model = AssessmentVideo
        fields = ['id', 'video_type', 'video_url', 'description', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class ChildAssessmentSerializer(serializers.ModelSerializer):
    """Serializer for child assessment status"""
    doctor_name = serializers.CharField(source='assigned_doctor.user.full_name', read_only=True, allow_null=True)

    class Meta:
        model = ChildAssessment
        fields = ['status', 'parent_confirmed', 'assigned_doctor', 'doctor_name', 'submitted_at', 'reviewed_at']
        read_only_fields = ['status', 'assigned_doctor', 'doctor_name', 'submitted_at', 'reviewed_at']


class AssessmentSubmitSerializer(serializers.Serializer):
    """Serializer for final assessment submission"""
    parent_confirmed = serializers.BooleanField()

    def validate_parent_confirmed(self, value):
        if not value:
            raise serializers.ValidationError("You must confirm the declaration to submit.")
        return value
