from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.utils.translation import gettext_lazy as _
from .user_related_models import User, AccessCode, IdentityInformation, BirthCertificateInformation, PersonalInformation, PhysicalInformation, FamilyInformation, EngagementOrWeddingStatus, ExHusbandChildStatus, Sister, Brother, Groom, BrideOrWife, Mother, Father, FinancialInformation
from .forms import CustomUserChangeForm, CustomUserCreationForm

class IdentityInfoInline(admin.StackedInline):
    model = IdentityInformation
    fk_name = "user"
    extra = 1
    

class BirthCertificateInfoInline(admin.StackedInline):
    model = BirthCertificateInformation
    extra = 1

class PersonalInfoInline(admin.StackedInline):
    model = PersonalInformation
    fk_name = "user"
    extra = 1

class PhysicalInfoInline(admin.StackedInline):
    model = PhysicalInformation
    fk_name = "user"
    extra = 1

class FamilyInfoInline(admin.StackedInline):
    model = FamilyInformation
    fk_name = "user"
    extra = 1

class EngagementOrWeddingStatusInline(admin.StackedInline):
    model = EngagementOrWeddingStatus
    fk_name = "user"
    extra = 1

class ExHusbandChildStatusInline(admin.StackedInline):
    model = ExHusbandChildStatus
    fk_name = "user"
    extra = 1

class SisterInline(admin.StackedInline):
    model = Sister
    fk_name = "user"
    extra = 1

class BrotherInline(admin.StackedInline):
    model = Brother
    fk_name = "user"
    extra = 1

class GroomInline(admin.StackedInline):
    model = Groom
    fk_name = "user"
    extra = 1

class BrideOrWifeInline(admin.StackedInline):
    model = BrideOrWife
    fk_name = "user"
    extra = 1

class MotherInline(admin.StackedInline):
    model = Mother
    fk_name = "user"
    extra = 1

class FatherInline(admin.StackedInline):
    model = Father
    fk_name = "user"
    extra = 1

class FinancialInfoInline(admin.StackedInline):
    model = FinancialInformation
    fk_name = "user"
    extra = 1

class UserAdmin(auth_admin.UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User
    list_display = (
        "id",
        "username", 
        "first_name", 
        "last_name", 
        "email", 
        "phone_number", 
        "date_joined", 
        "is_active", 
        "is_staff", 
        "access_code",
    )
    list_filter = ("is_staff", "is_active", "date_joined")
    search_fields = ("username", "email", "first_name", "last_name", "phone_number")
    ordering = ("date_joined",)
    actions = ["deactivate_users", "reactivate_users"]
    inlines = [
        BirthCertificateInfoInline, 
        IdentityInfoInline, 
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
        FinancialInfoInline
    ]
    save_on_top = True

    fieldsets = (
        (_("Login Info"), {"fields": ("username", "password", "access_code")}),
        (_("Personal info"), {"fields": ("first_name", "last_name", "email", "phone_number")}),
        (_("Permissions"), {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
        (_("Extra Fields"), {"fields": ("middle_man_code",)}),
    )
    add_fieldsets = (
        (_("Personal info"), {"fields": ("username", "first_name", "last_name", "email", "phone_number", "access_code", "password1", "password2")}),
        (_("Permissions"), {"fields": ("is_active", "is_staff", "is_superuser")}),
    )

    def get_fieldsets(self, request, obj=None):
        if not obj:
            # For new users
            return self.add_fieldsets
        # For existing users, remove access_code from the first fieldset
        fieldsets = list(super().get_fieldsets(request, obj))
        fieldsets[0] = (_("Login Info"), {"fields": ("username", "password")})
        return fieldsets

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
    save_on_top = True

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
    save_on_top = True

class BirthCertificateInfoAdmin(admin.ModelAdmin):
    model = BirthCertificateInformation
    list_display = ("national_code", "birth_certificate_serial", "birth_certificate_location", "marriage_experince", "contract_date", "marriage_status", "marriage_date", "divorce_date", "husband_death_date", "birth_date", "children", "children_custody", "user")
    search_fields = ("national_code", "birth_certificate_serial", "birth_certificate_location", "marriage_experince", "contract_date", "marriage_status", "marriage_date", "divorce_date", "husband_death_date", "birth_date", "children", "children_custody", "user")
    list_filter = ("marriage_experince", "marriage_status", "children", "children_custody")
    save_on_top = True

class FinancialInfoAdmin(admin.ModelAdmin):
    model = FinancialInformation
    list_display = ("current_residence_status", "ownership_status", "rent_amount", "mortgage_amount", "capital", "after_marriage_residence_status", "ex_spouse_financial_status", "ex_spouse_financial_amount", "ex_spouse_financial_pay_status", "dowry_type", "dowry_amount", "tocher", "agreement_id", "user")
    search_fields = ("current_residence_status", "ownership_status", "rent_amount", "mortgage_amount", "capital", "after_marriage_residence_status", "ex_spouse_financial_status", "ex_spouse_financial_amount", "ex_spouse_financial_pay_status", "dowry_type", "dowry_amount", "tocher", "agreement_id", "user")
    list_filter = ("current_residence_status", "ownership_status", "capital", "after_marriage_residence_status", "ex_spouse_financial_status", "ex_spouse_financial_pay_status", "dowry_type", "tocher")
    save_on_top = True

admin.site.register(User, UserAdmin)
admin.site.register(AccessCode, AccessCodeAdmin)
admin.site.register(IdentityInformation, IdentityInfoAdmin)
admin.site.register(BirthCertificateInformation, BirthCertificateInfoAdmin)
admin.site.register(FinancialInformation, FinancialInfoAdmin)
admin.site.register(PersonalInformation)
admin.site.register(PhysicalInformation)
admin.site.register(FamilyInformation)
admin.site.register(EngagementOrWeddingStatus)
admin.site.register(ExHusbandChildStatus)
admin.site.register(Sister)
admin.site.register(Brother)
admin.site.register(Groom)
admin.site.register(BrideOrWife)
admin.site.register(Mother)
admin.site.register(Father)
