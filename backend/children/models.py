from django.db import models
from django.conf import settings


class Child(models.Model):
    """
    Section 1: Child's Basic Information
    """
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]

    parent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='children'
    )

    # Section 1 fields
    full_name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    age_years = models.PositiveIntegerField()
    age_months = models.PositiveIntegerField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)

    # Tracking
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Children'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} ({self.age_years}y {self.age_months}m)"


class ChildEducation(models.Model):
    """
    Section 5: Education & Daily Routine
    """
    SCHOOL_TYPE_CHOICES = [
        ('government', 'Government'),
        ('private', 'Private'),
        ('special', 'Special School'),
    ]

    TRANSPORT_CHOICES = [
        ('walk', 'Walk'),
        ('bus', 'Bus'),
        ('private_vehicle', 'Private Vehicle'),
        ('other', 'Other'),
    ]

    child = models.OneToOneField(
        Child,
        on_delete=models.CASCADE,
        related_name='education'
    )

    # School Information
    goes_to_school = models.BooleanField(default=False)
    school_name = models.CharField(max_length=255, blank=True)
    grade_class = models.CharField(max_length=50, blank=True)
    school_type = models.CharField(max_length=20, choices=SCHOOL_TYPE_CHOICES, blank=True)
    transport_mode = models.CharField(max_length=20, choices=TRANSPORT_CHOICES, blank=True)

    # Daily Routine (stored as time strings for simplicity)
    wake_up_time = models.TimeField(null=True, blank=True)
    breakfast_time = models.TimeField(null=True, blank=True)
    school_start_time = models.TimeField(null=True, blank=True)
    school_end_time = models.TimeField(null=True, blank=True)
    lunch_time = models.TimeField(null=True, blank=True)
    nap_start_time = models.TimeField(null=True, blank=True)
    nap_end_time = models.TimeField(null=True, blank=True)
    evening_activities = models.TextField(blank=True)
    dinner_time = models.TimeField(null=True, blank=True)
    sleep_time = models.TimeField(null=True, blank=True)

    def __str__(self):
        return f"Education info for {self.child.full_name}"


class ChildHealth(models.Model):
    """
    Section 6: Health Information
    """
    VACCINATION_CHOICES = [
        ('complete', 'Complete'),
        ('incomplete', 'Incomplete'),
        ('unknown', 'Unknown'),
    ]

    child = models.OneToOneField(
        Child,
        on_delete=models.CASCADE,
        related_name='health'
    )

    # Basic Health Info
    height_cm = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    weight_kg = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)

    # Vaccination & Medical
    has_vaccinations = models.CharField(max_length=10, choices=VACCINATION_CHOICES, default='unknown')
    medical_conditions = models.TextField(blank=True, help_text="Current medical conditions")
    takes_medication = models.BooleanField(default=False)
    medication_list = models.TextField(blank=True)

    # Professionals Seen (checkboxes)
    seen_pediatrician = models.BooleanField(default=False)
    seen_psychiatrist = models.BooleanField(default=False)
    seen_speech_therapist = models.BooleanField(default=False)
    seen_occupational_therapist = models.BooleanField(default=False)
    seen_psychologist = models.BooleanField(default=False)
    seen_special_educator = models.BooleanField(default=False)
    seen_neurologist = models.BooleanField(default=False)
    seen_traditional_healer = models.BooleanField(default=False)
    seen_none = models.BooleanField(default=False)

    def __str__(self):
        return f"Health info for {self.child.full_name}"


class MedicalHistory(models.Model):
    """
    Medical History Background (A1-A4)
    Appears after basic info, before M-CHAT.
    If ANY answer is YES → Auto-flag for specialist attention.
    """
    child = models.OneToOneField(
        Child,
        on_delete=models.CASCADE,
        related_name='medical_history'
    )

    # A1: Pregnancy infection
    pregnancy_infection = models.BooleanField(default=False)
    pregnancy_infection_desc = models.TextField(blank=True)

    # A2: Birth complications
    birth_complications = models.BooleanField(default=False)
    birth_complications_desc = models.TextField(blank=True)

    # A3: Brain injury in first year
    brain_injury_first_year = models.BooleanField(default=False)
    brain_injury_desc = models.TextField(blank=True)

    # A4: Family autism history
    family_autism_history = models.BooleanField(default=False)

    # Auto-flag
    requires_specialist = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Auto-set requires_specialist if any flag is True
        self.requires_specialist = any([
            self.pregnancy_infection,
            self.birth_complications,
            self.brain_injury_first_year,
            self.family_autism_history
        ])
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Medical history for {self.child.full_name}"
