from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.utils.translation import gettext_lazy as _
from users.user_related_models import (
    User, AccessCode, IdentityInformation, BirthCertificateInformation, IntroducedSubjectsInformation, PersonalInformation, PhysicalInformation, 
    FamilyInformation, EngagementOrWeddingStatus, ExHusbandChildStatus, Sister, Brother, Groom, BrideOrWife, 
    Mother, Father, FinancialInformation, IntellectualInformation
)
from .forms import CustomUserChangeForm, CustomUserCreationForm
from users.preferred_wife_models import (
    PreferredWifeExtraInformation, PreferredWifePhysicalInformation, PreferredWifePersonalInformation, 
    PreferredWifeIntellectualInformation, FutureSposeOriginality
)
from jalali_date.admin import StackedInlineJalaliMixin, TabularInlineJalaliMixin	

class IdentityInfoInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = IdentityInformation
    fk_name = "user"
    extra = 1
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            return qs.none()  # Hide inline identity info for staff
        return qs

    def get_fields(self, request, obj=None):
        fields = super().get_fields(request, obj)
        if not request.user.is_superuser:
            fields = [f for f in fields if f not in ('introduced_subjects', 'introduced_subjects_explantions')]
        return fields

class BirthCertificateInfoInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = BirthCertificateInformation
    extra = 1
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            return qs.none()  # Hide inline birth certificate info for staff
        return qs
    
class IntroducedSubjectsInformationInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = IntroducedSubjectsInformation
    fk_name = "user"
    extra = 1
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            return qs.none()  # Hide inline birth certificate info for staff
        return qs

class PersonalInfoInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = PersonalInformation
    fk_name = "user"
    extra = 1

class PhysicalInfoInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = PhysicalInformation
    fk_name = "user"
    extra = 1

class FamilyInfoInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = FamilyInformation
    fk_name = "user"
    extra = 1

class EngagementOrWeddingStatusInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = EngagementOrWeddingStatus
    fk_name = "user"
    extra = 1

class ExHusbandChildStatusInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = ExHusbandChildStatus
    fk_name = "user"
    extra = 1

class SisterInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = Sister
    fk_name = "user"
    extra = 1

class BrotherInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = Brother
    fk_name = "user"
    extra = 1

class GroomInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = Groom
    fk_name = "user"
    extra = 1

class BrideOrWifeInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = BrideOrWife
    fk_name = "user"
    extra = 1

class MotherInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = Mother
    fk_name = "user"
    extra = 1

class FatherInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = Father
    fk_name = "user"
    extra = 1

class FinancialInfoInline(StackedInlineJalaliMixin, admin.StackedInline):
    model = FinancialInformation
    fk_name = "user"
    extra = 1
    
class IntellectualInfoInline(StackedInlineJalaliMixin, admin.StackedInline):
    model =  IntellectualInformation
    fk_name = "user"
    extra = 1 
    
class PreferredWifeIntellectualInformationInLine(StackedInlineJalaliMixin, admin.StackedInline):
    model = PreferredWifeIntellectualInformation
    fk_name = "user"
    extra = 1   

class FutureSposeOriginalityInLine(StackedInlineJalaliMixin, admin.StackedInline):
    model = FutureSposeOriginality
    fk_name = "user"
    extra = 5
    max_num = 5 
    
class PreferredWifePersonalInformationInLine(StackedInlineJalaliMixin, admin.StackedInline):
    model = PreferredWifePersonalInformation
    fk_name = "user"
    extra = 1    
    
class PreferredWifePhysicalInformationInLine(StackedInlineJalaliMixin, admin.StackedInline):
    model = PreferredWifePhysicalInformation
    fk_name = "user"
    extra = 1    
    
class PreferredWifeExtraInformationInLine(StackedInlineJalaliMixin, admin.StackedInline):
    model = PreferredWifeExtraInformation
    fk_name = "user"
    extra = 1    

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
    )
    list_filter = (
        "is_staff", 
        "is_active", 
        "date_joined",
    )
    search_fields = ("username", "email", "first_name", "last_name", "phone_number")
    ordering = ("date_joined",)
    actions = ["deactivate_users", "reactivate_users"]
    inlines = [
        BirthCertificateInfoInline, 
        IdentityInfoInline, 
        IntroducedSubjectsInformationInline,
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
        PreferredWifeExtraInformationInLine
    ]
    
    save_on_top = True

    fieldsets = (
        (_("Login Info"), {"fields": ("username", "password", "access_code")}),
        (_("Personal info"), {"fields": ("first_name", "last_name", "email", "phone_number")}),
        (_("Permissions"), {"fields": ("is_active", "is_staff", "is_superuser", "groups")}),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
        (_("Extra Fields"), {"fields": ("middle_man_code",)}),
    )
    add_fieldsets = (
        (_("Personal info"), {"fields": ("username", "first_name", "last_name", "email", "phone_number", "access_code", "password1", "password2")}),
        (_("Extra Fields"), {"fields": ("middle_man_code",)}),
    )
    
    readonly_fields = ("last_login", "date_joined")

    def get_fieldsets(self, request, obj=None):
        if not obj:
            # Adding new users: include access_code for creation.
            return self.add_fieldsets
        if not request.user.is_superuser:
            # Non-superusers see only login info.
            return (
                (_("Login Info"), {"fields": ("username", "password")}),
            )
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
                    self.message_user(request, _("Access code not found."), level='error')
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
    

class AccessCodeAdmin(admin.ModelAdmin):
    model = AccessCode
    list_display = ("code", "active", "date_created")
    search_fields = ("code",)
    list_filter = ("active",)
    ordering = ("-id",)
    actions = ["expire_access_codes", "reactivate_access_codes"]

    def expire_access_codes(self, request, queryset):
        queryset.update(active=False)
        self.message_user(request, _("Selected access codes have been marked as expired."))
    expire_access_codes.short_description = _("Expire selected access codes")

    def reactivate_access_codes(self, request, queryset):
        queryset.update(active=True)
        self.message_user(request, _("Selected access codes have been reactivated."))
    reactivate_access_codes.short_description = _("Reactivate selected access codes")

class IdentityInfoAdmin(admin.ModelAdmin):
    model = IdentityInformation
    list_display = ("first_name", "last_name", "father_name", "eitta_number", "landline_phone", "mother_phone", "father_phone", "home_address", "work_address", "originality", "education", "job", "insurance", "income", "assets", "weight", "height", "prefered_meeting_time", "type_of_payment", "user")
    search_fields = ("first_name", "last_name", "father_name", "eitta_number", "landline_phone", "mother_phone", "father_phone", "home_address", "work_address", "originality", "education", "job", "insurance", "income", "assets", "weight", "height", "prefered_meeting_time", "type_of_payment", "user")
    list_filter = ("job", "insurance", "type_of_payment")
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            return qs.none()  # Staff cannot see identity information
        return qs

class BirthCertificateInfoAdmin(admin.ModelAdmin):
    model = BirthCertificateInformation
    list_display = ("national_code", "birth_certificate_serial", "birth_certificate_location", "marriage_experince", "contract_date", "marriage_status", "marriage_date", "divorce_date", "husband_death_date", "birth_date", "children", "children_custody", "user")
    search_fields = ("national_code", "birth_certificate_serial", "birth_certificate_location", "marriage_experince", "contract_date", "marriage_status", "marriage_date", "divorce_date", "husband_death_date", "birth_date", "children", "children_custody", "user")
    list_filter = ("marriage_experince", "marriage_status", "children", "children_custody")
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            return qs.none()  # Staff cannot see birth certificate information
        return qs

class FinancialInfoAdmin(admin.ModelAdmin):
    model = FinancialInformation
    list_display = ("current_residence_status", "ownership_status", "rent_amount", "mortgage_amount", "capital", "after_marriage_residence_status", "ex_spouse_financial_status", "ex_spouse_financial_amount", "ex_spouse_financial_pay_status", "dowry_type", "dowry_amount", "tocher", "user")
    search_fields = ("current_residence_status", "ownership_status", "rent_amount", "mortgage_amount", "capital", "after_marriage_residence_status", "ex_spouse_financial_status", "ex_spouse_financial_amount", "ex_spouse_financial_pay_status", "dowry_type", "dowry_amount", "tocher", "user")
    list_filter = ("current_residence_status", "ownership_status", "capital", "after_marriage_residence_status", "ex_spouse_financial_status", "ex_spouse_financial_pay_status", "dowry_type", "tocher")

class PersonalInfoAdmin(admin.ModelAdmin):
    model = PersonalInformation
    list_display = ("user", "gender", "birth_date", "education")
    search_fields = ("gender", "birth_date", "education", "user")
    list_filter = ("gender", "education")

class PhysicalInfoAdmin(admin.ModelAdmin):
    model = PhysicalInformation
    list_display = ("user", "height", "weight", "skin_color")
    search_fields = ("height", "weight", "skin_color", "user")
    list_filter = ("skin_color",)

class FamilyInfoAdmin(admin.ModelAdmin):
    model = FamilyInformation
    list_display = ("user", "average_family_education", "average_family_finance", "family_divorce_history")
    search_fields = ("average_family_education", "average_family_finance", "family_divorce_history", "user")
    list_filter = ("family_divorce_history",)
    
class EngagementOrWeddingStatusAdmin(admin.ModelAdmin):
    model = EngagementOrWeddingStatus
    list_display = ("user", "status", "contract_length", "living_length")
    search_fields = ("status", "contract_length", "living_length", "user")
    list_filter = ("status",)

class ExHusbandChildStatusAdmin(admin.ModelAdmin):
    model = ExHusbandChildStatus
    list_display = ("user", "status", "custody", "living_location")
    search_fields = ("status", "custody", "living_location", "user")
    list_filter = ("status",)

class SisterAdmin(admin.ModelAdmin):
    model = Sister
    list_display = ("user", "status", "education", "job")
    search_fields = ("status", "education", "job", "user")
    list_filter = ("status",)

class BrotherAdmin(admin.ModelAdmin):
    model = Brother
    list_display = ("user", "status", "education", "job")
    search_fields = ("status", "education", "job", "user")
    list_filter = ("status",)

class GroomAdmin(admin.ModelAdmin):
    model = Groom
    list_display = ("user", "status", "education", "job")
    search_fields = ("status", "education", "job", "user")
    list_filter = ("status",)

class BrideOrWifeAdmin(admin.ModelAdmin):
    model = BrideOrWife
    list_display = ("user", "status", "education", "job")
    search_fields = ("status", "education", "job", "user")
    list_filter = ("status",)

class MotherAdmin(admin.ModelAdmin):
    model = Mother
    list_display = ("user", "language", "birth_date", "job")
    search_fields = ("language", "birth_date", "job", "user")
    list_filter = ("job",)

class FatherAdmin(admin.ModelAdmin):
    model = Father
    list_display = ("user", "language", "birth_date", "job")
    search_fields = ("language", "birth_date", "job", "user")
    list_filter = ("job",)

class PreferredWifeExtraInformationAdmin(admin.ModelAdmin):
    model = PreferredWifeExtraInformation
    list_display = ("user", "additional_explanations")
    search_fields = ("additional_explanations", "user")

class PreferredWifePhysicalInformationAdmin(admin.ModelAdmin):
    model = PreferredWifePhysicalInformation
    list_display = ("user", "height", "weight", "skin_color")
    search_fields = ("height", "weight", "skin_color", "user")
    list_filter = ("skin_color",)
    
class PreferredWifePersonalInformationAdmin(admin.ModelAdmin):
    model = PreferredWifePersonalInformation
    list_display = ("user", "education", "field_of_study", "future_spouse_job")
    search_fields = ("education", "field_of_study", "future_spouse_job", "user")
    list_filter = ("education", "field_of_study")

class PreferredWifeIntellectualInformationAdmin(admin.ModelAdmin):
    model = PreferredWifeIntellectualInformation
    list_display = ("user", "appearance_type", "age_difference", "future_spouse_family_religious_status_importance")
    search_fields = ("appearance_type", "age_difference", "future_spouse_family_religious_status_importance", "user")
    list_filter = ("appearance_type", "future_spouse_family_religious_status_importance")

admin.site.register(User, UserAdmin)
admin.site.register(AccessCode, AccessCodeAdmin)