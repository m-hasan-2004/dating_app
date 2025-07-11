from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth import admin as auth_admin

# Unregister the Group model to hide the Authentication and Authorization section
admin.site.unregister(Group)
from django.utils.translation import gettext_lazy as _
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
from .forms import CustomUserChangeForm, CustomUserCreationForm
from users.preferred_wife_models import (
    PreferredWifeExtraInformation,
    PreferredWifePhysicalInformation,
    PreferredWifePersonalInformation,
    PreferredWifeIntellectualInformation,
    FutureSposeOriginality,
)
from jalali_date.admin import StackedInlineJalaliMixin
from django_admin_multi_select_filter.filters import MultiSelectFieldListFilter
from jalali_date import date2jalali
from users.user_related_models.subject_details import SubjectDetails

class IdentityInfoInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = IdentityInformation
    fk_name = "user"
    extra = 1
    classes = ('collapse',)  # Makes the section collapsible
    


class BirthCertificateInfoInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = BirthCertificateInformation
    extra = 1
    classes = ('collapse',)  # Makes the section collapsible


class IntroducedSubjectsInformationInline(
    StackedInlineJalaliMixin, admin.StackedInline
):
    model = IntroducedSubjectsInformation
    fk_name = "user"
    extra = 1
    classes = ('collapse',)  # Makes the section collapsible


class PersonalInfoInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = PersonalInformation
    fk_name = "user"
    extra = 1
    classes = ('collapse',)  # Makes the section collapsible


class PhysicalInfoInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = PhysicalInformation
    fk_name = "user"
    extra = 1
    classes = ('collapse',)  # Makes the section collapsible


class FamilyInfoInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = FamilyInformation
    fk_name = "user"
    extra = 1
    classes = ('collapse',)  # Makes the section collapsible


class EngagementOrWeddingStatusInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = EngagementOrWeddingStatus
    fk_name = "user"
    extra = 1
    classes = ('collapse',)  # Makes the section collapsible


class ExHusbandChildStatusInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = ExHusbandChildStatus
    fk_name = "user"
    extra = 1
    classes = ('collapse',)  # Makes the section collapsible


class SisterInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = Sister
    fk_name = "user"
    extra = 1
    classes = ('collapse',)  # Makes the section collapsible


class BrotherInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = Brother
    fk_name = "user"
    extra = 1
    classes = ('collapse',)  # Makes the section collapsible


class GroomInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = Groom
    fk_name = "user"
    extra = 1
    classes = ('collapse',)  # Makes the section collapsible


class BrideOrWifeInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = BrideOrWife
    fk_name = "user"
    extra = 1
    classes = ('collapse',)  # Makes the section collapsible


class MotherInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = Mother
    fk_name = "user"
    extra = 1
    classes = ('collapse',)  # Makes the section collapsible


class FatherInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = Father
    fk_name = "user"
    extra = 1
    classes = ('collapse',)  # Makes the section collapsible


class FinancialInfoInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = FinancialInformation
    fk_name = "user"
    extra = 1
    classes = ('collapse',)  # Makes the section collapsible


class IntellectualInfoInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = IntellectualInformation
    fk_name = "user"
    extra = 1
    classes = ('collapse',)  # Makes the section collapsible


class PreferredWifeIntellectualInformationInLine(
    StackedInlineJalaliMixin, admin.StackedInline
):
    model = PreferredWifeIntellectualInformation
    fk_name = "user"
    extra = 1
    classes = ('collapse',)  # Makes the section collapsible


class FutureSposeOriginalityInLine(StackedInlineJalaliMixin, admin.StackedInline):
    model = FutureSposeOriginality
    fk_name = "user"
    extra = 5
    max_num = 5
    classes = ('collapse',)  # Makes the section collapsible


class PreferredWifePersonalInformationInLine(
    StackedInlineJalaliMixin, admin.StackedInline
):
    model = PreferredWifePersonalInformation
    fk_name = "user"
    extra = 1
    classes = ('collapse',)  # Makes the section collapsible


class PreferredWifePhysicalInformationInLine(
    StackedInlineJalaliMixin, admin.StackedInline
):
    model = PreferredWifePhysicalInformation
    fk_name = "user"
    extra = 1
    classes = ('collapse',)  # Makes the section collapsible


class PreferredWifeExtraInformationInLine(
    StackedInlineJalaliMixin, admin.StackedInline
):
    model = PreferredWifeExtraInformation
    fk_name = "user"
    extra = 1
    classes = ('collapse',)  # Makes the section collapsible


class SubjectDetailsInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = SubjectDetails
    fk_name = "user"
    extra = 1
    fields = (
        'preferred_date_times',
        'signup_fee_type',
        'account_number',
        'bank',
        'gender_target',
        'amount',
        'professional_opinion',
    )
    classes = ('collapse',)  # Makes the section collapsible


class UserAdmin(auth_admin.UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User
    list_display = (
        "username",
        "email",
        "date_joined",
        "is_active",
        "is_staff",
        "get_birth_date",
    )
    list_filter = (
        ("is_active", MultiSelectFieldListFilter),
        ("personalinformation__gender", MultiSelectFieldListFilter),
        ("father__originality", MultiSelectFieldListFilter),
        ("mother__originality", MultiSelectFieldListFilter),
        ("personalinformation__income", MultiSelectFieldListFilter),
        "personalinformation__have_insurance",
        ("personalinformation__birth_date", MultiSelectFieldListFilter),
        ("financialinformation__capital", MultiSelectFieldListFilter),
        ("financialinformation__dowry_type", MultiSelectFieldListFilter),
        ("physicalinformation__disease_or_surgery", MultiSelectFieldListFilter),
        ("personalinformation__education", MultiSelectFieldListFilter),
        ("financialinformation__current_residence_status", MultiSelectFieldListFilter),
        ("intellectual_info__worship_prayer", MultiSelectFieldListFilter),
        ("intellectual_info__fasting", MultiSelectFieldListFilter),
        "intellectual_info__opinion_velayat_faqih",
        ("intellectual_info__cover_type_society", MultiSelectFieldListFilter),
        (
            "preferred_wife_intellectual_information__marriage_with_someone_with_marriage_experience",
            MultiSelectFieldListFilter,
        ),
        ("financialinformation__job", MultiSelectFieldListFilter),
        ("physicalinformation__height", MultiSelectFieldListFilter),
        ("physicalinformation__weight", MultiSelectFieldListFilter),
    )
    search_fields = (
        "username",
        "email",
        "phone_number",
    )
    ordering = ("date_joined",)
    actions = ["deactivate_users", "reactivate_users"]
    inlines = [
        # BirthCertificateInfoInline,
        # IdentityInfoInline,
        PersonalInfoInline,
        PhysicalInfoInline,
        FamilyInfoInline,
        EngagementOrWeddingStatusInline,
        ExHusbandChildStatusInline,
        SisterInline,
        BrotherInline,
        GroomInline,
        BrideOrWifeInline,
        MotherInline,
        FatherInline,
        FinancialInfoInline,
        IntellectualInfoInline,
        PreferredWifeIntellectualInformationInLine,
        FutureSposeOriginalityInLine,
        PreferredWifePersonalInformationInLine,
        PreferredWifePhysicalInformationInLine,
        PreferredWifeExtraInformationInLine,
        IntroducedSubjectsInformationInline,
        SubjectDetailsInline,
    ]

    save_on_top = True

    fieldsets = (
        (_("Login Info"), {"fields": ("username", "password", "access_code"), "classes": ('collapse',)}),
        (_("Personal info"), {"fields": ("email", "phone_number"), "classes": ('collapse',)}),
        (
            _("Permissions"),
            {"fields": ("is_active", "is_staff", "is_superuser", "groups"), "classes": ('collapse',)},
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined"), "classes": ('collapse',)}),
        (_("Extra Fields"), {"fields": ("middle_man_code",), "classes": ('collapse',)}),
    )
    add_fieldsets = (
        (
            _("Personal info"),
            {
                "fields": (
                    "username",
                    "email",
                    "phone_number",
                    "access_code",
                    "password1",
                    "password2",
                )
            },
        ),
        (_("Extra Fields"), {"fields": ("middle_man_code",)}),
    )

    readonly_fields = ("last_login", "date_joined")

    def get_fieldsets(self, request, obj=None):
        if not obj:
            # Adding new users: include access_code for creation.
            return self.add_fieldsets
        if not request.user.is_superuser:
            # Non-superusers see only login info.
            return ((_("Login Info"), {"fields": ("username", "password")}),)
        # Superusers editing: show full details but remove access_code from Login Info.
        fieldsets = list(super().get_fieldsets(request, obj))
        new_fieldsets = []
        for title, data in fieldsets:
            if title == _("Login Info"):
                fields = data.get("fields", ())
                data["fields"] = tuple(f for f in fields if f != "access_code")
            new_fieldsets.append((title, data))
        return new_fieldsets

    def save_model(self, request, obj, form, change):
        if not change:  # Only for new users
            access_code_str = obj.access_code
            super().save_model(request, obj, form, change)
            if access_code_str:
                try:
                    access_code = AccessCode.objects.get(code=access_code_str)
                    access_code.active = False
                    access_code.save()
                except AccessCode.DoesNotExist:
                    self.message_user(
                        request, _("Access code not found."), level="error"
                    )
        else:
            # For existing users, just save without access code validation
            super().save_model(request, obj, form, change)

    def deactivate_users(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, _("Selected users have been deactivated."))

    deactivate_users.short_description = _("Deactivate selected users")

    def reactivate_users(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, _("Selected users have been reactivated."))

    reactivate_users.short_description = _("Reactivate selected users")

    def get_birth_date(self, obj):
        return obj.personalinformation.birth_date if obj.personalinformation else None

    get_birth_date.short_description = _("Birth Date")

    get_birth_date.admin_order_field = (
        "personalinformation__birth_date"  # This enables sorting by birth_date
    )


class AccessCodeAdmin(admin.ModelAdmin):
    model = AccessCode
    list_display = ("code", "active", "date_created")
    search_fields = ("code",)
    list_filter = ("active",)
    ordering = ("-id",)
    actions = ["expire_access_codes", "reactivate_access_codes"]

    def expire_access_codes(self, request, queryset):
        queryset.update(active=False)
        self.message_user(
            request, _("Selected access codes have been marked as expired.")
        )

    expire_access_codes.short_description = _("Expire selected access codes")

    def reactivate_access_codes(self, request, queryset):
        queryset.update(active=True)
        self.message_user(request, _("Selected access codes have been reactivated."))

    reactivate_access_codes.short_description = _("Reactivate selected access codes")


admin.site.register(User, UserAdmin)
admin.site.register(AccessCode, AccessCodeAdmin)
