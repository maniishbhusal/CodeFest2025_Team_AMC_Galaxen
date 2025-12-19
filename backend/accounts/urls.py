from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    ParentRegisterView,
    DoctorRegisterView,
    LoginView,
    CurrentUserView,
    ParentDetailsView,
    HouseholdView,
)

urlpatterns = [
    # Auth endpoints
    path('auth/register/parent/', ParentRegisterView.as_view(), name='register-parent'),
    path('auth/register/doctor/', DoctorRegisterView.as_view(), name='register-doctor'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/me/', CurrentUserView.as_view(), name='current-user'),

    # Parent profile endpoints
    path('parent/profile/', ParentDetailsView.as_view(), name='parent-profile'),
    path('parent/household/', HouseholdView.as_view(), name='parent-household'),
]
