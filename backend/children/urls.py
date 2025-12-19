from django.urls import path
from .views import (
    ChildListCreateView,
    ChildDetailView,
    ChildEducationView,
    ChildHealthView,
    MedicalHistoryView,
    ChildFullRegistrationView,
)

urlpatterns = [
    # Full Registration (ONE endpoint for all sections)
    path('register/', ChildFullRegistrationView.as_view(), name='child-full-registration'),

    # Child CRUD
    path('', ChildListCreateView.as_view(), name='child-list-create'),
    path('<int:pk>/', ChildDetailView.as_view(), name='child-detail'),

    # Child Education (Section 5)
    path('<int:pk>/education/', ChildEducationView.as_view(), name='child-education'),

    # Child Health (Section 6)
    path('<int:pk>/health/', ChildHealthView.as_view(), name='child-health'),

    # Medical History (A1-A4)
    path('<int:pk>/medical-history/', MedicalHistoryView.as_view(), name='child-medical-history'),
]
