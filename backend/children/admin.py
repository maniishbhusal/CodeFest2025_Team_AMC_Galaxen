from django.contrib import admin
from .models import Child, ChildEducation, ChildHealth, MedicalHistory


class ChildEducationInline(admin.StackedInline):
    model = ChildEducation
    extra = 0


class ChildHealthInline(admin.StackedInline):
    model = ChildHealth
    extra = 0


class MedicalHistoryInline(admin.StackedInline):
    model = MedicalHistory
    extra = 0


@admin.register(Child)
class ChildAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'parent', 'age_years', 'age_months', 'gender', 'created_at']
    list_filter = ['gender', 'created_at']
    search_fields = ['full_name', 'parent__full_name', 'parent__email']
    ordering = ['-created_at']
    inlines = [ChildEducationInline, ChildHealthInline, MedicalHistoryInline]


@admin.register(ChildEducation)
class ChildEducationAdmin(admin.ModelAdmin):
    list_display = ['child', 'goes_to_school', 'school_name', 'school_type']
    list_filter = ['goes_to_school', 'school_type']
    search_fields = ['child__full_name']


@admin.register(ChildHealth)
class ChildHealthAdmin(admin.ModelAdmin):
    list_display = ['child', 'height_cm', 'weight_kg', 'has_vaccinations', 'takes_medication']
    list_filter = ['has_vaccinations', 'takes_medication']
    search_fields = ['child__full_name']


@admin.register(MedicalHistory)
class MedicalHistoryAdmin(admin.ModelAdmin):
    list_display = ['child', 'pregnancy_infection', 'birth_complications', 'brain_injury_first_year', 'family_autism_history', 'requires_specialist']
    list_filter = ['requires_specialist', 'pregnancy_infection', 'birth_complications']
    search_fields = ['child__full_name']
