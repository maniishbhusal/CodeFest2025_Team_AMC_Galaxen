from rest_framework import serializers
from .models import Child, ChildEducation, ChildHealth, MedicalHistory


class ChildEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChildEducation
        exclude = ['child']


class ChildHealthSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChildHealth
        exclude = ['child']


class MedicalHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalHistory
        exclude = ['child']
        read_only_fields = ['requires_specialist']


class ChildSerializer(serializers.ModelSerializer):
    """Basic child serializer for list/create operations"""
    class Meta:
        model = Child
        fields = ['id', 'full_name', 'date_of_birth', 'age_years', 'age_months', 'gender', 'created_at']
        read_only_fields = ['id', 'created_at']


class ChildDetailSerializer(serializers.ModelSerializer):
    """Detailed child serializer with nested education, health, medical history"""
    education = ChildEducationSerializer(read_only=True)
    health = ChildHealthSerializer(read_only=True)
    medical_history = MedicalHistorySerializer(read_only=True)

    class Meta:
        model = Child
        fields = [
            'id', 'full_name', 'date_of_birth', 'age_years', 'age_months', 'gender',
            'education', 'health', 'medical_history',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ChildCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a child with all sections at once (optional)"""
    education = ChildEducationSerializer(required=False)
    health = ChildHealthSerializer(required=False)
    medical_history = MedicalHistorySerializer(required=False)

    class Meta:
        model = Child
        fields = [
            'id', 'full_name', 'date_of_birth', 'age_years', 'age_months', 'gender',
            'education', 'health', 'medical_history'
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        education_data = validated_data.pop('education', None)
        health_data = validated_data.pop('health', None)
        medical_history_data = validated_data.pop('medical_history', None)

        child = Child.objects.create(**validated_data)

        if education_data:
            ChildEducation.objects.create(child=child, **education_data)
        if health_data:
            ChildHealth.objects.create(child=child, **health_data)
        if medical_history_data:
            MedicalHistory.objects.create(child=child, **medical_history_data)

        return child
