from django.contrib import admin
from .models import MChatResponse, AssessmentVideo, ChildAssessment


@admin.register(MChatResponse)
class MChatResponseAdmin(admin.ModelAdmin):
    list_display = ['child', 'total_score', 'risk_level', 'created_at']
    list_filter = ['risk_level', 'created_at']
    search_fields = ['child__full_name']
    readonly_fields = ['total_score', 'risk_level']

    fieldsets = (
        ('Child', {
            'fields': ('child',)
        }),
        ('Questions 1-10', {
            'fields': ('q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10')
        }),
        ('Questions 11-20', {
            'fields': ('q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18', 'q19', 'q20')
        }),
        ('Results', {
            'fields': ('total_score', 'risk_level')
        }),
    )


@admin.register(AssessmentVideo)
class AssessmentVideoAdmin(admin.ModelAdmin):
    list_display = ['child', 'video_type', 'uploaded_at']
    list_filter = ['video_type', 'uploaded_at']
    search_fields = ['child__full_name', 'description']


@admin.register(ChildAssessment)
class ChildAssessmentAdmin(admin.ModelAdmin):
    list_display = ['child', 'status', 'assigned_doctor', 'parent_confirmed', 'submitted_at']
    list_filter = ['status', 'parent_confirmed']
    search_fields = ['child__full_name']
    raw_id_fields = ['assigned_doctor']
