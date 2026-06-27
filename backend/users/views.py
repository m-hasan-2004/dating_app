from django.conf import settings
from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import (
    OpenApiExample,
    OpenApiResponse,
    extend_schema,
    extend_schema_view,
)
from rest_framework import permissions, status, viewsets
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from users.permissions import IsOwnerOrAdmin

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
    LoginSerializer,
    LogoutSerializer,
    RefreshTokenSerializer,
    TokenResponseSerializer,
    UserCompleteProfileSerializer,
    UserRegistrationSerializer,
    UserSerializer,
    UserUpdateSerializer,
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
# Cookie helpers
# ---------------------------------------------------------------------------


def _set_auth_cookies(response, access_token, refresh_token=None):
    """Attach HTTP-only JWT cookies to *response* using settings."""
    response.set_cookie(
        settings.JWT_AUTH_COOKIE,
        access_token,
        max_age=settings.JWT_AUTH_COOKIE_MAX_AGE,
        httponly=True,
        secure=settings.JWT_AUTH_COOKIE_SECURE,
        samesite=settings.JWT_AUTH_COOKIE_SAMESITE,
        path="/",
    )
    if refresh_token is not None:
        response.set_cookie(
            settings.JWT_AUTH_REFRESH_COOKIE,
            refresh_token,
            max_age=settings.JWT_AUTH_REFRESH_COOKIE_MAX_AGE,
            httponly=True,
            secure=settings.JWT_AUTH_COOKIE_SECURE,
            samesite=settings.JWT_AUTH_COOKIE_SAMESITE,
            path="/",
        )
    return response


def _clear_auth_cookies(response):
    """Delete the JWT auth cookies from the client."""
    response.delete_cookie(settings.JWT_AUTH_COOKIE, path="/")
    response.delete_cookie(settings.JWT_AUTH_REFRESH_COOKIE, path="/")
    return response


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


@extend_schema(tags=["User"])
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


@extend_schema(tags=["User"])
class UserViewSet(viewsets.ModelViewSet):
    """
    CRUD for :class:`User` objects.

    * List / create / delete are **admin-only**.
    * Retrieve / update / partial_update allow a user to access their **own**
      record (object-level ``IsOwnerOrAdmin`` permission).
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    filterset_fields = ["is_active", "is_staff", "is_superuser"]
    search_fields = ["username", "email", "phone_number"]
    ordering_fields = ["date_joined", "username"]

    def get_permissions(self):
        if self.action in {"list", "create", "destroy"}:
            return [IsAdminUser()]
        # retrieve / update / partial_update -> owner or admin.
        return [IsOwnerOrAdmin()]

    def get_serializer_class(self):
        # Admins use the full UserSerializer; self-edit uses the limited one.
        if self.action in {"update", "partial_update"} and not (
            self.request.user.is_staff or self.request.user.is_superuser
        ):
            return UserUpdateSerializer
        return UserSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return qs
        # Non-staff users can only ever see their own row.
        return qs.filter(pk=user.pk)


# ---------------------------------------------------------------------------
# Auth API views (JWT cookie-based)
# ---------------------------------------------------------------------------


@extend_schema(
    tags=["Auth"],
    summary="Register a new user",
    description=(
        "Step 1 of signup. Creates a user account with minimal information "
        "(username, email, phone number, access code, password). The supplied "
        "access code is validated and consumed. No tokens are issued here; "
        "call /api/auth/login/ to obtain them."
    ),
    request=UserRegistrationSerializer,
    responses={
        201: OpenApiResponse(
            description="Registration successful",
            examples=[
                OpenApiExample(
                    "Created",
                    value={
                        "user_id": 42,
                        "username": "ali",
                        "message": "Registration successful. Please complete your profile.",
                    },
                )
            ],
        ),
        400: OpenApiResponse(description="Validation error"),
    },
)
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "user_id": user.id,
                "username": user.username,
                "message": _("Registration successful. Please log in."),
            },
            status=status.HTTP_201_CREATED,
        )


@extend_schema(
    tags=["Auth"],
    summary="Log in (set JWT cookies)",
    description=(
        "Validates username + password and sets HTTP-only `access_token` and "
        "`refresh_token` cookies. Returns the authenticated user's profile. "
        "The client does **not** need to store tokens in JavaScript."
    ),
    request=LoginSerializer,
    responses={
        200: TokenResponseSerializer,
        401: OpenApiResponse(description="Invalid credentials"),
    },
)
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        user_data = UserSerializer(user, context={"request": request}).data
        data = {
            "access": str(access),
            "refresh": str(refresh),
            "user": user_data,
        }
        response = Response(data, status=status.HTTP_200_OK)
        
        _set_auth_cookies(
            response,
            access_token=str(access),
            refresh_token=str(refresh),
        )
        return response


@extend_schema(
    tags=["Auth"],
    summary="Refresh access token",
    description=(
        "Reads the `refresh_token` cookie (or `refresh` in the body), "
        "rotates the refresh token (blacklists the old one) and sets new "
        "`access_token` / `refresh_token` cookies."
    ),
    request=RefreshTokenSerializer,
    responses={
        200: TokenResponseSerializer,
        401: OpenApiResponse(description="Invalid or expired refresh token"),
    },
)
class CookieTokenRefreshView(TokenRefreshView):
    """
    Subclass of SimpleJWT's ``TokenRefreshView`` that reads the refresh token
    from the cookie (falling back to the JSON body) and re-sets both cookies.
    """

    serializer_class = None  # use SimpleJWT default

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get(settings.JWT_AUTH_REFRESH_COOKIE)
        if not refresh_token:
            ser = RefreshTokenSerializer(data=request.data)
            ser.is_valid(raise_exception=True)
            refresh_token = ser.validated_data["refresh"]

        request.data["refresh"] = refresh_token
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200 and "access" in response.data:
            # Rotate refresh token when rotation is enabled.
            new_refresh = response.data.get("refresh") or refresh_token
            _set_auth_cookies(
                response,
                access_token=response.data["access"],
                refresh_token=new_refresh,
            )
        return response


@extend_schema(
    tags=["Auth"],
    summary="Log out (clear JWT cookies)",
    description=(
        "Blacklists the refresh token (from the `refresh_token` cookie or body) "
        "and deletes both auth cookies from the client."
    ),
    request=LogoutSerializer,
    responses={
        200: OpenApiResponse(description="Logout successful"),
        400: OpenApiResponse(description="Refresh token required"),
    },
)
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get(settings.JWT_AUTH_REFRESH_COOKIE)
        if not refresh_token:
            ser = LogoutSerializer(
                data=request.data, context={"refresh": refresh_token}
            )
            ser.is_valid(raise_exception=True)
            refresh_token = ser.validated_data["refresh"]

        try:
            RefreshToken(refresh_token).blacklist()
        except TokenError:
            # Token already expired or invalid -- still clear the cookie.
            pass

        response = Response(
            {"detail": _("Logout successful.")}, status=status.HTTP_200_OK
        )
        return _clear_auth_cookies(response)


@extend_schema_view(
    get=extend_schema(
        tags=["Auth"],
        summary="Retrieve the current user",
        description="Returns the authenticated user's profile.",
        responses={200: UserSerializer},
    ),
    patch=extend_schema(
        tags=["Auth"],
        summary="Update the current user",
        description=(
            "Updates the editable profile fields (username, first_name, "
            "last_name, email, phone_number, middle_man_code) and optionally "
            "changes the password (requires `old_password` + `new_password`)."
        ),
        request=UserUpdateSerializer,
        responses={200: UserSerializer},
    ),
)
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        ser = UserSerializer(request.user, context={"request": request})
        return Response(ser.data, status=status.HTTP_200_OK)

    def patch(self, request):
        ser = UserUpdateSerializer(
            request.user, data=request.data, partial=True, context={"request": request}
        )
        ser.is_valid(raise_exception=True)
        ser.save()
        out = UserSerializer(request.user, context={"request": request})
        return Response(out.data, status=status.HTTP_200_OK)


@extend_schema(
    tags=["Auth"],
    summary="Complete profile (step 2 of signup)",
    description=(
        "Updates the user-level profile fields stored on the User model. "
        "Detailed profile sections each have their own CRUD endpoints."
    ),
    request=UserCompleteProfileSerializer,
    responses={200: UserCompleteProfileSerializer},
)
class CompleteProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        ser = UserCompleteProfileSerializer(
            request.user, data=request.data, partial=True
        )
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Confidential / identity information
# ---------------------------------------------------------------------------


@extend_schema(tags=["User"])
class IdentityInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`IdentityInformation` (one-to-one with user)."""

    queryset = IdentityInformation.objects.all()
    serializer_class = IdentityInformationSerializer


@extend_schema(tags=["User"])
class BirthCertificateInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`BirthCertificateInformation` (one-to-one with user)."""

    queryset = BirthCertificateInformation.objects.all()
    serializer_class = BirthCertificateInformationSerializer


@extend_schema(tags=["User"])
class IntroducedSubjectsInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`IntroducedSubjectsInformation` (FK, many per user)."""

    queryset = IntroducedSubjectsInformation.objects.all()
    serializer_class = IntroducedSubjectsInformationSerializer


# ---------------------------------------------------------------------------
# Personal / physical information
# ---------------------------------------------------------------------------


@extend_schema(tags=["User"])
class PersonalInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`PersonalInformation` (one-to-one with user)."""

    queryset = PersonalInformation.objects.all()
    serializer_class = PersonalInformationSerializer


@extend_schema(tags=["User"])
class PhysicalInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`PhysicalInformation` (one-to-one with user)."""

    queryset = PhysicalInformation.objects.all()
    serializer_class = PhysicalInformationSerializer


# ---------------------------------------------------------------------------
# Family information
# ---------------------------------------------------------------------------


@extend_schema(tags=["User"])
class FamilyInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`FamilyInformation` (one-to-one with user)."""

    queryset = FamilyInformation.objects.all()
    serializer_class = FamilyInformationSerializer


@extend_schema(tags=["User"])
class EngagementOrWeddingStatusViewSet(UserProfileModelViewSet):
    """CRUD for :class:`EngagementOrWeddingStatus` (one-to-one with user)."""

    queryset = EngagementOrWeddingStatus.objects.all()
    serializer_class = EngagementOrWeddingStatusSerializer


@extend_schema(tags=["User"])
class ExHusbandChildStatusViewSet(UserProfileModelViewSet):
    """CRUD for :class:`ExHusbandChildStatus` (FK, many per user)."""

    queryset = ExHusbandChildStatus.objects.all()
    serializer_class = ExHusbandChildStatusSerializer


@extend_schema(tags=["User"])
class SisterViewSet(UserProfileModelViewSet):
    """CRUD for :class:`Sister` (FK, many per user)."""

    queryset = Sister.objects.all()
    serializer_class = SisterSerializer


@extend_schema(tags=["User"])
class BrotherViewSet(UserProfileModelViewSet):
    """CRUD for :class:`Brother` (FK, many per user)."""

    queryset = Brother.objects.all()
    serializer_class = BrotherSerializer


@extend_schema(tags=["User"])
class GroomViewSet(UserProfileModelViewSet):
    """CRUD for :class:`Groom` (FK, many per user)."""

    queryset = Groom.objects.all()
    serializer_class = GroomSerializer


@extend_schema(tags=["User"])
class BrideOrWifeViewSet(UserProfileModelViewSet):
    """CRUD for :class:`BrideOrWife` (FK, many per user)."""

    queryset = BrideOrWife.objects.all()
    serializer_class = BrideOrWifeSerializer


@extend_schema(tags=["User"])
class MotherViewSet(UserProfileModelViewSet):
    """CRUD for :class:`Mother` (one-to-one with user)."""

    queryset = Mother.objects.all()
    serializer_class = MotherSerializer


@extend_schema(tags=["User"])
class FatherViewSet(UserProfileModelViewSet):
    """CRUD for :class:`Father` (one-to-one with user)."""

    queryset = Father.objects.all()
    serializer_class = FatherSerializer


# ---------------------------------------------------------------------------
# Financial / intellectual information
# ---------------------------------------------------------------------------


@extend_schema(tags=["User"])
class FinancialInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`FinancialInformation` (one-to-one with user)."""

    queryset = FinancialInformation.objects.all()
    serializer_class = FinancialInformationSerializer


@extend_schema(tags=["User"])
class IntellectualInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`IntellectualInformation` (one-to-one with user)."""

    queryset = IntellectualInformation.objects.all()
    serializer_class = IntellectualInformationSerializer


# ---------------------------------------------------------------------------
# Subject details
# ---------------------------------------------------------------------------


@extend_schema(tags=["User"])
class SubjectDetailsViewSet(UserProfileModelViewSet):
    """CRUD for :class:`SubjectDetails` (one-to-one with user)."""

    queryset = SubjectDetails.objects.all()
    serializer_class = SubjectDetailsSerializer


# ---------------------------------------------------------------------------
# Preferred-wife models
# ---------------------------------------------------------------------------


@extend_schema(tags=["User"])
class PreferredWifePersonalInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`PreferredWifePersonalInformation` (one-to-one)."""

    queryset = PreferredWifePersonalInformation.objects.all()
    serializer_class = PreferredWifePersonalInformationSerializer


@extend_schema(tags=["User"])
class PreferredWifePhysicalInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`PreferredWifePhysicalInformation` (one-to-one)."""

    queryset = PreferredWifePhysicalInformation.objects.all()
    serializer_class = PreferredWifePhysicalInformationSerializer


@extend_schema(tags=["User"])
class PreferredWifeIntellectualInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`PreferredWifeIntellectualInformation` (one-to-one)."""

    queryset = PreferredWifeIntellectualInformation.objects.all()
    serializer_class = PreferredWifeIntellectualInformationSerializer


@extend_schema(tags=["User"])
class FutureSposeOriginalityViewSet(UserProfileModelViewSet):
    """CRUD for :class:`FutureSposeOriginality` (FK, many per user)."""

    queryset = FutureSposeOriginality.objects.all()
    serializer_class = FutureSposeOriginalitySerializer


@extend_schema(tags=["User"])
class PreferredWifeExtraInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`PreferredWifeExtraInformation` (one-to-one)."""

    queryset = PreferredWifeExtraInformation.objects.all()
    serializer_class = PreferredWifeExtraInformationSerializer
