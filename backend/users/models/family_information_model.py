from django.db import models
from django.utils.translation import gettext_lazy as _
from core.utils.model_choices import Choices
from core.utils.model_error_messages import FamilyInfoErrorMessages
from django.urls import reverse
from multiselectfield import MultiSelectField

class FamilyInformation(models.Model):
    average_family_education = models.CharField(
        _("Average Family Education"),
        max_length=50,
        choices=Choices.AVERAGE_FAMILY_EDUCATION_CHOICES,
        error_messages=FamilyInfoErrorMessages.AVERAGE_FAMILY_EDUCATION,
    )
    average_family_finance = models.CharField(
        _("Average Family Finance"),
        max_length=50,
        choices=Choices.AVERAGE_FAMILY_FINANCE_CHOICES,
        error_messages=FamilyInfoErrorMessages.AVERAGE_FAMILY_FINANCE,
    )
    family_divorce_history = models.BooleanField(
        _("Family Divorce History"),
        error_messages=FamilyInfoErrorMessages.FAMILY_DIVORCE_HISTORY,
    )
    family_divorce_reason = models.CharField(
        _("Family Divorce Reason"),
        max_length=150,
        blank=True,
        null=True,
        error_messages=FamilyInfoErrorMessages.FAMILY_DIVORCE_REASON,
    )
    contact_with_family = models.CharField(
        _("Contact with Family"),
        max_length=50,
        error_messages=FamilyInfoErrorMessages.CONTACT_WITH_FAMILY,
    )
    user = models.OneToOneField("users.user", verbose_name=_("User"), on_delete=models.CASCADE)
    
    class Meta:
        verbose_name = _("Family Information")
        verbose_name_plural = _("Families Information")

    def __str__(self):
        return f"Family Information for {self.id}"

    def get_absolute_url(self):
        return reverse("FamilyInformation_detail", kwargs={"pk": self.pk})

class EngagementOrWeddingStatus(models.Model):
    status = models.CharField(
        _("Status"),
        max_length=50,
        choices=Choices.ENGAGEMENT_OR_WEDDING_STATUS_CHOICES,
        error_messages=FamilyInfoErrorMessages.ENGAGEMENT_OR_WEDDING_STATUS,
    )
    contract_length = models.CharField(
        _("Contract Length"),
        max_length=50,
        blank=True,
        null=True,
    )
    living_length = models.CharField(
        _("Living Length"),
        max_length=50,
        blank=True,
        null=True,
    )
    death_date = models.TimeField(
        _("Death Date"),
        blank=True,
        null=True,
    )
    divorce_date = models.TimeField(
        _("Divorce Date"),
        blank=True,
        null=True,
    )
    reason_for_divorce_or_death = models.CharField(
        _("Reason for Divorce or Death"),
        max_length=100,
        blank=True,
        null=True,
    )
    user = models.OneToOneField("users.user", verbose_name=_("User"), on_delete=models.CASCADE)

    class Meta:
        verbose_name = _("Engagement or Wedding Status")
        verbose_name_plural = _("Engagements or Weddings Statuse")

class ExHusbandChildStatus(models.Model):
    status = models.BooleanField(
        _("Status"),
    )
    girl_birth_date = models.TimeField(
        _("Girl Birth Date"),
        blank=True,
        null=True,
    )
    boy_birth_date = models.TimeField(
        _("Boy Birth Date"),
        blank=True,
        null=True,
    )
    custody = models.CharField(
        _("Custody"),
        max_length=50,
        choices=Choices.CUSTODY_CHOICES,
    )
    living_location = models.CharField(
        _("Living Location"),
        max_length=50,
        blank=True,
        null=True,
    )
    user = models.OneToOneField("users.user", verbose_name=_("User"), on_delete=models.CASCADE)

    class Meta:
        verbose_name = _("Ex-Husband Child Status")
        verbose_name_plural = _("Ex-Husbands Child Status")

class FamilyMember(models.Model):
    status = models.BooleanField(
        _("Status"),
    )
    education = models.CharField(
        _("Education"),
        max_length=50,
        choices=Choices.EDUCATION_CHOICES,
    )
    job = models.CharField(
        _("Job"),
        max_length=50,
        choices=Choices.JOB_OPTIONS,
    )
    user = models.ForeignKey("users.user", verbose_name=_("User"), on_delete=models.CASCADE)
    
    class Meta:
        abstract = True
        verbose_name = _("Family Member")
        verbose_name_plural = _("Family Members")

class Sister(FamilyMember):
    
    class Meta:
        verbose_name = _("Sister")
        verbose_name_plural = _("Sisters")

class Brother(FamilyMember):
    
    class Meta:
        verbose_name = _("Brother")
        verbose_name_plural = _("Brothers")

class Groom(FamilyMember):
    
    class Meta:
        verbose_name = _("Groom")
        verbose_name_plural = _("Grooms")

class BrideOrWife(FamilyMember):
    
    class Meta:
        verbose_name = _("Bride or Wife")
        verbose_name_plural = _("Brides or Wives")

class Parent(models.Model):
    language = models.CharField(
        _("Language"),
        max_length=50,
    )
    birth_date = models.DateField(
        _("Birth Date"),
    )
    job = models.CharField(
        _("Job"),
        max_length=50,
        choices=Choices.JOB_OPTIONS,
    )
    originality = models.CharField(
        _("Originality"),
        max_length=80,
    )
    education = models.CharField(
        _("Education"),
        max_length=50,
        choices=Choices.EDUCATION_CHOICES,
    )
    alive = models.BooleanField(
        _("Alive"),
    )
    death_date = models.DateField(
        _("Death Date"),
        blank=True,
        null=True,
    )
    user = models.OneToOneField("users.user", verbose_name=_("User"), on_delete=models.CASCADE)


    class Meta:
        abstract = True
        verbose_name = _("Parent")
        verbose_name_plural = _("Parents")

class Mother(Parent):
    
    class Meta:
        verbose_name = _("Mother")
        verbose_name_plural = _("Mothers")

class Father(Parent):
    
    class Meta:
        verbose_name = _("Father")
        verbose_name_plural = _("Fathers")
