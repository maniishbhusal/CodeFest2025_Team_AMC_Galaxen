from django.contrib import admin
from .models import Curriculum, CurriculumTask, ChildCurriculum, DailyProgress, DoctorReview


class CurriculumTaskInline(admin.TabularInline):
    model = CurriculumTask
    extra = 1
    fields = ['day_number', 'title', 'order_index']


@admin.register(Curriculum)
class CurriculumAdmin(admin.ModelAdmin):
    list_display = ['title', 'duration_days', 'type', 'spectrum_type', 'created_by', 'created_at']
    list_filter = ['type', 'duration_days']
    search_fields = ['title', 'description']
    inlines = [CurriculumTaskInline]


@admin.register(CurriculumTask)
class CurriculumTaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'curriculum', 'day_number', 'order_index']
    list_filter = ['curriculum', 'day_number']
    search_fields = ['title']


@admin.register(ChildCurriculum)
class ChildCurriculumAdmin(admin.ModelAdmin):
    list_display = ['child', 'curriculum', 'status', 'current_day', 'start_date', 'end_date']
    list_filter = ['status', 'curriculum']
    search_fields = ['child__full_name']


@admin.register(DailyProgress)
class DailyProgressAdmin(admin.ModelAdmin):
    list_display = ['child_curriculum', 'task', 'day_number', 'date', 'status']
    list_filter = ['status', 'date']
    search_fields = ['child_curriculum__child__full_name']


@admin.register(DoctorReview)
class DoctorReviewAdmin(admin.ModelAdmin):
    list_display = ['child_curriculum', 'doctor', 'review_period', 'reviewed_at']
    list_filter = ['review_period']
    search_fields = ['child_curriculum__child__full_name', 'doctor__user__full_name']
