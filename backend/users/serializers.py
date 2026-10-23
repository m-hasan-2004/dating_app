"""
Serializers for the Dating App REST API.

Covers every concrete model in the ``users`` app (24 models across
``user_related_models/`` and ``preferred_wife_models/``) plus two custom
serializers that implement the two-step signup flow:

* Step 1 -- :class:`UserRegistrationSerializer` (minimal user creation,
  consumes an active :class:`AccessCode`).
* Step 2 -- :class:`UserCompleteProfileSerializer` (updates the user's own
  profile fields; each detailed profile section has its own CRUD endpoint).

All model serializers use ``fields = '__all__'`` so every field is exposed.
Profile-model serializers mark the ``user`` reverse-FK as read-only and
auto-assign it from ``request.user`` inside the corresponding ViewSet.
"""

from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.translation import gettext_lazy as _

from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed

from phonenumber_field.serializerfields import PhoneNumberField

from multiselectfield import MultiSelectField
from multiselectfield.validators import MaxValueMultiFieldValidator
from rest_framework.fields import to_choices_dict, flatten_choices_dict
from core.utils.validators.shared import validate_active_access_code
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
    UserBookmark,
)
from users.user_related_models.subject_details import SubjectDetails
from users.preferred_wife_models import (
    PreferredWifeExtraInformation,
    PreferredWifePhysicalInformation,
    PreferredWifePersonalInformation,
    PreferredWifeIntellectualInformation,
    FutureSposeOriginality,
)



# ---------------------------------------------------------------------------
# MultiSelect serializer field
# ---------------------------------------------------------------------------


class MultiSelectSerializerField(serializers.Field):
    """
    Dedicated serializer field for django-multiselectfield's MultiSelectField.

    Accepts arrays of choice values (or single string values wrapped into a list),
    validates every item against model choices, eliminates duplicates preserving
    order, and returns comma-separated strings for DB storage.
    to_representation always returns a list of choice keys.
    """

    default_error_messages = {
        "invalid_choice": _('"{input}" is not a valid choice.'),
        "required": _("This field is required."),
        "null": _("This field may not be null."),
    }

    def __init__(self, choices=None, **kwargs):
        self.choices = choices or []
        self._valid_choices = set()
        if self.choices:
            grouped = to_choices_dict(self.choices)
            flattened = flatten_choices_dict(grouped)
            self._valid_choices = {str(k) for k in flattened.keys()}

        self.allow_blank = kwargs.pop("allow_blank", False)
        # Drop max_length because MultiSelectField uses underlying CharField max_length for CSV
        kwargs.pop("max_length", None)
        # Drop custom English model error_messages to preserve standard Persian translations
        kwargs.pop("error_messages", None)

        # Filter out MaxValueMultiFieldValidator from model validators as it misinterprets CSV strings
        if "validators" in kwargs:
            kwargs["validators"] = [
                v
                for v in kwargs["validators"]
                if not isinstance(v, MaxValueMultiFieldValidator)
            ]

        if self.allow_blank and "required" not in kwargs:
            kwargs["required"] = False

        super().__init__(**kwargs)

    def to_internal_value(self, data):
        if data is None:
            raw_items = []
        elif isinstance(data, str):
            data_stripped = data.strip()
            if not data_stripped:
                raw_items = []
            elif "," in data_stripped:
                raw_items = [x.strip() for x in data_stripped.split(",")]
            else:
                raw_items = [data_stripped]
        elif isinstance(data, (list, tuple, set)):
            raw_items = list(data)
        else:
            self.fail("invalid_choice", input=data)

        # Filter out empty placeholders (None, empty strings, pure whitespace)
        items = []
        for x in raw_items:
            if x is None:
                continue
            x_str = str(x).strip()
            if not x_str:
                continue
            items.append(x_str)

        # Handle empty input according to model blank/required constraints
        if not items:
            if not self.allow_blank:
                self.fail("required")
            return ""

        # Validate each item against choices and preserve order without duplicates
        unique_items = []
        seen = set()
        for item in items:
            valid_item = item
            if self._valid_choices and valid_item not in self._valid_choices:
                if valid_item.replace("'", "’") in self._valid_choices:
                    valid_item = valid_item.replace("'", "’")
                elif valid_item.replace("’", "'") in self._valid_choices:
                    valid_item = valid_item.replace("’", "'")
                else:
                    self.fail("invalid_choice", input=item)

            if valid_item not in seen:
                seen.add(valid_item)
                unique_items.append(valid_item)

        return ",".join(unique_items)

    def to_representation(self, value):
        if not value:
            return []
        if isinstance(value, (list, tuple, set)):
            return [str(x) for x in value if x is not None and str(x) != ""]
        if isinstance(value, str):
            return [x.strip() for x in value.split(",") if x.strip()]
        return [str(value)]


# Register MultiSelectField with MultiSelectSerializerField on ModelSerializer
serializers.ModelSerializer.serializer_field_mapping[MultiSelectField] = MultiSelectSerializerField

# ModelSerializer.build_standard_field coerces any model field with choices into
# serializer_choice_field (ChoiceField), ignoring serializer_field_mapping.
# We wrap build_standard_field so MultiSelectField correctly uses MultiSelectSerializerField.
_orig_build_standard_field = serializers.ModelSerializer.build_standard_field


def _build_standard_field(self, field_name, model_field):
    field_class, field_kwargs = _orig_build_standard_field(self, field_name, model_field)
    if isinstance(model_field, MultiSelectField):
        return MultiSelectSerializerField, field_kwargs
    return field_class, field_kwargs


serializers.ModelSerializer.build_standard_field = _build_standard_field


# ---------------------------------------------------------------------------
# Core model serializers
# ---------------------------------------------------------------------------


class AccessCodeSerializer(serializers.ModelSerializer):
    """Serializer for the :class:`AccessCode` model (all fields)."""

    class Meta:
        model = AccessCode
        fields = "__all__"


# Fields exposed to regular users (no sensitive/permission fields).
USER_PUBLIC_FIELDS = (
    "id",
    "username",
    "first_name",
    "last_name",
    "email",
    "phone_number",
    "middle_man_code",
    "date_created",
    "date_joined",
    "is_active",
    "is_staff",
    "is_superuser",
)

# Extra fields exposed only to staff/admin users.
USER_ADMIN_FIELDS = (
    "access_code",
    "groups",
    "user_permissions",
    "last_login",
)


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the custom :class:`User` model.

    Only exposes a safe subset of fields by default. Sensitive / administrative
    fields (``password``, ``groups``, ``user_permissions``, raw ``access_code``)
    are only returned when the current requester is staff.

    ``password`` is write-only and never included in responses.
    """

    access_code = serializers.CharField(
        max_length=50,
        required=False,
        allow_blank=False,
        allow_null=True,
        write_only=True,
    )

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "middle_man_code",
            "access_code",
            "password",
            "date_created",
            "date_joined",
            "is_active",
            "is_staff",
            "is_superuser",
            "groups",
            "user_permissions",
            "last_login",
        )
        read_only_fields = (
            "id",
            "date_created",
            "date_joined",
            "last_login",
            "groups",
            "user_permissions",
        )
        extra_kwargs = {
            "password": {"write_only": True, "required": False},
            "is_active": {"read_only": True},
            "is_staff": {"read_only": True},
            "is_superuser": {"read_only": True},
        }

    def __init__(self, *args, **kwargs):
        # Pop our custom context flag before delegating to DRF.
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        is_staff = bool(
            request
            and (
                getattr(request.user, "is_staff", False)
                or getattr(request.user, "is_superuser", False)
            )
        )
        if is_staff:
            # For staff admins, allow updating is_active, is_staff, is_superuser
            for f in ("is_active", "is_staff", "is_superuser"):
                if f in self.fields:
                    self.fields[f].read_only = False
        else:
            # For non-staff, ensure is_active, is_staff, is_superuser are strictly read-only
            for f in ("is_active", "is_staff", "is_superuser"):
                if f in self.fields:
                    self.fields[f].read_only = True
            # Drop admin-only internal fields entirely for non-staff requesters.
            for field in USER_ADMIN_FIELDS:
                self.fields.pop(field, None)

    def validate_access_code(self, value):
        """
        Validate the access code only when it is being **set or changed**.

        On updates where the value is unchanged the code is already inactive
        (consumed at signup), so validation is skipped. On creation or when a
        new code is supplied the standard :func:`validate_active_access_code`
        check runs.
        """
        if not value:
            return value
        if self.instance and self.instance.access_code == value:
            return value
        try:
            validate_active_access_code(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.messages, code="invalid")
        return value

    def create(self, validated_data):
        """
        Create a user via :meth:`UserManager.create_user` so that password
        hashing, email/username normalisation, and access-code consumption are
        handled consistently with the admin and form paths.
        """
        password = validated_data.pop("password", None)
        access_code = validated_data.pop("access_code", None)
        try:
            user = User.objects.create_user(
                username=validated_data.pop("username"),
                email=validated_data.pop("email", ""),
                access_code=access_code,
                password=password,
                **validated_data,
            )
        except (ValueError, DjangoValidationError) as exc:
            raise serializers.ValidationError(
                exc.messages if hasattr(exc, "messages") else str(exc)
            )
        return user

    def update(self, instance, validated_data):
        """Update a user, hashing the password when it is changed."""
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Self-service profile update serializer (used by ``PATCH /api/auth/me/``).

    A regular user can update their basic profile fields. Password is handled
    via a dedicated field and is write-only. Sensitive fields are read-only.
    """

    old_password = serializers.CharField(
        write_only=True, required=False, style={"input_type": "password"}
    )
    new_password = serializers.CharField(
        write_only=True, required=False, style={"input_type": "password"}
    )

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "middle_man_code",
            "old_password",
            "new_password",
        )
        read_only_fields = ("id",)

    def validate_username(self, value):
        request = self.context.get("request")
        if request and getattr(request.user, "username", None) == value:
            return value
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(_("A user with that username already exists."))
        return value

    def validate_email(self, value):
        if not value:
            return value
        request = self.context.get("request")
        if request and getattr(request.user, "email", None) == value:
            return value
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(_("A user with that email already exists."))
        return value

    def validate_new_password(self, value):
        if value:
            validate_password(value)
        return value

    def validate(self, attrs):
        new_password = attrs.get("new_password")
        old_password = attrs.get("old_password")
        if new_password and not old_password:
            raise serializers.ValidationError(
                {"old_password": _("Current password is required to set a new password.")}
            )
        request = self.context.get("request")
        if new_password and old_password and request:
            user = request.user
            if not user.check_password(old_password):
                raise serializers.ValidationError({"old_password": _("Current password is incorrect.")})
        return attrs

    def update(self, instance, validated_data):
        validated_data.pop("old_password", None)
        new_password = validated_data.pop("new_password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if new_password:
            instance.set_password(new_password)
        instance.save()
        return instance


# ---------------------------------------------------------------------------
# Auth serializers
# ---------------------------------------------------------------------------


class LoginSerializer(serializers.Serializer):
    """
    Validates username + password credentials.

    On ``validate()`` the user is authenticated through Django's
    ``authenticate()`` (ModelBackend). Returns the user instance on success;
    raises ``AuthenticationFailed`` on failure or when the account is inactive.
    """

    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        user = authenticate(
            request=self.context.get("request"),
            username=username,
            password=password,
        )

        if user is None:
            raise AuthenticationFailed(_("Invalid credentials."))
        if not user.is_active:
            raise AuthenticationFailed(_("Account is disabled."))

        attrs["user"] = user
        return attrs


class LogoutSerializer(serializers.Serializer):
    """
    Accepts a refresh token (from cookie or body) and blacklists it.

    When the refresh token is not provided in the request body the view will
    fall back to the ``refresh_token`` cookie.
    """

    refresh = serializers.CharField(required=False, write_only=True)

    def validate(self, attrs):
        refresh = attrs.get("refresh") or self.context.get("refresh")
        if not refresh:
            raise serializers.ValidationError(
                {"refresh": _("Refresh token is required (cookie or body).")}
            )
        attrs["refresh"] = refresh
        return attrs


class LoginResponseSerializer(serializers.Serializer):
    """
    Response payload returned after a successful login.

    Raw JWTs are **not** included: they are delivered exclusively via the
    HTTP-only ``access_token`` / ``refresh_token`` cookies set on the response.
    Only the authenticated user's profile is returned in the body.
    """

    user = UserSerializer(read_only=True)


class MessageSerializer(serializers.Serializer):
    """Generic ``{"detail": ...}`` response payload (refresh / logout)."""

    detail = serializers.CharField(read_only=True)


class RefreshTokenSerializer(serializers.Serializer):
    """
    Optional body input for the refresh endpoint. If absent the refresh token
    is read from the ``refresh_token`` cookie.
    """

    refresh = serializers.CharField(required=False, write_only=True)


# ---------------------------------------------------------------------------
# Two-step signup serializers
# ---------------------------------------------------------------------------


class UserRegistrationSerializer(serializers.Serializer):
    """
    Step 1 of the two-step signup flow.

    Captures the minimal information needed to create a user account:
    ``username``, ``email``, ``phone_number``, ``access_code`` and a
    ``password`` (confirmed via ``password2``). An optional ``middle_man_code``
    is accepted.

    On ``save()`` the user is created through :meth:`UserManager.create_user`,
    which validates and **consumes** the supplied access code.
    """

    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(required=False, allow_blank=True, allow_null=True)
    phone_number = PhoneNumberField(region="IR")
    access_code = serializers.CharField(
        max_length=50, required=False, allow_blank=True, allow_null=True
    )
    password = serializers.CharField(write_only=True, style={"input_type": "password"})
    password2 = serializers.CharField(write_only=True, style={"input_type": "password"})
    middle_man_code = serializers.CharField(
        max_length=100, required=False, allow_blank=True, allow_null=True
    )

    def validate_access_code(self, value):
        """Ensure the access code exists and is still active if provided."""
        if not value:
            return value
        try:
            validate_active_access_code(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.messages, code="invalid")
        return value

    def validate_password(self, value):
        """Run Django's configured password validators."""
        validate_password(value)
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(_("A user with that username already exists."))
        return value

    def validate_email(self, value):
        if not value:
            return value
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(_("A user with that email already exists."))
        return value

    def validate_phone_number(self, value):
        if User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError(_("A user with that phone number already exists."))
        return value

    def validate(self, attrs):
        """Check dynamic requirements based on SiteSetting and ensure passwords match."""
        from core.models import SiteSetting

        site_settings = SiteSetting.get_settings()

        # Check access code requirement
        access_code = attrs.get("access_code")
        if site_settings.require_access_code and not access_code:
            raise serializers.ValidationError(
                {"access_code": [_("This field is required.")]}
            )

        # Check email requirement
        email = attrs.get("email")
        if site_settings.require_email and not email:
            raise serializers.ValidationError(
                {"email": [_("This field is required.")]}
            )

        if attrs.get("password") != attrs.get("password2"):
            raise serializers.ValidationError(
                {"password2": _("The two password fields didn't match.")}
            )
        return attrs

    def create(self, validated_data):
        """Create the user via the custom manager (consumes or auto-generates the access code)."""
        validated_data.pop("password2")
        password = validated_data.pop("password")
        email = validated_data.get("email") or None
        access_code = validated_data.get("access_code") or None

        try:
            user = User.objects.create_user(
                username=validated_data["username"],
                email=email,
                access_code=access_code,
                password=password,
                phone_number=validated_data["phone_number"],
                middle_man_code=validated_data.get("middle_man_code"),
            )
        except (ValueError, DjangoValidationError) as exc:
            raise serializers.ValidationError(
                exc.messages if hasattr(exc, "messages") else str(exc)
            )
        return user

    def update(self, instance, validated_data):
        raise NotImplementedError(
            "UserRegistrationSerializer does not support update."
        )


class UserCompleteProfileSerializer(serializers.ModelSerializer):
    """
    Step 2 of the two-step signup flow.

    Updates the user-level profile fields stored directly on the
    :class:`User` model (``first_name``, ``last_name``, ``middle_man_code``,
    ``phone_number``, ``email``).

    The detailed profile sections (PersonalInformation, PhysicalInformation,
    FamilyInformation, FinancialInformation, IntellectualInformation, etc.)
    each have their own dedicated CRUD endpoints and serializers. Call the
    corresponding URL (e.g. ``/api/personal-information/``) to create or update
    those sections.
    """

    class Meta:
        model = User
        fields = ("first_name", "last_name", "middle_man_code", "phone_number", "email")
        extra_kwargs = {
            "phone_number": {"required": False},
            "email": {"required": False},
        }


# ---------------------------------------------------------------------------
# Confidential / identity information
# ---------------------------------------------------------------------------


class IdentityInformationSerializer(serializers.ModelSerializer):
    """Serializer for :class:`IdentityInformation` (all fields)."""

    class Meta:
        model = IdentityInformation
        fields = "__all__"
        read_only_fields = ("user",)


class BirthCertificateInformationSerializer(serializers.ModelSerializer):
    """Serializer for :class:`BirthCertificateInformation` (all fields)."""

    class Meta:
        model = BirthCertificateInformation
        fields = "__all__"
        read_only_fields = ("user",)


class IntroducedSubjectsInformationSerializer(serializers.ModelSerializer):
    """Serializer for :class:`IntroducedSubjectsInformation` (all fields)."""

    class Meta:
        model = IntroducedSubjectsInformation
        fields = "__all__"
        read_only_fields = ("user",)


# ---------------------------------------------------------------------------
# Personal / physical information
# ---------------------------------------------------------------------------


class PersonalInformationSerializer(serializers.ModelSerializer):
    """Serializer for :class:`PersonalInformation` (all fields)."""

    class Meta:
        model = PersonalInformation
        fields = "__all__"
        read_only_fields = ("user",)


class PhysicalInformationSerializer(serializers.ModelSerializer):
    """Serializer for :class:`PhysicalInformation` (all fields)."""

    class Meta:
        model = PhysicalInformation
        fields = "__all__"
        read_only_fields = ("user",)
        extra_kwargs = {
            "disease_or_surgery": {"required": False},
            "medication_surgery_disease_type": {"required": False, "allow_blank": True, "allow_null": True},
        }

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, "copy") else dict(data)
        # Support alias disease_or_surgery_history
        if "disease_or_surgery" not in data and "disease_or_surgery_history" in data:
            data["disease_or_surgery"] = data["disease_or_surgery_history"]
        if not data.get("disease_or_surgery"):
            data["medication_surgery_disease_type"] = ""
        return super().to_internal_value(data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["disease_or_surgery_history"] = ret.get("disease_or_surgery", False)
        return ret
        extra_kwargs = {
            "disease_or_surgery": {"required": False},
            "medication_surgery_disease_type": {"required": False, "allow_blank": True, "allow_null": True},
        }

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, "copy") else dict(data)
        # Support alias disease_or_surgery_history
        if "disease_or_surgery" not in data and "disease_or_surgery_history" in data:
            data["disease_or_surgery"] = data["disease_or_surgery_history"]
        if not data.get("disease_or_surgery"):
            data["medication_surgery_disease_type"] = ""
        return super().to_internal_value(data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["disease_or_surgery_history"] = ret.get("disease_or_surgery", False)
        return ret


# ---------------------------------------------------------------------------
# Family information
# ---------------------------------------------------------------------------


class FamilyInformationSerializer(serializers.ModelSerializer):
    """Serializer for :class:`FamilyInformation` (all fields)."""

    class Meta:
        model = FamilyInformation
        fields = "__all__"
        read_only_fields = ("user",)


class EngagementOrWeddingStatusSerializer(serializers.ModelSerializer):
    """Serializer for :class:`EngagementOrWeddingStatus` (all fields)."""

    class Meta:
        model = EngagementOrWeddingStatus
        fields = "__all__"
        read_only_fields = ("user",)
        extra_kwargs = {
            "contract_length": {"required": False, "allow_blank": True, "allow_null": True},
            "living_length": {"required": False, "allow_blank": True, "allow_null": True},
            "death_date": {"required": False, "allow_null": True},
            "divorce_date": {"required": False, "allow_null": True},
            "reason_for_divorce_or_death": {"required": False, "allow_blank": True, "allow_null": True},
        }

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, "copy") else dict(data)
        st = data.get("status")
        # If status is None (بدون سابقه), clear all child fields safely
        if st in ("None", ["None"], ["none"], "none"):
            data["contract_length"] = ""
            data["living_length"] = ""
            data["death_date"] = None
            data["divorce_date"] = None
            data["reason_for_divorce_or_death"] = ""
        return super().to_internal_value(data)
        extra_kwargs = {
            "contract_length": {"required": False, "allow_blank": True, "allow_null": True},
            "living_length": {"required": False, "allow_blank": True, "allow_null": True},
            "death_date": {"required": False, "allow_null": True},
            "divorce_date": {"required": False, "allow_null": True},
            "reason_for_divorce_or_death": {"required": False, "allow_blank": True, "allow_null": True},
        }

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, "copy") else dict(data)
        st = data.get("status")
        # If status is None (بدون سابقه), clear all child fields safely
        if st in ("None", ["None"], ["none"], "none"):
            data["contract_length"] = ""
            data["living_length"] = ""
            data["death_date"] = None
            data["divorce_date"] = None
            data["reason_for_divorce_or_death"] = ""
        return super().to_internal_value(data)


class ExHusbandChildStatusSerializer(serializers.ModelSerializer):
    """Serializer for :class:`ExHusbandChildStatus` (all fields)."""

    class Meta:
        model = ExHusbandChildStatus
        fields = "__all__"
        read_only_fields = ("user",)


class SisterSerializer(serializers.ModelSerializer):
    """Serializer for :class:`Sister` (all fields)."""

    class Meta:
        model = Sister
        fields = "__all__"
        read_only_fields = ("user",)


class BrotherSerializer(serializers.ModelSerializer):
    """Serializer for :class:`Brother` (all fields)."""

    class Meta:
        model = Brother
        fields = "__all__"
        read_only_fields = ("user",)


class GroomSerializer(serializers.ModelSerializer):
    """Serializer for :class:`Groom` (all fields)."""

    class Meta:
        model = Groom
        fields = "__all__"
        read_only_fields = ("user",)


class BrideOrWifeSerializer(serializers.ModelSerializer):
    """Serializer for :class:`BrideOrWife` (all fields)."""

    class Meta:
        model = BrideOrWife
        fields = "__all__"
        read_only_fields = ("user",)


class MotherSerializer(serializers.ModelSerializer):
    """Serializer for :class:`Mother` (all fields)."""

    class Meta:
        model = Mother
        fields = "__all__"
        read_only_fields = ("user",)


class FatherSerializer(serializers.ModelSerializer):
    """Serializer for :class:`Father` (all fields)."""

    class Meta:
        model = Father
        fields = "__all__"
        read_only_fields = ("user",)


# ---------------------------------------------------------------------------
# Financial / intellectual information
# ---------------------------------------------------------------------------


class FinancialInformationSerializer(serializers.ModelSerializer):
    """Serializer for :class:`FinancialInformation` (all fields)."""

    class Meta:
        model = FinancialInformation
        fields = "__all__"
        read_only_fields = ("user",)
        extra_kwargs = {
            "dowry_amount": {"required": False, "allow_blank": True, "allow_null": True},
            "other_captial": {"required": False, "allow_blank": True, "allow_null": True},
            "ex_spouse_financial_amount": {"required": False, "allow_blank": True, "allow_null": True},
            "mortgage_amount": {"required": False, "allow_blank": True, "allow_null": True},
            "rent_amount": {"required": False, "allow_blank": True, "allow_null": True},
            "jahiziyeh": {"required": False, "allow_blank": True, "allow_null": True},
            "jahiziyeh_explantion": {"required": False, "allow_blank": True, "allow_null": True},
        }

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, "copy") else dict(data)
        # Convert integer or numeric amounts to string (limit 50 chars) to prevent type errors
        for key in ("dowry_amount", "future_spose_dowry_amount", "ex_spouse_financial_amount", "mortgage_amount", "rent_amount"):
            if key in data and data[key] is not None:
                data[key] = str(data[key])[:50]

        # Aliases mapping
        if "other_captial" not in data and "other_capital" in data:
            data["other_captial"] = data["other_capital"]
        if "dowry_amount" not in data and "future_spose_dowry_amount" in data:
            data["dowry_amount"] = data["future_spose_dowry_amount"]
        if "dowry_type" not in data and "future_spouse_dowry_type" in data:
            data["dowry_type"] = data["future_spouse_dowry_type"]
        if "jahiziyeh" not in data and "future_spose_jahiziyeh" in data:
            data["jahiziyeh"] = data["future_spose_jahiziyeh"]
        if "jahiziyeh_explantion" not in data and "future_spose_jahiziyeh_explanation" in data:
            data["jahiziyeh_explantion"] = data["future_spose_jahiziyeh_explanation"]
        return super().to_internal_value(data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Expose both canonical and alias names for reliable frontend display
        ret["other_capital"] = ret.get("other_captial")
        ret["future_spose_dowry_amount"] = ret.get("dowry_amount")
        ret["future_spouse_dowry_type"] = ret.get("dowry_type")
        ret["future_spose_jahiziyeh"] = ret.get("jahiziyeh")
        ret["future_spose_jahiziyeh_explanation"] = ret.get("jahiziyeh_explantion")
        return ret
        extra_kwargs = {
            "dowry_amount": {"required": False, "allow_blank": True, "allow_null": True},
            "other_captial": {"required": False, "allow_blank": True, "allow_null": True},
            "ex_spouse_financial_amount": {"required": False, "allow_blank": True, "allow_null": True},
            "mortgage_amount": {"required": False, "allow_blank": True, "allow_null": True},
            "rent_amount": {"required": False, "allow_blank": True, "allow_null": True},
            "jahiziyeh": {"required": False, "allow_blank": True, "allow_null": True},
            "jahiziyeh_explantion": {"required": False, "allow_blank": True, "allow_null": True},
        }

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, "copy") else dict(data)
        # Convert integer or numeric amounts to string (limit 50 chars) to prevent type errors
        for key in ("dowry_amount", "future_spose_dowry_amount", "ex_spouse_financial_amount", "mortgage_amount", "rent_amount"):
            if key in data and data[key] is not None:
                data[key] = str(data[key])[:50]

        # Aliases mapping
        if "other_captial" not in data and "other_capital" in data:
            data["other_captial"] = data["other_capital"]
        if "dowry_amount" not in data and "future_spose_dowry_amount" in data:
            data["dowry_amount"] = data["future_spose_dowry_amount"]
        if "dowry_type" not in data and "future_spouse_dowry_type" in data:
            data["dowry_type"] = data["future_spouse_dowry_type"]
        if "jahiziyeh" not in data and "future_spose_jahiziyeh" in data:
            data["jahiziyeh"] = data["future_spose_jahiziyeh"]
        if "jahiziyeh_explantion" not in data and "future_spose_jahiziyeh_explanation" in data:
            data["jahiziyeh_explantion"] = data["future_spose_jahiziyeh_explanation"]
        return super().to_internal_value(data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Expose both canonical and alias names for reliable frontend display
        ret["other_capital"] = ret.get("other_captial")
        ret["future_spose_dowry_amount"] = ret.get("dowry_amount")
        ret["future_spouse_dowry_type"] = ret.get("dowry_type")
        ret["future_spose_jahiziyeh"] = ret.get("jahiziyeh")
        ret["future_spose_jahiziyeh_explanation"] = ret.get("jahiziyeh_explantion")
        return ret


class IntellectualInformationSerializer(serializers.ModelSerializer):
    """Serializer for :class:`IntellectualInformation` (all fields)."""

    class Meta:
        model = IntellectualInformation
        fields = "__all__"
        read_only_fields = ("user",)
        extra_kwargs = {
            "pros_of_yourself": {"required": False, "allow_blank": True, "allow_null": True},
            "cons_of_yourself": {"required": False, "allow_blank": True, "allow_null": True},
            "type_connection_friends": {"required": False, "allow_blank": True, "allow_null": True},
            "friends_connection_reason": {"required": False, "allow_blank": True, "allow_null": True},
            "political_orientation": {"required": False},
            "contract_how": {"required": False},
            "wedding_how": {"required": False},
            "opinion_child_quantity": {"required": False},
            "opinion_innocent_contact": {"required": False},
            "cover_type_house": {"required": False},
            "cover_type_society": {"required": False},
            "cover_type_innocent_contact": {"required": False},
            "decision_making_choosing_spouse": {"required": False},
        }

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, "copy") else dict(data)
        # Alias opinion_about_child_quantity -> opinion_child_quantity
        if "opinion_child_quantity" not in data and "opinion_about_child_quantity" in data:
            data["opinion_child_quantity"] = data["opinion_about_child_quantity"]
        if "opinion_about_velayat_faqih" in data and "opinion_velayat_faqih" not in data:
            data["opinion_velayat_faqih"] = data["opinion_about_velayat_faqih"]
        return super().to_internal_value(data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["opinion_about_child_quantity"] = ret.get("opinion_child_quantity")
        ret["opinion_about_velayat_faqih"] = ret.get("opinion_velayat_faqih")
        return ret
        extra_kwargs = {
            "pros_of_yourself": {"required": False, "allow_blank": True, "allow_null": True},
            "cons_of_yourself": {"required": False, "allow_blank": True, "allow_null": True},
            "type_connection_friends": {"required": False, "allow_blank": True, "allow_null": True},
            "friends_connection_reason": {"required": False, "allow_blank": True, "allow_null": True},
            "political_orientation": {"required": False},
            "contract_how": {"required": False},
            "wedding_how": {"required": False},
            "opinion_child_quantity": {"required": False},
            "opinion_innocent_contact": {"required": False},
            "cover_type_house": {"required": False},
            "cover_type_society": {"required": False},
            "cover_type_innocent_contact": {"required": False},
            "decision_making_choosing_spouse": {"required": False},
        }

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, "copy") else dict(data)
        # Alias opinion_about_child_quantity -> opinion_child_quantity
        if "opinion_child_quantity" not in data and "opinion_about_child_quantity" in data:
            data["opinion_child_quantity"] = data["opinion_about_child_quantity"]
        if "opinion_about_velayat_faqih" in data and "opinion_velayat_faqih" not in data:
            data["opinion_velayat_faqih"] = data["opinion_about_velayat_faqih"]
        return super().to_internal_value(data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["opinion_about_child_quantity"] = ret.get("opinion_child_quantity")
        ret["opinion_about_velayat_faqih"] = ret.get("opinion_velayat_faqih")
        return ret


# ---------------------------------------------------------------------------
# Subject details
# ---------------------------------------------------------------------------


class SubjectDetailsSerializer(serializers.ModelSerializer):
    """Serializer for :class:`SubjectDetails` (all fields)."""

    class Meta:
        model = SubjectDetails
        fields = "__all__"
        read_only_fields = ("user",)


# ---------------------------------------------------------------------------
# Preferred-wife models
# ---------------------------------------------------------------------------


class PreferredWifePersonalInformationSerializer(serializers.ModelSerializer):
    """Serializer for :class:`PreferredWifePersonalInformation` (all fields)."""

    class Meta:
        model = PreferredWifePersonalInformation
        fields = "__all__"
        read_only_fields = ("user",)
        extra_kwargs = {
            "education": {"required": False, "allow_blank": True, "allow_null": True},
            "field_of_study": {"required": False, "allow_blank": True, "allow_null": True},
            "current_residence_location": {"required": False, "allow_blank": True, "allow_null": True},
            "after_marriage_residence_location": {"required": False},
            "future_spouse_job": {"required": False},
        }

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, "copy") else dict(data)
        if "education" not in data and "education_level" in data:
            data["education"] = data["education_level"]
        return super().to_internal_value(data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["education_level"] = ret.get("education")
        return ret
        extra_kwargs = {
            "education": {"required": False, "allow_blank": True, "allow_null": True},
            "field_of_study": {"required": False, "allow_blank": True, "allow_null": True},
            "current_residence_location": {"required": False, "allow_blank": True, "allow_null": True},
            "after_marriage_residence_location": {"required": False},
            "future_spouse_job": {"required": False},
        }

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, "copy") else dict(data)
        if "education" not in data and "education_level" in data:
            data["education"] = data["education_level"]
        return super().to_internal_value(data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["education_level"] = ret.get("education")
        return ret


class PreferredWifePhysicalInformationSerializer(serializers.ModelSerializer):
    """Serializer for :class:`PreferredWifePhysicalInformation` (all fields)."""

    height_min = serializers.FloatField(required=False, write_only=True, allow_null=True)
    height_max = serializers.FloatField(required=False, write_only=True, allow_null=True)
    weight_min = serializers.FloatField(required=False, write_only=True, allow_null=True)
    weight_max = serializers.FloatField(required=False, write_only=True, allow_null=True)

    class Meta:
        model = PreferredWifePhysicalInformation
        fields = "__all__"
        read_only_fields = ("user",)
        extra_kwargs = {
            "height": {"required": False, "allow_null": True},
            "weight": {"required": False, "allow_null": True},
            "skin_color": {"required": False},
        }

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, "copy") else dict(data)
        # Compute height if not provided
        if not data.get("height"):
            h_min = data.get("height_min")
            h_max = data.get("height_max")
            if h_min and h_max:
                try:
                    data["height"] = round((float(h_min) + float(h_max)) / 2.0, 1)
                except (ValueError, TypeError):
                    pass
            elif h_min:
                try:
                    data["height"] = float(h_min)
                except (ValueError, TypeError):
                    pass
            elif h_max:
                try:
                    data["height"] = float(h_max)
                except (ValueError, TypeError):
                    pass
            else:
                data["height"] = 165.0

        # Compute weight if not provided
        if not data.get("weight"):
            w_min = data.get("weight_min")
            w_max = data.get("weight_max")
            if w_min and w_max:
                try:
                    data["weight"] = round((float(w_min) + float(w_max)) / 2.0, 1)
                except (ValueError, TypeError):
                    pass
            elif w_min:
                try:
                    data["weight"] = float(w_min)
                except (ValueError, TypeError):
                    pass
            elif w_max:
                try:
                    data["weight"] = float(w_max)
                except (ValueError, TypeError):
                    pass
            else:
                data["weight"] = 60.0

        return super().to_internal_value(data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        h = ret.get("height")
        w = ret.get("weight")
        ret["height_min"] = h
        ret["height_max"] = h
        ret["weight_min"] = w
        ret["weight_max"] = w
        return ret


class PreferredWifeIntellectualInformationSerializer(serializers.ModelSerializer):
    """Serializer for :class:`PreferredWifeIntellectualInformation` (all fields)."""

    class Meta:
        model = PreferredWifeIntellectualInformation
        fields = "__all__"
        read_only_fields = ("user",)
        extra_kwargs = {
            "future_spouse_family_religious_status_importance": {"required": False, "allow_blank": True, "allow_null": True},
            "future_spouse_family_financial_status_importance": {"required": False, "allow_blank": True, "allow_null": True},
            "most_important_moral_feature_of_future_spouse": {"required": False, "allow_blank": True, "allow_null": True},
            "marriage_with_disabled": {"required": False, "allow_blank": True, "allow_null": True},
            "marriage_with_veteran": {"required": False, "allow_blank": True, "allow_null": True},
            "additional_explnation_marriage_with_someone": {"required": False, "allow_blank": True, "allow_null": True},
            "marriage_with_veteran_disabled_explanation": {"required": False, "allow_blank": True, "allow_null": True},
            "appearance_type": {"required": False},
            "age_difference": {"required": False},
            "marriage_with_someone_with_marriage_experience": {"required": False},
            "red_flags": {"required": False, "allow_blank": True, "allow_null": True},
        }

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, "copy") else dict(data)
        # Normalize importance choices (case-insensitive / alias mapping)
        importance_map = {
            "too_much": "Too Much", "too much": "Too Much",
            "much": "Much",
            "any": "Any", "average": "Any", "avg": "Any",
            "low": "Low",
            "doesnt_matter": "Doesn't Matter", "doesn't matter": "Doesn't Matter",
        }
        for k in ("future_spouse_family_religious_status_importance", "future_spouse_family_financial_status_importance"):
            if k in data and data[k]:
                v = str(data[k]).strip().lower()
                if v in importance_map:
                    data[k] = importance_map[v]

        # Disabled and veteran choices normalization
        dv_map = {"yes": "Yes", "no": "No", "depends": "Depends"}
        if "marriage_with_disabled" not in data and "marriage_with_disabled_person" in data:
            data["marriage_with_disabled"] = data["marriage_with_disabled_person"]
        if "marriage_with_veteran" not in data and "marriage_with_veteran_person" in data:
            data["marriage_with_veteran"] = data["marriage_with_veteran_person"]

        if "marriage_with_disabled" in data and data["marriage_with_disabled"]:
            v = str(data["marriage_with_disabled"]).strip().lower()
            if v in dv_map:
                data["marriage_with_disabled"] = dv_map[v]

        if "marriage_with_veteran" in data and data["marriage_with_veteran"]:
            v = str(data["marriage_with_veteran"]).strip().lower()
            if v in dv_map:
                data["marriage_with_veteran"] = dv_map[v]

        # Field alias mapping
        if "most_important_moral_feature_of_future_spouse" not in data and "most_important_moral_feature" in data:
            data["most_important_moral_feature_of_future_spouse"] = data["most_important_moral_feature"]
        if "additional_explnation_marriage_with_someone" not in data and "marriage_with_someone_explanation" in data:
            data["additional_explnation_marriage_with_someone"] = data["marriage_with_someone_explanation"]
        if "marriage_with_veteran_disabled_explanation" not in data and "marriage_disabled_veteran_explanation" in data:
            data["marriage_with_veteran_disabled_explanation"] = data["marriage_disabled_veteran_explanation"]

        return super().to_internal_value(data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["most_important_moral_feature"] = ret.get("most_important_moral_feature_of_future_spouse")
        ret["marriage_with_disabled_person"] = ret.get("marriage_with_disabled")
        ret["marriage_with_veteran_person"] = ret.get("marriage_with_veteran")
        ret["marriage_with_someone_explanation"] = ret.get("additional_explnation_marriage_with_someone")
        ret["marriage_disabled_veteran_explanation"] = ret.get("marriage_with_veteran_disabled_explanation")
        return ret
        extra_kwargs = {
            "future_spouse_family_religious_status_importance": {"required": False, "allow_blank": True, "allow_null": True},
            "future_spouse_family_financial_status_importance": {"required": False, "allow_blank": True, "allow_null": True},
            "most_important_moral_feature_of_future_spouse": {"required": False, "allow_blank": True, "allow_null": True},
            "marriage_with_disabled": {"required": False, "allow_blank": True, "allow_null": True},
            "marriage_with_veteran": {"required": False, "allow_blank": True, "allow_null": True},
            "additional_explnation_marriage_with_someone": {"required": False, "allow_blank": True, "allow_null": True},
            "marriage_with_veteran_disabled_explanation": {"required": False, "allow_blank": True, "allow_null": True},
            "appearance_type": {"required": False},
            "age_difference": {"required": False},
            "marriage_with_someone_with_marriage_experience": {"required": False},
            "red_flags": {"required": False, "allow_blank": True, "allow_null": True},
        }

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, "copy") else dict(data)
        # Normalize importance choices (case-insensitive / alias mapping)
        importance_map = {
            "too_much": "Too Much", "too much": "Too Much",
            "much": "Much",
            "any": "Any", "average": "Any", "avg": "Any",
            "low": "Low",
            "doesnt_matter": "Doesn't Matter", "doesn't matter": "Doesn't Matter",
        }
        for k in ("future_spouse_family_religious_status_importance", "future_spouse_family_financial_status_importance"):
            if k in data and data[k]:
                v = str(data[k]).strip().lower()
                if v in importance_map:
                    data[k] = importance_map[v]

        # Disabled and veteran choices normalization
        dv_map = {"yes": "Yes", "no": "No", "depends": "Depends"}
        if "marriage_with_disabled" not in data and "marriage_with_disabled_person" in data:
            data["marriage_with_disabled"] = data["marriage_with_disabled_person"]
        if "marriage_with_veteran" not in data and "marriage_with_veteran_person" in data:
            data["marriage_with_veteran"] = data["marriage_with_veteran_person"]

        if "marriage_with_disabled" in data and data["marriage_with_disabled"]:
            v = str(data["marriage_with_disabled"]).strip().lower()
            if v in dv_map:
                data["marriage_with_disabled"] = dv_map[v]

        if "marriage_with_veteran" in data and data["marriage_with_veteran"]:
            v = str(data["marriage_with_veteran"]).strip().lower()
            if v in dv_map:
                data["marriage_with_veteran"] = dv_map[v]

        # Field alias mapping
        if "most_important_moral_feature_of_future_spouse" not in data and "most_important_moral_feature" in data:
            data["most_important_moral_feature_of_future_spouse"] = data["most_important_moral_feature"]
        if "additional_explnation_marriage_with_someone" not in data and "marriage_with_someone_explanation" in data:
            data["additional_explnation_marriage_with_someone"] = data["marriage_with_someone_explanation"]
        if "marriage_with_veteran_disabled_explanation" not in data and "marriage_disabled_veteran_explanation" in data:
            data["marriage_with_veteran_disabled_explanation"] = data["marriage_disabled_veteran_explanation"]

        return super().to_internal_value(data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["most_important_moral_feature"] = ret.get("most_important_moral_feature_of_future_spouse")
        ret["marriage_with_disabled_person"] = ret.get("marriage_with_disabled")
        ret["marriage_with_veteran_person"] = ret.get("marriage_with_veteran")
        ret["marriage_with_someone_explanation"] = ret.get("additional_explnation_marriage_with_someone")
        ret["marriage_disabled_veteran_explanation"] = ret.get("marriage_with_veteran_disabled_explanation")
        return ret


class FutureSposeOriginalitySerializer(serializers.ModelSerializer):
    """Serializer for :class:`FutureSposeOriginality` (all fields)."""

    class Meta:
        model = FutureSposeOriginality
        fields = "__all__"
        read_only_fields = ("user",)


class PreferredWifeExtraInformationSerializer(serializers.ModelSerializer):
    """Serializer for :class:`PreferredWifeExtraInformation` (all fields)."""

    class Meta:
        model = PreferredWifeExtraInformation
        fields = "__all__"
        read_only_fields = ("user",)


class UserBookmarkSerializer(serializers.ModelSerializer):
    """Serializer for UserBookmark with full candidate details."""
    user_username = serializers.CharField(source="user.username", read_only=True)
    bookmarked_username = serializers.CharField(source="bookmarked_user.username", read_only=True)
    bookmarked_user_id = serializers.UUIDField(source="bookmarked_user.id", read_only=True)
    candidate_profile = serializers.SerializerMethodField()

    class Meta:
        model = UserBookmark
        fields = (
            "id",
            "user",
            "user_username",
            "bookmarked_user",
            "bookmarked_user_id",
            "bookmarked_username",
            "candidate_profile",
            "created_at",
        )
        read_only_fields = ("user", "created_at")

    def get_candidate_profile(self, obj):
        u = obj.bookmarked_user
        pers = getattr(u, "personal_information", None)
        phys = getattr(u, "physical_information", None)
        birth = getattr(u, "birth_certificate_information", None)
        fin = getattr(u, "financial_information", None)

        age = None
        if pers and pers.birth_date:
            from django.utils import timezone
            today = timezone.now().date()
            bdate = pers.birth_date
            age = today.year - bdate.year - ((today.month, today.day) < (bdate.month, bdate.day))

        return {
            "id": str(u.id),
            "username": u.username,
            "email": u.email,
            "first_name": u.first_name,
            "last_name": u.last_name,
            "gender": (pers.gender[0] if isinstance(pers.gender, (list, tuple)) and pers.gender else (str(pers.gender) if pers and pers.gender else "unknown")),
            "birth_location": pers.birth_location if pers else None,
            "province": pers.birth_location if pers else None,
            "education": pers.education if pers else None,
            "educationLevel": pers.education if pers else None,
            "degree": pers.degree if pers else None,
            "age": age,
            "job": fin.job if fin else None,
            "height": phys.height if phys else None,
            "weight": phys.weight if phys else None,
            "skin_color": phys.skin_color if phys else None,
            "marriage_experience": birth.marriage_experince if birth else None,
            "maritalExperience": birth.marriage_experince if birth else None,
            "ownership_status": fin.ownership_status if fin else None,
            "is_active": u.is_active,
            "is_bookmarked": True,
            "isBookmarked": True,
            "bookmark_id": obj.id,
            "created_at": obj.created_at.isoformat() if obj.created_at else None,
        }


class CalendarEventSerializer(serializers.ModelSerializer):
    """Serializer for user Calendar Events."""

    user_username = serializers.CharField(source="user.username", read_only=True)
    created_by_username = serializers.CharField(
        source="created_by.username", read_only=True
    )

    class Meta:
        from users.user_related_models import CalendarEvent

        model = CalendarEvent
        fields = (
            "id",
            "user",
            "user_username",
            "created_by",
            "created_by_username",
            "is_admin_created",
            "title",
            "description",
            "start_date",
            "end_date",
            "category",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "created_by",
            "created_by_username",
            "is_admin_created",
            "created_at",
            "updated_at",
        )

