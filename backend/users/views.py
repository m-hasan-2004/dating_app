from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from users.user_related_models import (
    User,
    AccessCode,
    IdentityInformation,
    BirthCertificateInformation,
    IntroducedSubjectsInformation,
    PersonalInformation,
    PhysicalInformation,
    FamilyInformation,
    EngagementOrWeddingStatus,
    ExHusbandChildStatus,
    Sister,
    Brother,
    Groom,
    BrideOrWife,
    Mother,
    Father,
    FinancialInformation,
    IntellectualInformation,
)
from users.user_related_models.subject_details import SubjectDetails
from users.preferred_wife_models import (
    PreferredWifeExtraInformation,
    PreferredWifePhysicalInformation,
    PreferredWifePersonalInformation,
    PreferredWifeIntellectualInformation,
    FutureSposeOriginality,
)

from .serializers import (
    AccessCodeSerializer,
    UserSerializer,
    UserRegistrationSerializer,
    UserCompleteProfileSerializer,
    IdentityInformationSerializer,
    BirthCertificateInformationSerializer,
    IntroducedSubjectsInformationSerializer,
    PersonalInformationSerializer,
    PhysicalInformationSerializer,
    FamilyInformationSerializer,
    EngagementOrWeddingStatusSerializer,
    ExHusbandChildStatusSerializer,
    SisterSerializer,
    BrotherSerializer,
    GroomSerializer,
    BrideOrWifeSerializer,
    MotherSerializer,
    FatherSerializer,
    FinancialInformationSerializer,
    IntellectualInformationSerializer,
    SubjectDetailsSerializer,
    PreferredWifePersonalInformationSerializer,
    PreferredWifePhysicalInformationSerializer,
    PreferredWifeIntellectualInformationSerializer,
    FutureSposeOriginalitySerializer,
    PreferredWifeExtraInformationSerializer,
)


# ---------------------------------------------------------------------------
# Base viewset for user-scoped profile models
# ---------------------------------------------------------------------------


class UserProfileModelViewSet(viewsets.ModelViewSet):
    """
    Base :class:`~rest_framework.viewsets.ModelViewSet` for the OneToOne / FK
    profile models that belong to a single user.

    * ``get_queryset`` -- restricts results to ``request.user``.
    * ``perform_create`` -- auto-assigns ``user=request.user`` so the client
      never needs to send it.

    Subclasses only need to set ``queryset`` and ``serializer_class``.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ---------------------------------------------------------------------------
# Management ViewSets (admin only)
# ---------------------------------------------------------------------------


class AccessCodeViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for :class:`AccessCode` objects.

    Restricted to staff users. Use the ``create_access_code`` management
    command or this endpoint to generate codes for prospective users.
    """

    queryset = AccessCode.objects.all()
    serializer_class = AccessCodeSerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields = ["active"]
    search_fields = ["code"]
    ordering_fields = ["date_created", "active"]


class UserViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for :class:`User` objects.

    Restricted to staff users. Regular user creation happens through the
    :class:`UserRegistrationViewSet` (step 1 of the signup flow); this
    ViewSet is intended for administrative management.
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields = ["is_active", "is_staff", "is_superuser"]
    search_fields = ["username", "email", "phone_number"]
    ordering_fields = ["date_joined", "username"]


# ---------------------------------------------------------------------------
# Two-step registration ViewSet
# ---------------------------------------------------------------------------


class UserRegistrationViewSet(viewsets.ViewSet):
    """
    Two-step user registration flow.

    **Step 1 -- ``POST /api/auth/register/``** (public)

        Create a new user account with minimal information (username, email,
        phone number, access code, password). The supplied access code is
        validated and consumed (deactivated).

    **Step 2 -- ``PATCH /api/auth/complete_profile/``** (authenticated)

        Update the newly created user's profile fields (first name, last name,
        middle-man code, phone number, email). Detailed profile sections
        (personal info, physical info, family info, etc.) are managed through
        their own dedicated CRUD endpoints.

    **``GET /api/auth/me/``** (authenticated)

        Retrieve the profile of the currently authenticated user.
    """

    # AllowAny so that ``register`` is public; individual actions override.
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=["post"], permission_classes=[permissions.AllowAny])
    def register(self, request):
        """Step 1: register a new user with minimal information."""
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "user_id": str(user.id),
                    "username": user.username,
                    "message": "Registration successful. Please complete your profile.",
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=False,
        methods=["patch", "put"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def complete_profile(self, request):
        """Step 2: complete the authenticated user's profile fields."""
        serializer = UserCompleteProfileSerializer(
            request.user, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Retrieve the profile of the currently authenticated user."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Confidential / identity information
# ---------------------------------------------------------------------------


class IdentityInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`IdentityInformation` (one-to-one with user)."""

    queryset = IdentityInformation.objects.all()
    serializer_class = IdentityInformationSerializer


class BirthCertificateInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`BirthCertificateInformation` (one-to-one with user)."""

    queryset = BirthCertificateInformation.objects.all()
    serializer_class = BirthCertificateInformationSerializer


class IntroducedSubjectsInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`IntroducedSubjectsInformation` (FK, many per user)."""

    queryset = IntroducedSubjectsInformation.objects.all()
    serializer_class = IntroducedSubjectsInformationSerializer


# ---------------------------------------------------------------------------
# Personal / physical information
# ---------------------------------------------------------------------------


class PersonalInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`PersonalInformation` (one-to-one with user)."""

    queryset = PersonalInformation.objects.all()
    serializer_class = PersonalInformationSerializer


class PhysicalInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`PhysicalInformation` (one-to-one with user)."""

    queryset = PhysicalInformation.objects.all()
    serializer_class = PhysicalInformationSerializer


# ---------------------------------------------------------------------------
# Family information
# ---------------------------------------------------------------------------


class FamilyInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`FamilyInformation` (one-to-one with user)."""

    queryset = FamilyInformation.objects.all()
    serializer_class = FamilyInformationSerializer


class EngagementOrWeddingStatusViewSet(UserProfileModelViewSet):
    """CRUD for :class:`EngagementOrWeddingStatus` (one-to-one with user)."""

    queryset = EngagementOrWeddingStatus.objects.all()
    serializer_class = EngagementOrWeddingStatusSerializer


class ExHusbandChildStatusViewSet(UserProfileModelViewSet):
    """CRUD for :class:`ExHusbandChildStatus` (FK, many per user)."""

    queryset = ExHusbandChildStatus.objects.all()
    serializer_class = ExHusbandChildStatusSerializer


class SisterViewSet(UserProfileModelViewSet):
    """CRUD for :class:`Sister` (FK, many per user)."""

    queryset = Sister.objects.all()
    serializer_class = SisterSerializer


class BrotherViewSet(UserProfileModelViewSet):
    """CRUD for :class:`Brother` (FK, many per user)."""

    queryset = Brother.objects.all()
    serializer_class = BrotherSerializer


class GroomViewSet(UserProfileModelViewSet):
    """CRUD for :class:`Groom` (FK, many per user)."""

    queryset = Groom.objects.all()
    serializer_class = GroomSerializer


class BrideOrWifeViewSet(UserProfileModelViewSet):
    """CRUD for :class:`BrideOrWife` (FK, many per user)."""

    queryset = BrideOrWife.objects.all()
    serializer_class = BrideOrWifeSerializer


class MotherViewSet(UserProfileModelViewSet):
    """CRUD for :class:`Mother` (one-to-one with user)."""

    queryset = Mother.objects.all()
    serializer_class = MotherSerializer


class FatherViewSet(UserProfileModelViewSet):
    """CRUD for :class:`Father` (one-to-one with user)."""

    queryset = Father.objects.all()
    serializer_class = FatherSerializer


# ---------------------------------------------------------------------------
# Financial / intellectual information
# ---------------------------------------------------------------------------


class FinancialInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`FinancialInformation` (one-to-one with user)."""

    queryset = FinancialInformation.objects.all()
    serializer_class = FinancialInformationSerializer


class IntellectualInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`IntellectualInformation` (one-to-one with user)."""

    queryset = IntellectualInformation.objects.all()
    serializer_class = IntellectualInformationSerializer


# ---------------------------------------------------------------------------
# Subject details
# ---------------------------------------------------------------------------


class SubjectDetailsViewSet(UserProfileModelViewSet):
    """CRUD for :class:`SubjectDetails` (one-to-one with user)."""

    queryset = SubjectDetails.objects.all()
    serializer_class = SubjectDetailsSerializer


# ---------------------------------------------------------------------------
# Preferred-wife models
# ---------------------------------------------------------------------------


class PreferredWifePersonalInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`PreferredWifePersonalInformation` (one-to-one)."""

    queryset = PreferredWifePersonalInformation.objects.all()
    serializer_class = PreferredWifePersonalInformationSerializer


class PreferredWifePhysicalInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`PreferredWifePhysicalInformation` (one-to-one)."""

    queryset = PreferredWifePhysicalInformation.objects.all()
    serializer_class = PreferredWifePhysicalInformationSerializer


class PreferredWifeIntellectualInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`PreferredWifeIntellectualInformation` (one-to-one)."""

    queryset = PreferredWifeIntellectualInformation.objects.all()
    serializer_class = PreferredWifeIntellectualInformationSerializer


class FutureSposeOriginalityViewSet(UserProfileModelViewSet):
    """CRUD for :class:`FutureSposeOriginality` (FK, many per user)."""

    queryset = FutureSposeOriginality.objects.all()
    serializer_class = FutureSposeOriginalitySerializer


class PreferredWifeExtraInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`PreferredWifeExtraInformation` (one-to-one)."""

    queryset = PreferredWifeExtraInformation.objects.all()
    serializer_class = PreferredWifeExtraInformationSerializer
