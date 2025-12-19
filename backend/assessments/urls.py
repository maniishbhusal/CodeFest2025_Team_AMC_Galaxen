from django.urls import path
from .views import (
    MChatView,
    AssessmentVideoListView,
    AssessmentVideoDetailView,
    AssessmentSubmitView,
    AssessmentStatusView,
)

urlpatterns = [
    # M-CHAT Screening
    path('<int:pk>/mchat/', MChatView.as_view(), name='child-mchat'),

    # Assessment Videos
    path('<int:pk>/videos/', AssessmentVideoListView.as_view(), name='child-videos'),
    path('<int:pk>/videos/<int:video_id>/', AssessmentVideoDetailView.as_view(), name='child-video-detail'),

    # Assessment Submission
    path('<int:pk>/assessment/submit/', AssessmentSubmitView.as_view(), name='child-assessment-submit'),
    path('<int:pk>/assessment/status/', AssessmentStatusView.as_view(), name='child-assessment-status'),
]
