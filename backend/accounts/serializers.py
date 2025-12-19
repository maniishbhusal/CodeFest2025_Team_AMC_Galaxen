from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Doctor, ParentDetails, Household

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone', 'role', 'created_at']
        read_only_fields = ['id', 'created_at']


class ParentRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['email', 'password', 'full_name', 'phone']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            phone=validated_data.get('phone', ''),
            role='parent'
        )
        return user


class DoctorRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    license_number = serializers.CharField(write_only=True)
    specialization = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'full_name', 'phone', 'license_number', 'specialization']

    def create(self, validated_data):
        license_number = validated_data.pop('license_number')
        specialization = validated_data.pop('specialization', '')

        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            phone=validated_data.get('phone', ''),
            role='doctor'
        )

        Doctor.objects.create(
            user=user,
            license_number=license_number,
            specialization=specialization,
            is_approved=True  # Auto-approve for hackathon
        )

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Doctor
        fields = ['id', 'user', 'license_number', 'certificate_url', 'specialization', 'is_approved']


class ParentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentDetails
        exclude = ['user']


class HouseholdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Household
        exclude = ['user']
