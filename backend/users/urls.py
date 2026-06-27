from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AccessCodeViewSet,
    UserViewSet,
    UserRegistrationViewSet,
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

router = DefaultRouter()

# Management ViewSets (admin only)
router.register(r"users", UserViewSet, basename="api-user")
router.register(r"access-codes", AccessCodeViewSet, basename="access-code")

# Two-step registration flow (custom actions)
router.register(r"auth", UserRegistrationViewSet, basename="auth")

# Confidential / identity information
router.register(
    r"identity-information",
    IdentityInformationViewSet,
    basename="identity-information",
)
router.register(
    r"birth-certificate-information",
    BirthCertificateInformationViewSet,
    basename="birth-certificate-information",
)
router.register(
    r"introduced-subjects-information",
    IntroducedSubjectsInformationViewSet,
    basename="introduced-subjects-information",
)

# Personal / physical information
router.register(
    r"personal-information",
    PersonalInformationViewSet,
    basename="personal-information",
)
router.register(
    r"physical-information",
    PhysicalInformationViewSet,
    basename="physical-information",
)

# Family information
router.register(
    r"family-information",
    FamilyInformationViewSet,
    basename="family-information",
)
router.register(
    r"engagement-or-wedding-status",
    EngagementOrWeddingStatusViewSet,
    basename="engagement-or-wedding-status",
)
router.register(
    r"ex-husband-child-status",
    ExHusbandChildStatusViewSet,
    basename="ex-husband-child-status",
)
router.register(r"sisters", SisterViewSet, basename="sister")
router.register(r"brothers", BrotherViewSet, basename="brother")
router.register(r"grooms", GroomViewSet, basename="groom")
router.register(r"bride-or-wife", BrideOrWifeViewSet, basename="bride-or-wife")
router.register(r"mothers", MotherViewSet, basename="mother")
router.register(r"fathers", FatherViewSet, basename="father")

# Financial / intellectual information
router.register(
    r"financial-information",
    FinancialInformationViewSet,
    basename="financial-information",
)
router.register(
    r"intellectual-information",
    IntellectualInformationViewSet,
    basename="intellectual-information",
)

# Subject details
router.register(
    r"subject-details",
    SubjectDetailsViewSet,
    basename="subject-details",
)

# Preferred-wife models
router.register(
    r"preferred-wife-personal-information",
    PreferredWifePersonalInformationViewSet,
    basename="preferred-wife-personal-information",
)
router.register(
    r"preferred-wife-physical-information",
    PreferredWifePhysicalInformationViewSet,
    basename="preferred-wife-physical-information",
)
router.register(
    r"preferred-wife-intellectual-information",
    PreferredWifeIntellectualInformationViewSet,
    basename="preferred-wife-intellectual-information",
)
router.register(
    r"future-spouse-originality",
    FutureSposeOriginalityViewSet,
    basename="future-spouse-originality",
)
router.register(
    r"preferred-wife-extra-information",
    PreferredWifeExtraInformationViewSet,
    basename="preferred-wife-extra-information",
)

urlpatterns = [
    path("", include(router.urls)),
]
