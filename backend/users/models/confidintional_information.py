from .validators import LandlineNumberValidator
from django.contrib.auth.validators import UnicodeUsernameValidator
from phonenumber_field.modelfields import PhoneNumberField
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from multiselectfield import MultiSelectField
from django.utils import timezone
from django.urls import reverse
from django.db import models
from .choices import Choices


class IdentityInfo(models.Model):
    first_name = models.CharField(_("First Name"), max_length=80)
    last_name = models.CharField(_("Last Name"), max_length=50)
    father_name = models.CharField(_("Father's Name"), max_length=80)
    eitta_number = PhoneNumberField(_("Eitta Number"), unique=True, region="IR")
    landline_phone = models.CharField(
        _("Landline Phone"), max_length=12, validators=[LandlineNumberValidator],
        help_text=_('Enter a landline number in the format: 025-32305083')
    )
    mother_phone = PhoneNumberField(_("Mother's Phone"), unique=True, region="IR")
    father_phone = PhoneNumberField(_("Father's Phone"), unique=True, region="IR")
    home_address = models.CharField(_("Home Address"), max_length=150)
    work_address = models.CharField(_("Work Address"), max_length=150)
    originality = models.CharField(_("Originality"), max_length=80)
    education = models.CharField(_("Education"), max_length=80)
    job = MultiSelectField(_("Job"), choices=Choices.JOB_OPTIONS)
    insurance = MultiSelectField(_("Insurance"), choices=Choices.INSURANCE_OPTIONS)
    income = models.BigIntegerField(_("Income in Rials"))
    assets = models.CharField(_("Assets"), max_length=150)
    weight = models.DecimalField(_("Weight (in kg)"), max_digits=5, decimal_places=2)   
    height = models.DecimalField(_("Height (in cm)"), max_digits=5, decimal_places=2)
    introduced_subjects = models.ForeignKey(
        "users.User", verbose_name=_("Introduced Subjects"),
        on_delete=models.PROTECT, related_name="confidintional_info_subjects"
    )
    prefered_meeting_time = models.CharField(_("Prefered Meeting Time"), max_length=150)
    type_of_payment = MultiSelectField(_("Type of payment"), choices=Choices.TYPE_OF_PAYMENT_OPTIONS)
    user = models.OneToOneField("users.User", verbose_name=_("User"), on_delete=models.CASCADE, related_name="confidintional_info_user")


    class Meta:
        verbose_name = _("IdentityInfo")
        verbose_name_plural = _("IdentityInfos")

    def __str__(self):
        return self.first_name

    def get_absolute_url(self):
        return reverse("IdentityInfo_detail", kwargs={"pk": self.pk})
    
    
class BirthCertificateInfo(models.Model):
    national_code = models.CharField(_("National Code"), unique=True, max_length=10) 
    birth_certificate_serial = models.CharField(_("Birth Certificate Serial"), max_length=10)
    birth_certificate_location = models.CharField(_("Birth Certificate Location"), max_length=50)
    marriage_experince = MultiSelectField(_("Marriage Experince"), choices=Choices.MARRIAGE_EXPERINCE_OPTION)
    contract_date = models.DateTimeField(_("Contract Date"), auto_now=False, auto_now_add=False, blank=True, null=True)
    marriage_status = MultiSelectField(_("Marriage Status"), choices=Choices.MARRIAGE_STATUS_OPTIONS)
    marriage_date = models.DateTimeField(_("Marriage Date"), auto_now=False, auto_now_add=False, blank=True, null=True)
    divorce_date = models.DateTimeField(_("Divorce Date"), auto_now=False, auto_now_add=False, blank=True, null=True)
    husband_death_date = models.DateTimeField(_("Husband Death Date"), auto_now=False, auto_now_add=False, blank=True, null=True)
    birth_date = models.DateTimeField(_("Birth Date"), auto_now=False, auto_now_add=False)
    children = MultiSelectField(_("Children"), choices=Choices.CHILDREN_OPTIONS)
    children_custody = MultiSelectField(_("Children Custody"), choices=Choices.CHILDREN_CUSTODY_OPTIONS)
    user = models.OneToOneField("users.User", verbose_name=_("User"), on_delete=models.CASCADE, related_name="birth_certificate_info")
    
    class Meta:
        verbose_name = _("BirthCertificateInfo")
        verbose_name_plural = _("BirthCertificateInfos")

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("BirthCertificateInfo_detail", kwargs={"pk": self.pk})

