from django.conf import settings
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import (
    OpenApiExample,
    OpenApiResponse,
    extend_schema,
    extend_schema_view,
)
from rest_framework import filters, permissions, status, viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from users.authentication import CookieJWTAuthentication

from users.permissions import IsOwnerOrAdmin
from users.preferred_wife_models import (
    FutureSposeOriginality,
    PreferredWifeExtraInformation,
    PreferredWifeIntellectualInformation,
    PreferredWifePersonalInformation,
    PreferredWifePhysicalInformation,
)
from users.user_related_models import (
    AccessCode,
    BirthCertificateInformation,
    BrideOrWife,
    Brother,
    EngagementOrWeddingStatus,
    ExHusbandChildStatus,
    FamilyInformation,
    Father,
    FinancialInformation,
    Groom,
    IdentityInformation,
    IntellectualInformation,
    IntroducedSubjectsInformation,
    Mother,
    PersonalInformation,
    PhysicalInformation,
    Sister,
    User,
    UserBookmark,
)
from users.user_related_models.subject_details import SubjectDetails

from .serializers import (
    AccessCodeSerializer,
    BirthCertificateInformationSerializer,
    BrideOrWifeSerializer,
    BrotherSerializer,
    EngagementOrWeddingStatusSerializer,
    ExHusbandChildStatusSerializer,
    FamilyInformationSerializer,
    FatherSerializer,
    FinancialInformationSerializer,
    FutureSposeOriginalitySerializer,
    GroomSerializer,
    IdentityInformationSerializer,
    IntellectualInformationSerializer,
    IntroducedSubjectsInformationSerializer,
    LoginResponseSerializer,
    LoginSerializer,
    LogoutSerializer,
    MessageSerializer,
    MotherSerializer,
    PersonalInformationSerializer,
    PhysicalInformationSerializer,
    PreferredWifeExtraInformationSerializer,
    PreferredWifeIntellectualInformationSerializer,
    PreferredWifePersonalInformationSerializer,
    PreferredWifePhysicalInformationSerializer,
    RefreshTokenSerializer,
    SisterSerializer,
    SubjectDetailsSerializer,
    UserBookmarkSerializer,
    UserCompleteProfileSerializer,
    UserRegistrationSerializer,
    UserSerializer,
    UserUpdateSerializer,
)

# ---------------------------------------------------------------------------
# Cookie helpers
# ---------------------------------------------------------------------------


def _get_user_from_cookies(request):
    """Try to authenticate the user from cookies. Returns (user, token) or (None, None)."""
    auth = CookieJWTAuthentication()
    try:
        result = auth.authenticate(request)
        if result is not None:
            return result
    except Exception:
        pass
    return None, None


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
    response.delete_cookie(
        settings.JWT_AUTH_COOKIE,
        path="/",
        samesite=settings.JWT_AUTH_COOKIE_SAMESITE,
    )
    response.delete_cookie(
        settings.JWT_AUTH_REFRESH_COOKIE,
        path="/",
        samesite=settings.JWT_AUTH_COOKIE_SAMESITE,
    )
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
        user = self.request.user
        if (user.is_staff or user.is_superuser) and "user" in self.request.query_params:
            return self.queryset.filter(user_id=self.request.query_params["user"])
        return self.queryset.filter(user=user)

    def perform_create(self, serializer):
        user = self.request.user
        target_user = user
        if (user.is_staff or user.is_superuser) and "user" in self.request.query_params:
            target_user = User.objects.get(id=self.request.query_params["user"])
        elif (user.is_staff or user.is_superuser) and "user" in self.request.data:
            target_user = User.objects.get(id=self.request.data["user"])
        serializer.save(user=target_user)


# ---------------------------------------------------------------------------
# Management ViewSets (admin only)
# ---------------------------------------------------------------------------


@extend_schema(tags=["Access Codes"])
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


@extend_schema(tags=["Users personal info"])
class UserViewSet(viewsets.ModelViewSet):
    """
    CRUD for :class:`User` objects.

    * List / create / delete are **admin-only**.
    * Retrieve / update / partial_update allow a user to access their **own**
      record (object-level ``IsOwnerOrAdmin`` permission).
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["is_active", "is_staff", "is_superuser"]
    search_fields = ["username", "email", "phone_number", "middle_man_code"]
    ordering_fields = ["date_joined", "username"]

    def get_permissions(self):
        if self.action in {"create", "destroy", "batch_action"}:
            return [IsAdminUser()]
        if self.action in {"list", "stats"}:
            return [IsAuthenticated()]
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

    def get_object(self):
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        val = self.kwargs.get(lookup_url_kwarg)
        if val:
            import uuid
            from django.db.models import Q
            from rest_framework.generics import get_object_or_404
            try:
                uid = uuid.UUID(str(val))
                return get_object_or_404(self.get_queryset(), Q(id=uid) | Q(username=str(val)))
            except (ValueError, AttributeError):
                return get_object_or_404(self.get_queryset(), username=str(val))
        return super().get_object()

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def stats(self, request):
        """Return system-wide statistics for the admin dashboard and user management header."""
        user = request.user
        if not (user.is_staff or user.is_superuser):
            return Response(
                {"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN
            )

        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        inactive_users = total_users - active_users
        staff_users = User.objects.filter(is_staff=True).count()

        total_codes = AccessCode.objects.count()
        active_codes = AccessCode.objects.filter(active=True).count()
        used_codes = total_codes - active_codes

        # Categorize candidates strictly into Men vs Women
        men_user_ids = set()
        women_user_ids = set()
        for p in PersonalInformation.objects.all():
            g_str = " ".join(p.gender if isinstance(p.gender, list) else [str(p.gender)]).lower()
            if "woman" in g_str or "girl" in g_str:
                women_user_ids.add(p.user_id)
            elif "man" in g_str or "boy" in g_str:
                men_user_ids.add(p.user_id)

        men_count = len(men_user_ids)
        women_count = len(women_user_ids)
        total_gender = men_count + women_count

        gender_ratio_data = {
            "men_count": men_count,
            "women_count": women_count,
            "total_gender_count": total_gender,
            "men_percentage": round((men_count / total_gender) * 100, 1) if total_gender > 0 else 0,
            "women_percentage": round((women_count / total_gender) * 100, 1) if total_gender > 0 else 0,
        }

        # Filter by gender parameter if specified
        gender_param = request.query_params.get("gender", "").lower().strip()
        personal_qs = PersonalInformation.objects.all()
        identity_qs = IdentityInformation.objects.all()
        financial_qs = FinancialInformation.objects.all()
        birth_qs = BirthCertificateInformation.objects.all()

        if gender_param in ["man", "men", "male"]:
            personal_qs = personal_qs.filter(user_id__in=men_user_ids)
            identity_qs = identity_qs.filter(user_id__in=men_user_ids)
            financial_qs = financial_qs.filter(user_id__in=men_user_ids)
            birth_qs = birth_qs.filter(user_id__in=men_user_ids)
        elif gender_param in ["woman", "women", "female"]:
            personal_qs = personal_qs.filter(user_id__in=women_user_ids)
            identity_qs = identity_qs.filter(user_id__in=women_user_ids)
            financial_qs = financial_qs.filter(user_id__in=women_user_ids)
            birth_qs = birth_qs.filter(user_id__in=women_user_ids)

        location_counts = {}
        for orig in identity_qs.exclude(originality="").values_list("originality", flat=True):
            if orig:
                items = orig if isinstance(orig, (list, tuple)) else [orig]
                for item in items:
                    key = str(item).strip()
                    if key:
                        location_counts[key] = location_counts.get(key, 0) + 1

        # Education breakdown
        education_counts = {}
        for edu in personal_qs.exclude(education="").values_list("education", flat=True):
            if edu:
                key = str(edu).strip()
                education_counts[key] = education_counts.get(key, 0) + 1

        # Income breakdown
        income_counts = {}
        for inc in personal_qs.exclude(income="").values_list("income", flat=True):
            if inc:
                key = str(inc).strip()
                income_counts[key] = income_counts.get(key, 0) + 1

        # Housing / Ownership breakdown
        housing_counts = {}
        for own in financial_qs.exclude(ownership_status="").values_list("ownership_status", flat=True):
            if own:
                key = str(own).strip()
                housing_counts[key] = housing_counts.get(key, 0) + 1

        # Marriage Experience breakdown
        marriage_counts = {}
        for exp in birth_qs.exclude(marriage_experince="").values_list("marriage_experince", flat=True):
            if exp:
                key = str(exp).strip()
                marriage_counts[key] = marriage_counts.get(key, 0) + 1

        # Age breakdown from birth_date
        import datetime
        today = datetime.date.today()
        age_counts = {"Under 22": 0, "22 - 26": 0, "27 - 32": 0, "33 - 38": 0, "39 - 45": 0, "45+": 0}
        for bdate in personal_qs.exclude(birth_date__isnull=True).values_list("birth_date", flat=True):
            if bdate:
                try:
                    age = today.year - bdate.year - ((today.month, today.day) < (bdate.month or 1, bdate.day or 1))
                    if age < 22:
                        age_counts["Under 22"] += 1
                    elif age <= 26:
                        age_counts["22 - 26"] += 1
                    elif age <= 32:
                        age_counts["27 - 32"] += 1
                    elif age <= 38:
                        age_counts["33 - 38"] += 1
                    elif age <= 45:
                        age_counts["39 - 45"] += 1
                    else:
                        age_counts["45+"] += 1
                except Exception:
                    pass

        return Response(
            {
                "total_users": total_users,
                "active_users": active_users,
                "inactive_users": inactive_users,
                "staff_users": staff_users,
                "total_codes": total_codes,
                "active_codes": active_codes,
                "used_codes": used_codes,
                "gender_ratio": gender_ratio_data,
                "location_breakdown": location_counts,
                "education_breakdown": education_counts,
                "income_breakdown": income_counts,
                "housing_breakdown": housing_counts,
                "marriage_experience_breakdown": marriage_counts,
                "age_breakdown": age_counts,
                "selected_gender": gender_param or "all",
                "cohort_count": personal_qs.count(),
            }
        )

    @action(detail=False, methods=["post"], permission_classes=[IsAdminUser])
    def batch_action(self, request):
        """
        Perform batch actions on a list of user IDs:
        actions: 'enable', 'disable', 'make_staff', 'make_normal', 'delete'
        """
        action_type = request.data.get("action")
        user_ids = request.data.get("user_ids", [])
        if not action_type or not user_ids:
            return Response(
                {"detail": "action and user_ids are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        import uuid
        from django.db.models import Q

        valid_uuids = []
        usernames = []
        for uid in user_ids:
            try:
                valid_uuids.append(uuid.UUID(str(uid)))
            except (ValueError, AttributeError):
                usernames.append(str(uid))

        qs = User.objects.filter(Q(id__in=valid_uuids) | Q(username__in=usernames))
        affected_count = qs.count()

        if action_type == "enable":
            qs.update(is_active=True)
        elif action_type == "disable":
            qs.exclude(id=request.user.id).update(is_active=False)
        elif action_type == "make_staff":
            qs.update(is_staff=True)
        elif action_type == "make_normal":
            qs.exclude(id=request.user.id).update(is_staff=False)
        elif action_type == "delete":
            qs.exclude(id=request.user.id).delete()
        else:
            return Response(
                {"detail": f"Unknown action: {action_type}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"status": "ok", "action": action_type, "affected": affected_count}
        )

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def candidate_search(self, request):
        """Search candidates with role-based access control and multi-faceted filtering."""
        user = request.user
        is_admin = bool(user.is_staff or user.is_superuser)

        # 1. Determine user gender if not admin
        user_gender = None
        if not is_admin:
            pi = PersonalInformation.objects.filter(user=user).first()
            if pi:
                g_val = " ".join(pi.gender if isinstance(pi.gender, list) else [str(pi.gender)]).lower()
                if "woman" in g_val or "girl" in g_val:
                    user_gender = "woman"
                elif "man" in g_val or "boy" in g_val:
                    user_gender = "man"

        # Base query: active candidates
        users_qs = User.objects.filter(is_active=True)
        if not is_admin:
            users_qs = users_qs.exclude(id=user.id)

        # Access control on gender:
        # If not admin:
        #   If logged-in is 'man' -> only show 'woman'
        #   If logged-in is 'woman' -> only show 'man'
        # If admin: allows query param ?gender=man|woman|all
        requested_gender = request.query_params.get("gender", "").lower().strip()

        target_gender = None
        if not is_admin:
            if user_gender == "man":
                target_gender = "woman"
            elif user_gender == "woman":
                target_gender = "man"
        else:
            if requested_gender in ["man", "woman"]:
                target_gender = requested_gender

        # Apply gender filter if specified
        if target_gender:
            matching_user_ids = set()
            for p in PersonalInformation.objects.all():
                g_str = " ".join(p.gender if isinstance(p.gender, list) else [str(p.gender)]).lower()
                if target_gender == "woman" and ("woman" in g_str or "girl" in g_str):
                    matching_user_ids.add(p.user_id)
                elif target_gender == "man" and ("woman" not in g_str and "girl" not in g_str and ("man" in g_str or "boy" in g_str)):
                    matching_user_ids.add(p.user_id)
            users_qs = users_qs.filter(id__in=matching_user_ids)

        # Keyword search: q / search
        q = request.query_params.get("q") or request.query_params.get("search", "").strip()
        if q:
            from django.db.models import Q
            users_qs = users_qs.filter(
                Q(username__icontains=q)
                | Q(email__icontains=q)
                | Q(phone_number__icontains=q)
                | Q(middle_man_code__icontains=q)
            )

        # Age filter: min_age, max_age
        from datetime import date
        today = date.today()
        min_age = request.query_params.get("min_age")
        max_age = request.query_params.get("max_age")
        if min_age or max_age:
            p_age_qs = PersonalInformation.objects.all()
            if min_age and min_age.isdigit():
                try:
                    max_birth = date(today.year - int(min_age), today.month, today.day)
                    p_age_qs = p_age_qs.filter(birth_date__lte=max_birth)
                except ValueError:
                    pass
            if max_age and max_age.isdigit():
                try:
                    min_birth = date(today.year - int(max_age) - 1, today.month, today.day)
                    p_age_qs = p_age_qs.filter(birth_date__gte=min_birth)
                except ValueError:
                    pass
            users_qs = users_qs.filter(id__in=p_age_qs.values_list("user_id", flat=True))

        # Helper to extract list from query params (supports ?param=a,b and ?param=a&param=b)
        from django.db.models import Q
        def get_list_param(param_name, alt_name=None):
            vals = request.query_params.getlist(param_name)
            if not vals and alt_name:
                vals = request.query_params.getlist(alt_name)
            if not vals:
                single = request.query_params.get(param_name) or (request.query_params.get(alt_name) if alt_name else None)
                if single:
                    vals = [v.strip() for v in single.split(",") if v.strip() and v.strip().lower() != 'all']
            else:
                expanded = []
                for item in vals:
                    for sub in str(item).split(","):
                        s = sub.strip()
                        if s and s.lower() != 'all':
                            expanded.append(s)
                vals = expanded
            return vals

        # Location filter (multiselect with Persian & English city synonyms)
        locations = get_list_param("location", "province")
        if locations:
            q_loc = Q()
            for loc in locations:
                q_loc |= Q(birth_location__icontains=loc)
                loc_lower = loc.lower().strip()
                if loc_lower in ["tehran", "تهران"]:
                    q_loc |= Q(birth_location__icontains="تهران") | Q(birth_location__icontains="Tehran")
                elif loc_lower in ["qom", "قم"]:
                    q_loc |= Q(birth_location__icontains="قم") | Q(birth_location__icontains="Qom")
                elif loc_lower in ["karaj", "کرج", "alborz"]:
                    q_loc |= Q(birth_location__icontains="کرج") | Q(birth_location__icontains="البرز")
                elif loc_lower in ["isfahan", "esfahan", "اصفهان"]:
                    q_loc |= Q(birth_location__icontains="اصفهان") | Q(birth_location__icontains="Isfahan")
                elif loc_lower in ["mashhad", "مشهد", "razavi khorasan"]:
                    q_loc |= Q(birth_location__icontains="مشهد") | Q(birth_location__icontains="خراسان")
                elif loc_lower in ["shiraz", "شیراز", "fars"]:
                    q_loc |= Q(birth_location__icontains="شیراز") | Q(birth_location__icontains="فارس")
                elif loc_lower in ["tabriz", "تبریز", "east azerbaijan"]:
                    q_loc |= Q(birth_location__icontains="تبریز") | Q(birth_location__icontains="آذربایجان")
                elif loc_lower in ["hamadan", "همدان"]:
                    q_loc |= Q(birth_location__icontains="همدان") | Q(birth_location__icontains="Hamadan")
                elif loc_lower in ["yazd", "یزد"]:
                    q_loc |= Q(birth_location__icontains="یزد") | Q(birth_location__icontains="Yazd")
                elif loc_lower in ["gilan", "گیلان", "rasht", "رشت"]:
                    q_loc |= Q(birth_location__icontains="گیلان") | Q(birth_location__icontains="رشت")
                elif loc_lower in ["mazandaran", "مازندران", "sari", "ساری"]:
                    q_loc |= Q(birth_location__icontains="مازندران") | Q(birth_location__icontains="ساری")
                elif loc_lower in ["khuzestan", "خوزستان", "ahvaz", "اهواز"]:
                    q_loc |= Q(birth_location__icontains="خوزستان") | Q(birth_location__icontains="اهواز")
            users_qs = users_qs.filter(
                id__in=PersonalInformation.objects.filter(q_loc).values_list("user_id", flat=True)
            )

        # Education filter (multiselect)
        educations = get_list_param("education", "educationLevel")
        if educations:
            users_qs = users_qs.filter(
                id__in=PersonalInformation.objects.filter(education__in=educations).values_list(
                    "user_id", flat=True
                )
            )

        # Physical: Height & Weight
        min_height = request.query_params.get("min_height") or request.query_params.get("minHeight")
        if min_height:
            try:
                users_qs = users_qs.filter(
                    id__in=PhysicalInformation.objects.filter(height__gte=float(min_height)).values_list(
                        "user_id", flat=True
                    )
                )
            except ValueError:
                pass
        max_height = request.query_params.get("max_height") or request.query_params.get("maxHeight")
        if max_height:
            try:
                users_qs = users_qs.filter(
                    id__in=PhysicalInformation.objects.filter(height__lte=float(max_height)).values_list(
                        "user_id", flat=True
                    )
                )
            except ValueError:
                pass

        min_weight = request.query_params.get("min_weight") or request.query_params.get("minWeight")
        if min_weight:
            try:
                users_qs = users_qs.filter(
                    id__in=PhysicalInformation.objects.filter(weight__gte=float(min_weight)).values_list(
                        "user_id", flat=True
                    )
                )
            except ValueError:
                pass
        max_weight = request.query_params.get("max_weight") or request.query_params.get("maxWeight")
        if max_weight:
            try:
                users_qs = users_qs.filter(
                    id__in=PhysicalInformation.objects.filter(weight__lte=float(max_weight)).values_list(
                        "user_id", flat=True
                    )
                )
            except ValueError:
                pass

        # Skin color (multiselect)
        skin_colors = get_list_param("skin_color", "skinColor")
        if skin_colors:
            users_qs = users_qs.filter(
                id__in=PhysicalInformation.objects.filter(skin_color__in=skin_colors).values_list(
                    "user_id", flat=True
                )
            )

        # Marriage experience (multiselect)
        mar_experiences = get_list_param("marriage_experience", "maritalExperience")
        if mar_experiences:
            q_mar = Q()
            if "no" in mar_experiences:
                # Candidates with explicit 'no' OR without prior marriage record
                has_prior = BirthCertificateInformation.objects.filter(
                    marriage_experince__in=["yes", "engagement_only"]
                ).values_list("user_id", flat=True)
                q_mar |= Q(id__in=BirthCertificateInformation.objects.filter(marriage_experince="no").values_list("user_id", flat=True)) | ~Q(id__in=has_prior)
            if "yes" in mar_experiences:
                q_mar |= Q(id__in=BirthCertificateInformation.objects.filter(marriage_experince="yes").values_list("user_id", flat=True))
            if "engagement_only" in mar_experiences:
                q_mar |= Q(id__in=BirthCertificateInformation.objects.filter(marriage_experince="engagement_only").values_list("user_id", flat=True))
            users_qs = users_qs.filter(q_mar)

        # Financial: income (multiselect), ownership_status (multiselect), job
        incomes = get_list_param("income", "incomeTier")
        if incomes:
            users_qs = users_qs.filter(
                id__in=PersonalInformation.objects.filter(income__in=incomes).values_list(
                    "user_id", flat=True
                )
            )
        ownerships = get_list_param("ownership_status", "housingOwnership")
        if ownerships:
            users_qs = users_qs.filter(
                id__in=FinancialInformation.objects.filter(ownership_status__in=ownerships).values_list(
                    "user_id", flat=True
                )
            )
        job_query = request.query_params.get("job")
        if job_query:
            users_qs = users_qs.filter(
                id__in=FinancialInformation.objects.filter(job__icontains=job_query).values_list(
                    "user_id", flat=True
                )
            )

        # Religious / Lifestyle (multiselect)
        worships = get_list_param("worship_and_prayer", "worship")
        if worships:
            users_qs = users_qs.filter(
                id__in=IntellectualInformation.objects.filter(worship_prayer__in=worships).values_list(
                    "user_id", flat=True
                )
            )
        covers = get_list_param("cover_type_society", "societyCover")
        if covers:
            q_cover = Q()
            for c in covers:
                q_cover |= Q(cover_type_society__icontains=c)
            users_qs = users_qs.filter(
                id__in=IntellectualInformation.objects.filter(q_cover).values_list(
                    "user_id", flat=True
                )
            )
        fastings = get_list_param("fasting")
        if fastings:
            users_qs = users_qs.filter(
                id__in=IntellectualInformation.objects.filter(fasting__in=fastings).values_list(
                    "user_id", flat=True
                )
            )
        velayats = get_list_param("opinion_velayat_faqih", "velayatFaqih")
        if velayats:
            users_qs = users_qs.filter(
                id__in=IntellectualInformation.objects.filter(opinion_velayat_faqih__in=velayats).values_list(
                    "user_id", flat=True
                )
            )

        # Residence status (multiselect), Insurance, Disease
        residences = get_list_param("current_residence_status", "residenceStatus")
        if residences:
            users_qs = users_qs.filter(
                id__in=FinancialInformation.objects.filter(current_residence_status__in=residences).values_list(
                    "user_id", flat=True
                )
            )
        have_ins = request.query_params.get("have_insurance")
        if have_ins in ["1", "true", "True", "yes"]:
            users_qs = users_qs.filter(
                id__in=PersonalInformation.objects.filter(have_insurance=True).values_list("user_id", flat=True)
            )
        elif have_ins in ["0", "false", "False", "no"]:
            users_qs = users_qs.filter(
                id__in=PersonalInformation.objects.filter(have_insurance=False).values_list("user_id", flat=True)
            )
        disease = request.query_params.get("disease_or_surgery") or request.query_params.get("disease_or_surgery_history")
        if disease in ["1", "true", "True", "yes"]:
            users_qs = users_qs.filter(
                id__in=PhysicalInformation.objects.filter(disease_or_surgery_history=True).values_list("user_id", flat=True)
            )
        elif disease in ["0", "false", "False", "no"]:
            users_qs = users_qs.filter(
                id__in=PhysicalInformation.objects.filter(disease_or_surgery_history=False).values_list("user_id", flat=True)
            )

        # Capital / Assets (multiselect) & Dowry (multiselect)
        capitals = get_list_param("capital")
        if capitals:
            q_cap = Q()
            for cap in capitals:
                q_cap |= Q(capital__icontains=cap)
            users_qs = users_qs.filter(
                id__in=FinancialInformation.objects.filter(q_cap).values_list("user_id", flat=True)
            )
        dowries = get_list_param("dowry_type", "future_spouse_dowry_type")
        if dowries:
            q_dow = Q()
            for d in dowries:
                q_dow |= Q(dowry_type__icontains=d)
            users_qs = users_qs.filter(
                id__in=FinancialInformation.objects.filter(q_dow).values_list("user_id", flat=True)
            )

        # Parents Originality (multiselect)
        from users.user_related_models.family_information_model import Mother, Father
        from users.preferred_wife_models.preferred_wife_intellectual_information import PreferredWifeIntellectualInformation

        father_origs = get_list_param("father_originality", "father_orig")
        if father_origs:
            users_qs = users_qs.filter(
                id__in=Father.objects.filter(originality__in=father_origs).values_list("user_id", flat=True)
            )
        mother_origs = get_list_param("mother_originality", "mother_orig")
        if mother_origs:
            users_qs = users_qs.filter(
                id__in=Mother.objects.filter(originality__in=mother_origs).values_list("user_id", flat=True)
            )

        # Marriage with someone with marriage experience (multiselect)
        pref_exps = get_list_param("marriage_with_someone_with_marriage_experience", "marriage_with_experience")
        if pref_exps:
            q_pref = Q()
            for pe in pref_exps:
                q_pref |= Q(marriage_with_someone_with_marriage_experience__icontains=pe)
            users_qs = users_qs.filter(
                id__in=PreferredWifeIntellectualInformation.objects.filter(q_pref).values_list("user_id", flat=True)
            )

        # Ordering
        ordering = request.query_params.get("ordering", "-date_joined")
        if ordering in ["date_joined", "-date_joined", "username", "-username"]:
            users_qs = users_qs.order_by(ordering)
        else:
            users_qs = users_qs.order_by("-date_joined")

        # Pagination
        page_number = max(1, int(request.query_params.get("page", 1)))
        page_size = min(100, max(1, int(request.query_params.get("page_size", 12))))
        total_count = users_qs.count()
        start = (page_number - 1) * page_size
        end = start + page_size
        page_users = list(users_qs[start:end])

        # Bookmarked set for current user
        bookmarked_ids = set()
        try:
            bookmarked_ids = set(
                UserBookmark.objects.filter(user=user).values_list("bookmarked_user_id", flat=True)
            )
        except Exception:
            pass

        user_ids = [u.id for u in page_users]
        personal_map = {p.user_id: p for p in PersonalInformation.objects.filter(user_id__in=user_ids)}
        physical_map = {p.user_id: p for p in PhysicalInformation.objects.filter(user_id__in=user_ids)}
        financial_map = {p.user_id: p for p in FinancialInformation.objects.filter(user_id__in=user_ids)}
        birth_map = {p.user_id: p for p in BirthCertificateInformation.objects.filter(user_id__in=user_ids)}
        intellectual_map = {p.user_id: p for p in IntellectualInformation.objects.filter(user_id__in=user_ids)}
        identity_map = {p.user_id: p for p in IdentityInformation.objects.filter(user_id__in=user_ids)}

        results = []
        for u in page_users:
            p_info = personal_map.get(u.id)
            phys_info = physical_map.get(u.id)
            fin_info = financial_map.get(u.id)
            b_info = birth_map.get(u.id)
            intel_info = intellectual_map.get(u.id)
            ident_info = identity_map.get(u.id)

            cand_age = None
            cand_gender = None
            if p_info:
                g_raw = " ".join(p_info.gender if isinstance(p_info.gender, list) else [str(p_info.gender)]).lower()
                cand_gender = "woman" if ("woman" in g_raw or "girl" in g_raw) else ("man" if ("man" in g_raw or "boy" in g_raw) else "other")
                if p_info.birth_date:
                    cand_age = today.year - p_info.birth_date.year - ((today.month, today.day) < (p_info.birth_date.month, p_info.birth_date.day))

            results.append({
                "id": str(u.id),
                "username": u.username,
                "first_name": ident_info.first_name if ident_info else None,
                "last_name": ident_info.last_name if ident_info else None,
                "gender": cand_gender,
                "age": cand_age,
                "birth_date": str(p_info.birth_date) if (p_info and p_info.birth_date) else None,
                "birth_location": p_info.birth_location if p_info else None,
                "education": p_info.education if p_info else None,
                "degree": p_info.degree if p_info else None,
                "job": fin_info.job if fin_info else None,
                "height": phys_info.height if phys_info else None,
                "weight": phys_info.weight if phys_info else None,
                "skin_color": phys_info.skin_color if phys_info else None,
                "eyes_color": phys_info.eyes_color if phys_info else None,
                "marriage_experience": b_info.marriage_experince if b_info else None,
                "income": p_info.income if p_info else None,
                "ownership_status": fin_info.ownership_status if fin_info else None,
                "worship_and_prayer": intel_info.worship_prayer if intel_info else None,
                "cover_type_society": intel_info.cover_type_society if intel_info else None,
                "date_joined": u.date_joined.isoformat() if u.date_joined else None,
                "is_bookmarked": u.id in bookmarked_ids,
            })

        return Response({
            "count": total_count,
            "page": page_number,
            "page_size": page_size,
            "total_pages": (total_count + page_size - 1) // page_size if page_size > 0 else 1,
            "user_role": "admin" if is_admin else "user",
            "user_gender": user_gender,
            "target_gender": target_gender,
            "results": results,
        })

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def bookmarks(self, request):
        """List bookmarked candidate profiles for the authenticated user."""
        user = request.user
        from datetime import date
        today = date.today()

        bms = UserBookmark.objects.filter(user=user, bookmarked_user__is_active=True).select_related("bookmarked_user")
        bookmarked_users = [bm.bookmarked_user for bm in bms]
        user_ids = [u.id for u in bookmarked_users]

        personal_map = {p.user_id: p for p in PersonalInformation.objects.filter(user_id__in=user_ids)}
        physical_map = {p.user_id: p for p in PhysicalInformation.objects.filter(user_id__in=user_ids)}
        financial_map = {p.user_id: p for p in FinancialInformation.objects.filter(user_id__in=user_ids)}
        birth_map = {p.user_id: p for p in BirthCertificateInformation.objects.filter(user_id__in=user_ids)}
        intellectual_map = {p.user_id: p for p in IntellectualInformation.objects.filter(user_id__in=user_ids)}
        identity_map = {p.user_id: p for p in IdentityInformation.objects.filter(user_id__in=user_ids)}

        results = []
        for u in bookmarked_users:
            p_info = personal_map.get(u.id)
            phys_info = physical_map.get(u.id)
            fin_info = financial_map.get(u.id)
            b_info = birth_map.get(u.id)
            intel_info = intellectual_map.get(u.id)
            ident_info = identity_map.get(u.id)

            cand_age = None
            cand_gender = None
            if p_info:
                g_raw = " ".join(p_info.gender if isinstance(p_info.gender, list) else [str(p_info.gender)]).lower()
                cand_gender = "woman" if ("woman" in g_raw or "girl" in g_raw) else ("man" if ("man" in g_raw or "boy" in g_raw) else "other")
                if p_info.birth_date:
                    cand_age = today.year - p_info.birth_date.year - ((today.month, today.day) < (p_info.birth_date.month, p_info.birth_date.day))

            results.append({
                "id": str(u.id),
                "username": u.username,
                "first_name": ident_info.first_name if ident_info else None,
                "last_name": ident_info.last_name if ident_info else None,
                "gender": cand_gender,
                "age": cand_age,
                "birth_date": str(p_info.birth_date) if (p_info and p_info.birth_date) else None,
                "birth_location": p_info.birth_location if p_info else None,
                "education": p_info.education if p_info else None,
                "degree": p_info.degree if p_info else None,
                "job": fin_info.job if fin_info else None,
                "height": phys_info.height if phys_info else None,
                "weight": phys_info.weight if phys_info else None,
                "marriage_experience": b_info.marriage_experince if b_info else None,
                "income": p_info.income if p_info else None,
                "ownership_status": fin_info.ownership_status if fin_info else None,
                "worship_and_prayer": intel_info.worship_prayer if intel_info else None,
                "cover_type_society": intel_info.cover_type_society if intel_info else None,
                "date_joined": u.date_joined.isoformat() if u.date_joined else None,
                "is_bookmarked": True,
            })

        return Response({
            "count": len(results),
            "results": results,
        })

    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def toggle_bookmark(self, request):
        """Toggle bookmark state for a target user ID."""
        user = request.user
        target_id = request.data.get("candidate_id") or request.data.get("user_id")
        if not target_id:
            return Response(
                {"detail": "candidate_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        import uuid
        from django.db.models import Q
        try:
            uid = uuid.UUID(str(target_id))
            target_user = User.objects.filter(Q(id=uid) | Q(username=str(target_id))).first()
        except (ValueError, AttributeError):
            target_user = User.objects.filter(username=str(target_id)).first()

        if not target_user:
            return Response(
                {"detail": "Candidate user not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        bm = UserBookmark.objects.filter(user=user, bookmarked_user=target_user).first()
        if bm:
            bm.delete()
            is_bm = False
        else:
            UserBookmark.objects.create(user=user, bookmarked_user=target_user)
            is_bm = True

        return Response({
            "candidate_id": str(target_user.id),
            "is_bookmarked": is_bm,
        })


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
        "The client does **not** need to store tokens in JavaScript -- the "
        "browser sends the `access_token` cookie automatically on subsequent "
        "requests. Raw tokens are intentionally **not** returned in the body.\n\n"
        "If a valid session already exists, returns the current user profile "
        "with an informational message without re-issuing tokens."
    ),
    request=LoginSerializer,
    responses={
        200: LoginResponseSerializer,
        401: OpenApiResponse(description="Invalid credentials"),
    },
)
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Check for an existing valid session first
        existing_user, _token = _get_user_from_cookies(request)
        if existing_user is not None:
            return Response(
                {
                    "detail": _("Session already active."),
                    "user": UserSerializer(existing_user, context={"request": request}).data,
                },
                status=status.HTTP_200_OK,
            )

        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        response = Response(
            {"user": UserSerializer(user, context={"request": request}).data},
            status=status.HTTP_200_OK,
        )
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
        "Reads the `refresh_token` cookie (falling back to `refresh` in the "
        "body), rotates the refresh token (blacklists the old one when "
        "blacklisting is enabled) and sets new `access_token` / `refresh_token` "
        "cookies. The new tokens are delivered via cookies only -- the response "
        "body just confirms success."
    ),
    request=RefreshTokenSerializer,
    responses={
        200: MessageSerializer,
        401: OpenApiResponse(description="Invalid or expired refresh token"),
    },
)
class CookieTokenRefreshView(TokenRefreshView):
    """
    Subclass of SimpleJWT's ``TokenRefreshView`` that reads the refresh token
    from the cookie (falling back to the JSON body) and re-sets both cookies.
    """

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get(settings.JWT_AUTH_REFRESH_COOKIE)
        if not refresh_token:
            ser = RefreshTokenSerializer(data=request.data)
            ser.is_valid(raise_exception=True)
            refresh_token = ser.validated_data["refresh"]

        # Inject the refresh token into the payload SimpleJWT will validate.
        # ``request.data`` is a plain dict for JSON, an immutable QueryDict for
        # form-encoded bodies -- handle both.
        data = request.data
        if hasattr(data, "_mutable"):  # django.http.QueryDict
            data._mutable = True
        data["refresh"] = refresh_token

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200 and "access" in response.data:
            # Rotate refresh token when rotation is enabled.
            new_refresh = response.data.get("refresh") or refresh_token
            _set_auth_cookies(
                response,
                access_token=response.data["access"],
                refresh_token=new_refresh,
            )
            # Tokens live in cookies now; don't leak them in the body.
            response.data = {"detail": _("Access token cookie refreshed.")}
        return response


@extend_schema(
    tags=["Auth"],
    summary="Log out (clear JWT cookies)",
    description=(
        "Blacklists the refresh token found in the `refresh_token` cookie "
        "(or `refresh` in the request body) and deletes both auth cookies. "
        "No authentication is required so that logout always succeeds, "
        "including after the short-lived access token has expired.\n\n"
        "If no active session is found, returns an informational message "
        "without error."
    ),
    request=LogoutSerializer,
    responses={
        200: MessageSerializer,
    },
)
class LogoutView(APIView):
    # AllowAny: logout must work even if the access token has expired.
    # The refresh token (from cookie or body) is blacklisted best-effort.
    permission_classes = [AllowAny]

    def post(self, request):
        existing_user, _token = _get_user_from_cookies(request)
        cookie_refresh = request.COOKIES.get(settings.JWT_AUTH_REFRESH_COOKIE) or ""
        body_refresh = request.data.get("refresh") or ""
        refresh_token = cookie_refresh or body_refresh

        has_active_session = existing_user is not None or bool(refresh_token and refresh_token.strip())

        if not has_active_session:
            response = Response(
                {"detail": _("No active session found.")},
                status=status.HTTP_200_OK,
            )
            return _clear_auth_cookies(response)

        token_blacklisted = False
        if refresh_token:
            try:
                RefreshToken(refresh_token).blacklist()
                token_blacklisted = True
            except TokenError:
                pass

        if existing_user is not None or token_blacklisted:
            msg = _("Logged out successfully.")
        else:
            msg = _("No active session found.")

        response = Response({"detail": msg}, status=status.HTTP_200_OK)
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
        data = ser.data
        # Include decoded JWT metadata from request.auth (SimpleJWT decoded token)
        if hasattr(request, 'auth') and request.auth:
            from datetime import datetime, timezone
            data['token'] = {
                'type': request.auth.get('token_type', 'access'),
                'exp': datetime.fromtimestamp(
                    request.auth.get('exp', 0), tz=timezone.utc
                ).isoformat(),
                'iat': datetime.fromtimestamp(
                    request.auth.get('iat', 0), tz=timezone.utc
                ).isoformat(),
            }
        return Response(data, status=status.HTTP_200_OK)

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


@extend_schema(tags=["Personals Information"])
class IdentityInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`IdentityInformation` (one-to-one with user)."""

    queryset = IdentityInformation.objects.all()
    serializer_class = IdentityInformationSerializer


@extend_schema(tags=["Personals Information"])
class BirthCertificateInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`BirthCertificateInformation` (one-to-one with user)."""

    queryset = BirthCertificateInformation.objects.all()
    serializer_class = BirthCertificateInformationSerializer


@extend_schema(tags=["Personals Information"])
class IntroducedSubjectsInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`IntroducedSubjectsInformation` (FK, many per user)."""

    queryset = IntroducedSubjectsInformation.objects.all()
    serializer_class = IntroducedSubjectsInformationSerializer


# ---------------------------------------------------------------------------
# Personal / physical information
# ---------------------------------------------------------------------------


@extend_schema(tags=["Personals Information"])
class PersonalInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`PersonalInformation` (one-to-one with user)."""

    queryset = PersonalInformation.objects.all()
    serializer_class = PersonalInformationSerializer


@extend_schema(tags=["Physical Information"])
class PhysicalInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`PhysicalInformation` (one-to-one with user)."""

    queryset = PhysicalInformation.objects.all()
    serializer_class = PhysicalInformationSerializer


# ---------------------------------------------------------------------------
# Family information
# ---------------------------------------------------------------------------


@extend_schema(tags=["Families Information"])
class FamilyInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`FamilyInformation` (one-to-one with user)."""

    queryset = FamilyInformation.objects.all()
    serializer_class = FamilyInformationSerializer


@extend_schema(tags=["Engagements or Weddings Statuses"])
class EngagementOrWeddingStatusViewSet(UserProfileModelViewSet):
    """CRUD for :class:`EngagementOrWeddingStatus` (one-to-one with user)."""

    queryset = EngagementOrWeddingStatus.objects.all()
    serializer_class = EngagementOrWeddingStatusSerializer


@extend_schema(tags=["Ex-Husbands Child Status"])
class ExHusbandChildStatusViewSet(UserProfileModelViewSet):
    """CRUD for :class:`ExHusbandChildStatus` (FK, many per user)."""

    queryset = ExHusbandChildStatus.objects.all()
    serializer_class = ExHusbandChildStatusSerializer


@extend_schema(tags=["Sisters"])
class SisterViewSet(UserProfileModelViewSet):
    """CRUD for :class:`Sister` (FK, many per user)."""

    queryset = Sister.objects.all()
    serializer_class = SisterSerializer


@extend_schema(tags=["Brothers"])
class BrotherViewSet(UserProfileModelViewSet):
    """CRUD for :class:`Brother` (FK, many per user)."""

    queryset = Brother.objects.all()
    serializer_class = BrotherSerializer


@extend_schema(tags=["Grooms"])
class GroomViewSet(UserProfileModelViewSet):
    """CRUD for :class:`Groom` (FK, many per user)."""

    queryset = Groom.objects.all()
    serializer_class = GroomSerializer


@extend_schema(tags=["Brides or Wives"])
class BrideOrWifeViewSet(UserProfileModelViewSet):
    """CRUD for :class:`BrideOrWife` (FK, many per user)."""

    queryset = BrideOrWife.objects.all()
    serializer_class = BrideOrWifeSerializer


@extend_schema(tags=["Mother"])
class MotherViewSet(UserProfileModelViewSet):
    """CRUD for :class:`Mother` (one-to-one with user)."""

    queryset = Mother.objects.all()
    serializer_class = MotherSerializer


@extend_schema(tags=["Father"])
class FatherViewSet(UserProfileModelViewSet):
    """CRUD for :class:`Father` (one-to-one with user)."""

    queryset = Father.objects.all()
    serializer_class = FatherSerializer


# ---------------------------------------------------------------------------
# Financial / intellectual information
# ---------------------------------------------------------------------------


@extend_schema(tags=["Financial Information"])
class FinancialInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`FinancialInformation` (one-to-one with user)."""

    queryset = FinancialInformation.objects.all()
    serializer_class = FinancialInformationSerializer


@extend_schema(tags=["Intellectual Information"])
class IntellectualInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`IntellectualInformation` (one-to-one with user)."""

    queryset = IntellectualInformation.objects.all()
    serializer_class = IntellectualInformationSerializer


# ---------------------------------------------------------------------------
# Subject details
# ---------------------------------------------------------------------------


@extend_schema(tags=["System"])
class SubjectDetailsViewSet(UserProfileModelViewSet):
    """CRUD for :class:`SubjectDetails` (one-to-one with user)."""

    queryset = SubjectDetails.objects.all()
    serializer_class = SubjectDetailsSerializer


# ---------------------------------------------------------------------------
# Preferred-wife models
# ---------------------------------------------------------------------------


@extend_schema(tags=["Preferred Wife Personal Information"])
class PreferredWifePersonalInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`PreferredWifePersonalInformation` (one-to-one)."""

    queryset = PreferredWifePersonalInformation.objects.all()
    serializer_class = PreferredWifePersonalInformationSerializer


@extend_schema(tags=["Preferred Wife Physical Information"])
class PreferredWifePhysicalInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`PreferredWifePhysicalInformation` (one-to-one)."""

    queryset = PreferredWifePhysicalInformation.objects.all()
    serializer_class = PreferredWifePhysicalInformationSerializer


@extend_schema(tags=["Preferred Wife Intellectual Information"])
class PreferredWifeIntellectualInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`PreferredWifeIntellectualInformation` (one-to-one)."""

    queryset = PreferredWifeIntellectualInformation.objects.all()
    serializer_class = PreferredWifeIntellectualInformationSerializer


@extend_schema(tags=["Future Spouse Originalities"])
class FutureSposeOriginalityViewSet(UserProfileModelViewSet):
    """CRUD for :class:`FutureSposeOriginality` (FK, many per user)."""

    queryset = FutureSposeOriginality.objects.all()
    serializer_class = FutureSposeOriginalitySerializer


@extend_schema(tags=["Preferred Wife Extra Information"])
class PreferredWifeExtraInformationViewSet(UserProfileModelViewSet):
    """CRUD for :class:`PreferredWifeExtraInformation` (one-to-one)."""

    queryset = PreferredWifeExtraInformation.objects.all()
    serializer_class = PreferredWifeExtraInformationSerializer


@extend_schema(tags=["User Bookmarks"])
class UserBookmarkViewSet(viewsets.ModelViewSet):
    """Dedicated ViewSet for user candidate bookmarks."""

    serializer_class = UserBookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            UserBookmark.objects.filter(user=self.request.user)
            .select_related("user", "bookmarked_user")
            .order_by("-created_at")
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["post"])
    def toggle(self, request):
        candidate_id = (
            request.data.get("candidate_id")
            or request.data.get("bookmarked_user")
            or request.data.get("user_id")
        )
        if not candidate_id:
            return Response(
                {"detail": "candidate_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        candidate = get_object_or_404(User, id=candidate_id)
        bookmark = UserBookmark.objects.filter(
            user=request.user, bookmarked_user=candidate
        ).first()
        if bookmark:
            bookmark.delete()
            return Response({
                "is_bookmarked": False,
                "candidate_id": str(candidate.id),
                "message": "Bookmark removed",
            })
        else:
            new_bm = UserBookmark.objects.create(
                user=request.user, bookmarked_user=candidate
            )
            return Response({
                "is_bookmarked": True,
                "bookmark_id": new_bm.id,
                "candidate_id": str(candidate.id),
                "message": "Bookmark added",
            })
