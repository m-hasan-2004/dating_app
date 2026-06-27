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

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.translation import gettext_lazy as _

from rest_framework import serializers

from phonenumber_field.serializerfields import PhoneNumberField

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
# Core model serializers
# ---------------------------------------------------------------------------


class AccessCodeSerializer(serializers.ModelSerializer):
    """Serializer for the :class:`AccessCode` model (all fields)."""

    class Meta:
        model = AccessCode
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the custom :class:`User` model.

    Includes **all** model fields. ``password`` is write-only so the hash is
    never exposed. ``access_code`` is overridden as a plain ``CharField`` (with
    ``required=False``) so that the model-level validators
    (:func:`validate_active_access_code`, ``UserValidator.validate_access_code``)
    do **not** fire on every update -- they would fail because the code is
    already consumed. Custom conditional validation is performed in
    :meth:`validate_access_code`.
    """

    access_code = serializers.CharField(
        max_length=50,
        required=False,
        allow_blank=False,
        allow_null=True,
    )

    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {
            "password": {"write_only": True, "required": False},
        }

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
    email = serializers.EmailField()
    phone_number = PhoneNumberField(region="IR")
    access_code = serializers.CharField(max_length=50)
    password = serializers.CharField(write_only=True, style={"input_type": "password"})
    password2 = serializers.CharField(write_only=True, style={"input_type": "password"})
    middle_man_code = serializers.CharField(
        max_length=100, required=False, allow_blank=True, allow_null=True
    )

    def validate_access_code(self, value):
        """Ensure the access code exists and is still active."""
        try:
            validate_active_access_code(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.messages, code="invalid")
        return value

    def validate_password(self, value):
        """Run Django's configured password validators."""
        validate_password(value)
        return value

    def validate(self, attrs):
        """Ensure the two password fields match."""
        if attrs.get("password") != attrs.get("password2"):
            raise serializers.ValidationError(
                {"password2": _("The two password fields didn't match.")}
            )
        return attrs

    def create(self, validated_data):
        """Create the user via the custom manager (consumes the access code)."""
        validated_data.pop("password2")
        password = validated_data.pop("password")
        try:
            user = User.objects.create_user(
                username=validated_data["username"],
                email=validated_data["email"],
                access_code=validated_data["access_code"],
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


class IntellectualInformationSerializer(serializers.ModelSerializer):
    """Serializer for :class:`IntellectualInformation` (all fields)."""

    class Meta:
        model = IntellectualInformation
        fields = "__all__"
        read_only_fields = ("user",)


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


class PreferredWifePhysicalInformationSerializer(serializers.ModelSerializer):
    """Serializer for :class:`PreferredWifePhysicalInformation` (all fields)."""

    class Meta:
        model = PreferredWifePhysicalInformation
        fields = "__all__"
        read_only_fields = ("user",)


class PreferredWifeIntellectualInformationSerializer(serializers.ModelSerializer):
    """Serializer for :class:`PreferredWifeIntellectualInformation` (all fields)."""

    class Meta:
        model = PreferredWifeIntellectualInformation
        fields = "__all__"
        read_only_fields = ("user",)


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
