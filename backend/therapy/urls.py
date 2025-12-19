from django.urls import path
from . import views

urlpatterns = [
    # Curriculum endpoints
    path('curricula/', views.CurriculumListView.as_view(), name='curriculum-list'),
    path('curricula/<int:pk>/', views.CurriculumDetailView.as_view(), name='curriculum-detail'),

    # Doctor dashboard endpoints
    path('doctor/pending/', views.DoctorPendingPatientsView.as_view(), name='doctor-pending'),
    path('doctor/patients/', views.DoctorAcceptedPatientsView.as_view(), name='doctor-patients'),
    path('doctor/patient/<int:child_id>/', views.DoctorPatientDetailView.as_view(), name='doctor-patient-detail'),
    path('doctor/patient/<int:child_id>/accept/', views.DoctorAcceptPatientView.as_view(), name='doctor-accept'),
    path('doctor/patient/<int:child_id>/assign/', views.DoctorAssignCurriculumView.as_view(), name='doctor-assign'),
    path('doctor/patient/<int:child_id>/progress/', views.DoctorPatientProgressView.as_view(), name='doctor-progress'),
    path('doctor/patient/<int:child_id>/review/', views.DoctorCreateReviewView.as_view(), name='doctor-review'),
    path('doctor/patient/<int:child_id>/diagnosis/', views.DoctorCreateDiagnosisView.as_view(), name='doctor-diagnosis'),

    # Doctor report management
    path('doctor/report/<int:report_id>/toggle-share/', views.DoctorToggleReportShareView.as_view(), name='toggle-report-share'),

    # Parent endpoints
    path('child/<int:child_id>/today/', views.TodayTasksView.as_view(), name='today-tasks'),
    path('child/<int:child_id>/submit/', views.SubmitProgressView.as_view(), name='submit-progress'),
    path('child/<int:child_id>/advance/', views.AdvanceDayView.as_view(), name='advance-day'),
    path('child/<int:child_id>/history/', views.ProgressHistoryView.as_view(), name='progress-history'),
    path('child/<int:child_id>/curriculum/', views.ChildCurriculumStatusView.as_view(), name='curriculum-status'),
    path('child/<int:child_id>/reports/', views.ChildDiagnosisReportsView.as_view(), name='child-reports'),
]
