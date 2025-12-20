from django.db import models
from children.models import Child


class MChatResponse(models.Model):
    """
    M-CHAT-R/F Screening Questionnaire Response
    20 questions for autism screening in toddlers (16-30 months)
    """
    RISK_LEVEL_CHOICES = [
        ('low', 'Low Risk (0-2)'),
        ('medium', 'Medium Risk (3-7)'),
        ('high', 'High Risk (8-20)'),
    ]

    # Reverse scored questions (YES = concerning)
    REVERSE_QUESTIONS = [2, 5, 12]

    child = models.OneToOneField(
        Child,
        on_delete=models.CASCADE,
        related_name='mchat'
    )

    # 20 M-CHAT Questions (True = YES, False = NO)
    q1 = models.BooleanField(help_text="Points & looks at what you point to")
    q2 = models.BooleanField(help_text="Wondered if deaf (REVERSE)")
    q3 = models.BooleanField(help_text="Pretend play")
    q4 = models.BooleanField(help_text="Likes climbing")
    q5 = models.BooleanField(help_text="Unusual finger movements (REVERSE)")
    q6 = models.BooleanField(help_text="Points to ask for something")
    q7 = models.BooleanField(help_text="Points to show something")
    q8 = models.BooleanField(help_text="Interested in other children")
    q9 = models.BooleanField(help_text="Shows things to share")
    q10 = models.BooleanField(help_text="Responds to name")
    q11 = models.BooleanField(help_text="Smiles back")
    q12 = models.BooleanField(help_text="Upset by everyday noises (REVERSE)")
    q13 = models.BooleanField(help_text="Walks")
    q14 = models.BooleanField(help_text="Eye contact")
    q15 = models.BooleanField(help_text="Copies actions")
    q16 = models.BooleanField(help_text="Follows gaze")
    q17 = models.BooleanField(help_text="Seeks attention")
    q18 = models.BooleanField(help_text="Understands commands")
    q19 = models.BooleanField(help_text="Checks reactions")
    q20 = models.BooleanField(help_text="Likes movement activities")

    # Calculated fields
    total_score = models.PositiveIntegerField(default=0)
    risk_level = models.CharField(max_length=10, choices=RISK_LEVEL_CHOICES, default='low')

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "M-CHAT Response"
        verbose_name_plural = "M-CHAT Responses"

    def calculate_score(self):
        """
        Calculate M-CHAT score based on responses.

        Scoring Rules:
        - Most questions: NO = 1 point (concerning), YES = 0 points
        - Reverse questions (2, 5, 12): YES = 1 point (concerning), NO = 0 points

        Risk Levels:
        - 0-2: Low Risk
        - 3-7: Medium Risk
        - 8-20: High Risk
        """
        score = 0

        for q_num in range(1, 21):
            answer = getattr(self, f'q{q_num}')

            if q_num in self.REVERSE_QUESTIONS:
                # YES = 1 point (concerning), NO = 0 points
                if answer:
                    score += 1
            else:
                # NO = 1 point (concerning), YES = 0 points
                if not answer:
                    score += 1

        return score

    def get_risk_level(self, score):
        """Determine risk level from score"""
        if score <= 2:
            return 'low'
        elif score <= 7:
            return 'medium'
        else:
            return 'high'

    def save(self, *args, **kwargs):
        # Auto-calculate score and risk level before saving
        self.total_score = self.calculate_score()
        self.risk_level = self.get_risk_level(self.total_score)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"M-CHAT for {self.child.full_name} - Score: {self.total_score} ({self.risk_level})"


class AssessmentVideo(models.Model):
    """
    Videos uploaded by parents for doctor review
    """
    VIDEO_TYPE_CHOICES = [
        ('walking', 'Walking'),
        ('eating', 'Eating'),
        ('speaking', 'Speaking'),
        ('behavior', 'Behavior'),
        ('playing', 'Playing'),
        ('other', 'Other'),
    ]

    child = models.ForeignKey(
        Child,
        on_delete=models.CASCADE,
        related_name='videos'
    )
    video_type = models.CharField(max_length=20, choices=VIDEO_TYPE_CHOICES)
    video_url = models.TextField(help_text="Video URL or local file path")
    description = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.video_type} video for {self.child.full_name}"


class ChildAssessment(models.Model):
    """
    Overall assessment status for a child
    Tracks the submission and review process
    """
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('in_review', 'In Review'),
        ('accepted', 'Accepted by Doctor'),
        ('completed', 'Assessment Completed'),
    ]

    child = models.OneToOneField(
        Child,
        on_delete=models.CASCADE,
        related_name='assessment'
    )
    assigned_doctor = models.ForeignKey(
        'accounts.Doctor',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_patients'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    parent_confirmed = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Assessment for {self.child.full_name} - {self.status}"
