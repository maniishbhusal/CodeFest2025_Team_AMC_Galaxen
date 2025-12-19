from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('parent', 'Parent'),
        ('doctor', 'Doctor'),
        ('admin', 'Admin'),
    ]

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='parent')

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return f"{self.full_name} ({self.email})"


class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    license_number = models.CharField(max_length=100)
    certificate_url = models.URLField(blank=True, null=True)
    specialization = models.CharField(max_length=255, blank=True)
    is_approved = models.BooleanField(default=True)  # Auto-approve for hackathon

    def __str__(self):
        return f"Dr. {self.user.full_name}"


class ParentDetails(models.Model):
    CAREGIVER_CHOICES = [
        ('mother', 'Mother'),
        ('father', 'Father'),
        ('grandparent', 'Grandparent'),
        ('other', 'Other'),
    ]

    PROVINCE_CHOICES = [
        ('1', 'Province 1'),
        ('2', 'Province 2'),
        ('bagmati', 'Bagmati'),
        ('gandaki', 'Gandaki'),
        ('lumbini', 'Lumbini'),
        ('karnali', 'Karnali'),
        ('sudurpaschim', 'Sudurpaschim'),
    ]

    COMFORT_CHOICES = [
        ('very_comfortable', 'Very Comfortable'),
        ('somewhat_comfortable', 'Somewhat Comfortable'),
        ('need_help', 'Need Help'),
        ('not_comfortable', 'Not Comfortable'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='parent_details')

    # Section 2: Parent/Guardian Information
    mother_name = models.CharField(max_length=255, blank=True)
    mother_age = models.PositiveIntegerField(null=True, blank=True)
    mother_occupation = models.CharField(max_length=255, blank=True)
    father_name = models.CharField(max_length=255, blank=True)
    father_age = models.PositiveIntegerField(null=True, blank=True)
    father_occupation = models.CharField(max_length=255, blank=True)
    primary_caregiver = models.CharField(max_length=20, choices=CAREGIVER_CHOICES, default='mother')
    primary_caregiver_other = models.CharField(max_length=255, blank=True)

    # Section 3: Contact Information
    home_address = models.TextField(blank=True)
    municipality = models.CharField(max_length=255, blank=True)
    district = models.CharField(max_length=255, blank=True)
    province = models.CharField(max_length=20, choices=PROVINCE_CHOICES, blank=True)
    primary_phone = models.CharField(max_length=20, blank=True)
    has_whatsapp = models.BooleanField(default=False)
    secondary_phone = models.CharField(max_length=20, blank=True)

    # Section 7: Technology Access
    smartphone_comfort = models.CharField(max_length=30, choices=COMFORT_CHOICES, blank=True)
    consent_followup = models.BooleanField(default=False)
    consent_research = models.BooleanField(default=False)

    def __str__(self):
        return f"Parent details for {self.user.full_name}"


class Household(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='household')

    # Section 4: Household & Family
    has_mother = models.BooleanField(default=True)
    has_father = models.BooleanField(default=True)
    siblings_count = models.PositiveIntegerField(default=0)
    has_maternal_grandparents = models.BooleanField(default=False)
    has_paternal_grandparents = models.BooleanField(default=False)
    has_uncle_aunt = models.BooleanField(default=False)
    has_other_relatives = models.BooleanField(default=False)
    has_helper = models.BooleanField(default=False)

    def __str__(self):
        return f"Household for {self.user.full_name}"
