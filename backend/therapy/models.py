from django.db import models
from django.conf import settings
from children.models import Child


class Curriculum(models.Model):
    """
    Therapy curriculum template.
    Can be general (for all children) or specialized (for specific spectrum types).
    """
    TYPE_CHOICES = [
        ('general', 'General'),
        ('specialized', 'Specialized'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    duration_days = models.PositiveIntegerField(help_text="15, 30, or 45 days")
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='general')
    spectrum_type = models.CharField(
        max_length=100,
        blank=True,
        help_text="For specialized curriculum only"
    )
    created_by = models.ForeignKey(
        'accounts.Doctor',
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_curricula'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Curricula'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.duration_days} days)"


class CurriculumTask(models.Model):
    """
    Individual task within a curriculum.
    Each task is assigned to a specific day.
    """
    curriculum = models.ForeignKey(
        Curriculum,
        on_delete=models.CASCADE,
        related_name='tasks'
    )
    day_number = models.PositiveIntegerField(help_text="Day 1 to duration_days")
    title = models.CharField(max_length=255)
    why_description = models.TextField(help_text="Why this task matters for the child")
    instructions = models.TextField(help_text="Step-by-step instructions for parents")
    demo_video_url = models.URLField(blank=True, help_text="Demo video URL")
    order_index = models.PositiveIntegerField(default=0, help_text="Order within the day")

    class Meta:
        ordering = ['day_number', 'order_index']

    def __str__(self):
        return f"Day {self.day_number}: {self.title}"


class ChildCurriculum(models.Model):
    """
    Assigns a curriculum to a child.
    Tracks the child's progress through the curriculum.
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
    ]

    child = models.ForeignKey(
        Child,
        on_delete=models.CASCADE,
        related_name='curricula'
    )
    curriculum = models.ForeignKey(
        Curriculum,
        on_delete=models.CASCADE,
        related_name='child_assignments'
    )
    assigned_by = models.ForeignKey(
        'accounts.Doctor',
        on_delete=models.SET_NULL,
        null=True,
        related_name='assigned_curricula'
    )
    start_date = models.DateField()
    end_date = models.DateField()
    current_day = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Child Curricula'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.child.full_name} - {self.curriculum.title}"


class DailyProgress(models.Model):
    """
    Daily progress submitted by parent for a task.
    """
    STATUS_CHOICES = [
        ('not_done', 'Not Done'),
        ('done_with_help', 'Done with Help'),
        ('done_without_help', 'Done without Help'),
    ]

    child_curriculum = models.ForeignKey(
        ChildCurriculum,
        on_delete=models.CASCADE,
        related_name='progress_entries'
    )
    task = models.ForeignKey(
        CurriculumTask,
        on_delete=models.CASCADE,
        related_name='progress_entries'
    )
    day_number = models.PositiveIntegerField()
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_done')
    video_url = models.URLField(blank=True, help_text="Video of child doing the task")
    parent_notes = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Daily Progress'
        ordering = ['-date', '-submitted_at']
        unique_together = ['child_curriculum', 'task', 'date']

    def __str__(self):
        return f"{self.child_curriculum.child.full_name} - Day {self.day_number} - {self.status}"


class DoctorReview(models.Model):
    """
    Doctor's review of child's progress at checkpoints (Day 15, 30, 45).
    """
    child_curriculum = models.ForeignKey(
        ChildCurriculum,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    doctor = models.ForeignKey(
        'accounts.Doctor',
        on_delete=models.SET_NULL,
        null=True,
        related_name='reviews'
    )
    review_period = models.PositiveIntegerField(help_text="Day 15, 30, or 45")
    observations = models.TextField()
    spectrum_identified = models.CharField(max_length=100, blank=True)
    recommendations = models.TextField()
    reviewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-reviewed_at']

    def __str__(self):
        return f"Review for {self.child_curriculum.child.full_name} - Day {self.review_period}"
