from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Doctor, ParentDetails, Household


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'full_name', 'role', 'is_active', 'created_at']
    list_filter = ['role', 'is_active', 'is_staff']
    search_fields = ['email', 'full_name']
    ordering = ['-created_at']

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'phone', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'phone', 'role', 'password1', 'password2'),
        }),
    )


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['user', 'license_number', 'specialization', 'is_approved']
    list_filter = ['is_approved']
    search_fields = ['user__full_name', 'license_number']


@admin.register(ParentDetails)
class ParentDetailsAdmin(admin.ModelAdmin):
    list_display = ['user', 'primary_caregiver', 'district', 'province']
    list_filter = ['province', 'primary_caregiver']
    search_fields = ['user__full_name']


@admin.register(Household)
class HouseholdAdmin(admin.ModelAdmin):
    list_display = ['user', 'siblings_count', 'has_mother', 'has_father']
