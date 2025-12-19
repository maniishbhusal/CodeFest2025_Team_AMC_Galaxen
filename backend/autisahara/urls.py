from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="AutiSahara Nepal API",
        default_version='v1',
        description="""
## AutiSahara Nepal - Autism Therapy Platform API

A mobile-first platform connecting Nepali families with autism therapists.

### Features
- **Parent Registration**: Register parents with child information
- **Doctor Registration**: Register verified therapists
- **M-CHAT Screening**: 20-question autism screening for toddlers (16-30 months)
- **Curriculum System**: Daily therapy tasks with progress tracking
- **Video Submissions**: Upload child behavior videos for doctor review

### Authentication
All endpoints (except registration and login) require JWT Bearer token.
Include the token in the Authorization header:
```
Authorization: Bearer <access_token>
```
        """,
        terms_of_service="https://autisahara.com/terms/",
        contact=openapi.Contact(email="support@autisahara.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("accounts.urls")),
    path("api/children/", include("children.urls")),

    # Swagger UI
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    path("swagger.json", schema_view.without_ui(cache_timeout=0), name="schema-json"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
