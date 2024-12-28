from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.utils.translation import gettext_lazy as _
from .models import User, AccessCode, IdentityInfo, BirthCertificateInfo
from .forms import CustomUserChangeForm, CustomUserCreationForm

class IdentityInfoInline(admin.StackedInline):
    model = IdentityInfo
    fk_name = "user"
    extra = 1
    

class BirthCertificateInfoInline(admin.StackedInline):
    model = BirthCertificateInfo
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
    inlines = [BirthCertificateInfoInline, IdentityInfoInline]
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
    model = IdentityInfo
    list_display = ("first_name", "last_name", "father_name", "eitta_number", "landline_phone", "mother_phone", "father_phone", "home_address", "work_address", "originality", "education", "job", "insurance", "income", "assets", "weight", "height", "introduced_subjects", "prefered_meeting_time", "type_of_payment", "user")
    search_fields = ("first_name", "last_name", "father_name", "eitta_number", "landline_phone", "mother_phone", "father_phone", "home_address", "work_address", "originality", "education", "job", "insurance", "income", "assets", "weight", "height", "introduced_subjects", "prefered_meeting_time", "type_of_payment", "user")
    list_filter = ("job", "insurance", "type_of_payment")
    save_on_top = True

class BirthCertificateInfoAdmin(admin.ModelAdmin):
    model = BirthCertificateInfo
    list_display = ("national_code", "birth_certificate_serial", "birth_certificate_location", "marriage_experince", "contract_date", "marriage_status", "marriage_date", "divorce_date", "husband_death_date", "birth_date", "children", "children_custody", "user")
    search_fields = ("national_code", "birth_certificate_serial", "birth_certificate_location", "marriage_experince", "contract_date", "marriage_status", "marriage_date", "divorce_date", "husband_death_date", "birth_date", "children", "children_custody", "user")
    list_filter = ("marriage_experince", "marriage_status", "children", "children_custody")
    save_on_top = True

admin.site.register(User, UserAdmin)
admin.site.register(AccessCode, AccessCodeAdmin)
admin.site.register(IdentityInfo, IdentityInfoAdmin)
admin.site.register(BirthCertificateInfo, BirthCertificateInfoAdmin)
