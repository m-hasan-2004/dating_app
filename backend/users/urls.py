"""
URL configuration for the ``users`` app.

All endpoints are exposed under the ``/api/`` prefix (configured in the
project ``dating_app/urls.py``). Routes are split into:

* ``/api/auth/``    -- authentication (register, login, refresh, logout, me, complete-profile).
* ``/api/users/``   -- user management (admin list/create/delete, owner retrieve/update).
* ``/api/access-codes/`` and the profile-model CRUD endpoints.

The browsable API root (``/api/``) lists every route automatically.
"""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    # Auth views
    CompleteProfileView,
    CookieTokenRefreshView,
    LoginView,
    LogoutView,
    MeView,
    RegisterView,
    # Management ViewSets
    AccessCodeViewSet,
    UserViewSet,
    # Profile model ViewSets
    IdentityInformationViewSet,
    BirthCertificateInformationViewSet,
    IntroducedSubjectsInformationViewSet,
    PersonalInformationViewSet,
    PhysicalInformationViewSet,
    FamilyInformationViewSet,
    EngagementOrWeddingStatusViewSet,
    ExHusbandChildStatusViewSet,
    SisterViewSet,
    BrotherViewSet,
    GroomViewSet,
    BrideOrWifeViewSet,
    MotherViewSet,
    FatherViewSet,
    FinancialInformationViewSet,
    IntellectualInformationViewSet,
    SubjectDetailsViewSet,
    PreferredWifePersonalInformationViewSet,
    PreferredWifePhysicalInformationViewSet,
    PreferredWifeIntellectualInformationViewSet,
    FutureSposeOriginalityViewSet,
    PreferredWifeExtraInformationViewSet,
)

# User router for all user-related ViewSets
user_router = DefaultRouter()

# Management ViewSets (admin only for list/create/destroy; owner-or-admin for retrieve/update)
user_router.register(r"users", UserViewSet, basename="api-user")
user_router.register(r"access-codes", AccessCodeViewSet, basename="access-code")

# Confidential / identity information
user_router.register(
    r"identity-information",
    IdentityInformationViewSet,
    basename="identity-information",
)
user_router.register(
    r"birth-certificate-information",
    BirthCertificateInformationViewSet,
    basename="birth-certificate-information",
)
user_router.register(
    r"introduced-subjects-information",
    IntroducedSubjectsInformationViewSet,
    basename="introduced-subjects-information",
)

# Personal / physical information
user_router.register(
    r"personal-information",
    PersonalInformationViewSet,
    basename="personal-information",
)
user_router.register(
    r"physical-information",
    PhysicalInformationViewSet,
    basename="physical-information",
)

# Family information
user_router.register(
    r"family-information",
    FamilyInformationViewSet,
    basename="family-information",
)
user_router.register(
    r"engagement-or-wedding-status",
    EngagementOrWeddingStatusViewSet,
    basename="engagement-or-wedding-status",
)
user_router.register(
    r"ex-husband-child-status",
    ExHusbandChildStatusViewSet,
    basename="ex-husband-child-status",
)
user_router.register(r"sisters", SisterViewSet, basename="sister")
user_router.register(r"brothers", BrotherViewSet, basename="brother")
user_router.register(r"grooms", GroomViewSet, basename="groom")
user_router.register(r"bride-or-wife", BrideOrWifeViewSet, basename="bride-or-wife")
user_router.register(r"mothers", MotherViewSet, basename="mother")
user_router.register(r"fathers", FatherViewSet, basename="father")

# Financial / intellectual information
user_router.register(
    r"financial-information",
    FinancialInformationViewSet,
    basename="financial-information",
)
user_router.register(
    r"intellectual-information",
    IntellectualInformationViewSet,
    basename="intellectual-information",
)

# Subject details
user_router.register(
    r"subject-details",
    SubjectDetailsViewSet,
    basename="subject-details",
)

# Preferred-wife models
user_router.register(
    r"preferred-wife-personal-information",
    PreferredWifePersonalInformationViewSet,
    basename="preferred-wife-personal-information",
)
user_router.register(
    r"preferred-wife-physical-information",
    PreferredWifePhysicalInformationViewSet,
    basename="preferred-wife-physical-information",
)
user_router.register(
    r"preferred-wife-intellectual-information",
    PreferredWifeIntellectualInformationViewSet,
    basename="preferred-wife-intellectual-information",
)
user_router.register(
    r"future-spouse-originality",
    FutureSposeOriginalityViewSet,
    basename="future-spouse-originality",
)
user_router.register(
    r"preferred-wife-extra-information",
    PreferredWifeExtraInformationViewSet,
    basename="preferred-wife-extra-information",
)

# Auth routes are explicit (cookie-based JWT flow, not part of the router).
auth_patterns = [
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("login/", LoginView.as_view(), name="auth-login"),
    path("logout/", LogoutView.as_view(), name="auth-logout"),
    path("refresh/", CookieTokenRefreshView.as_view(), name="auth-refresh"),
    path("me/", MeView.as_view(), name="auth-me"),
    path(
        "complete-profile/",
        CompleteProfileView.as_view(),
        name="auth-complete-profile",
    ),
]

urlpatterns = [
    path("auth/", include((auth_patterns, "auth"), namespace="auth")),
    path("user/", include(user_router.urls)),
]