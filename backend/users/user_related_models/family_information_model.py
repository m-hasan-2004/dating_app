from django.db import models
from django.utils.translation import gettext_lazy as _
from core.utils.model_choices.user_model_choices import Choices
from core.utils.error_msgs.model_error_messages import (
    FamilyInfoErrorMessages,
    PersonalInfoErrorMessages,
    ParentErrorMessages,
)
from core.utils.help_texts.help_text import FamilyInfoHelpText, PersonalInfoHelpText
from core.utils.validators.user_validators import FamilyInformationValidator, ParentInformationValidator

from django.urls import reverse
from django.utils import timezone


class FamilyInformation(models.Model):
    average_family_education = models.CharField(
        _("Average Family Education"),
        max_length=50,
        choices=Choices.AVERAGE_FAMILY_EDUCATION_CHOICES,
        error_messages=FamilyInfoErrorMessages.AVERAGE_FAMILY_EDUCATION,
        help_text=FamilyInfoHelpText.AVERAGE_FAMILY_EDUCATION,
        db_index=True,
    )
    average_family_finance = models.CharField(
        _("Average Family Finance"),
        max_length=50,
        choices=Choices.AVERAGE_FAMILY_FINANCE_CHOICES,
        error_messages=FamilyInfoErrorMessages.AVERAGE_FAMILY_FINANCE,
        help_text=FamilyInfoHelpText.AVERAGE_FAMILY_FINANCE,
        db_index=True,
    )
    family_divorce_history = models.BooleanField(
        _("Family Divorce History"),
        error_messages=FamilyInfoErrorMessages.FAMILY_DIVORCE_HISTORY,
        help_text=FamilyInfoHelpText.FAMILY_DIVORCE_HISTORY,
    )
    family_divorce_reason = models.CharField(
        _("Family Divorce Reason"),
        max_length=150,
        blank=True,
        null=True,
        error_messages=FamilyInfoErrorMessages.FAMILY_DIVORCE_REASON,
        help_text=FamilyInfoHelpText.FAMILY_DIVORCE_REASON,
    )
    contact_with_family = models.CharField(
        _("Contact with Family"),
        max_length=150,
        error_messages=FamilyInfoErrorMessages.CONTACT_WITH_FAMILY,
        help_text=FamilyInfoHelpText.CONTACT_WITH_FAMILY,
        validators=[FamilyInformationValidator.contact_validator],
    )
    contact_with_relatives = models.CharField(
        _("Contact with Relatives"),
        max_length=150,
        error_messages=FamilyInfoErrorMessages.CONTACT_WITH_RELATIVES,
        help_text=FamilyInfoHelpText.CONTACT_WITH_RELATIVES,
        validators=[FamilyInformationValidator.contact_validator],
    )
    kids = models.CharField(
        _("Kids"),
        blank=True,
        null=True,
        choices=Choices.KIDS,
        help_text=FamilyInfoHelpText.KIDS,
    )
    user = models.OneToOneField(
        "users.user",
        verbose_name=_("User"),
        on_delete=models.CASCADE,
        help_text=FamilyInfoHelpText.USER,
        db_index=True,
        related_name="family_information",
    )

    def clean(self):
        super().clean()
        FamilyInformationValidator.validate_divorce_info(
            self.family_divorce_history, self.family_divorce_reason
        )
    
    def save(self, *args, **kwargs):
    # Ensure date_joined is not before date_created for new users
        if self._state.adding:
            if self.date_created and (not self.date_joined or self.date_joined < self.date_created):
                self.date_joined = self.date_created
        super().save(*args, **kwargs)

    def __str__(self):
        return f"اطلاعات کاربر: {self.user.last_name}"

    def get_absolute_url(self):
        return reverse("FamilyInformation_detail", kwargs={"pk": self.pk})

    class Meta:
        verbose_name = _("Family Information")
        verbose_name_plural = _("Families Information")


class EngagementOrWeddingStatus(models.Model):
    status = models.CharField(
        _("Person Status"),
        max_length=50,
        choices=Choices.ENGAGEMENT_OR_WEDDING_STATUS_CHOICES,
        error_messages=FamilyInfoErrorMessages.ENGAGEMENT_OR_WEDDING_STATUS,
        help_text=FamilyInfoHelpText.PERSON_STATUS,
        db_index=True,
    )
    contract_length = models.CharField(
        _("Contract Length"),
        max_length=50,
        blank=True,
        null=True,
        help_text=FamilyInfoHelpText.CONTRACT_LENGTH,
    )
    living_length = models.CharField(
        _("Living Length"),
        max_length=50,
        blank=True,
        null=True,
        help_text=FamilyInfoHelpText.LIVING_LENGTH,
    )
    death_date = models.DateField(
        _("Death Date"), blank=True, null=True, help_text=FamilyInfoHelpText.DEATH_DATE
    )
    divorce_date = models.DateField(
        _("Divorce Date"),
        default=timezone.localtime,
        blank=True,
        null=True,
        help_text=FamilyInfoHelpText.DIVORCE_DATE,
    )
    reason_for_divorce_or_death = models.CharField(
        _("Reason for Divorce or Death"),
        max_length=100,
        blank=True,
        null=True,
        help_text=FamilyInfoHelpText.REASON_FOR_DIVORCE_OR_DEATH,
    )
    user = models.OneToOneField(
        "users.user",
        verbose_name=_("User"),
        on_delete=models.CASCADE,
        help_text=FamilyInfoHelpText.USER,
        db_index=True,
    )

    def __str__(self):
        return f"اطلاعات کاربر: {self.user.last_name}"
    
    def save(self, *args, **kwargs):
    # Ensure date_joined is not before date_created for new users
        if self._state.adding:
            if self.date_created and (not self.date_joined or self.date_joined < self.date_created):
                self.date_joined = self.date_created
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _("Engagement or Wedding Status")
        verbose_name_plural = _("Engagements or Weddings Statuse")


class ExHusbandChildStatus(models.Model):
    gender = models.CharField(
        _("Gender"),
        max_length=50,
        choices=Choices.GENDER_CHOICES,
        error_messages=PersonalInfoErrorMessages.GENDER,
        help_text=PersonalInfoHelpText.GENDER,
    )
    status = models.BooleanField(
        _("Status"),
        help_text=FamilyInfoHelpText.EX_HUSBAND_CHILD_STATUS,
        db_index=True,
    )
    birth_date = models.DateField(
        _("Child Birth Date"),
        blank=True,
        null=True,
        help_text=FamilyInfoHelpText.BIRTH_DATE,
    )
    custody = models.CharField(
        _("Custody"),
        max_length=50,
        choices=Choices.CUSTODY_CHOICES,
        help_text=FamilyInfoHelpText.CUSTODY,
    )
    living_location = models.CharField(
        _("Living Location"),
        max_length=50,
        blank=True,
        null=True,
        help_text=FamilyInfoHelpText.LIVING_LOCATION,
        validators=[FamilyInformationValidator.contact_validator],
    )
    user = models.ForeignKey(
        "users.user",
        verbose_name=_("User"),
        on_delete=models.CASCADE,
        help_text=FamilyInfoHelpText.USER,
        db_index=True,
    )

    def __str__(self):
        return f"اطلاعات کاربر: {self.user.last_name}"
    
    def save(self, *args, **kwargs):
    # Ensure date_joined is not before date_created for new users
        if self._state.adding:
            if self.date_created and (not self.date_joined or self.date_joined < self.date_created):
                self.date_joined = self.date_created
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _("Ex-Husband Child Status")
        verbose_name_plural = _("Ex-Husbands Child Status")


class FamilyMember(models.Model):
    status = models.BooleanField(_("Alive"), help_text=FamilyInfoHelpText.STATUS)
    education = models.CharField(
        _("Education"),
        max_length=50,
        choices=Choices.EDUCATION_CHOICES,
        help_text=FamilyInfoHelpText.EDUCATION,
    )
    job = models.CharField(
        _("Job"), 
        max_length=100, 
        help_text=FamilyInfoHelpText.JOB,
        validators=[ParentInformationValidator.job_validator],
    )
    user = models.ForeignKey(
        "users.user",
        verbose_name=_("User"),
        on_delete=models.CASCADE,
        help_text=FamilyInfoHelpText.USER,
        db_index=True,
    )

    def __str__(self):
        return f"اطلاعات کاربر: {self.user.last_name}"

    def save(self, *args, **kwargs):
    # Ensure date_joined is not before date_created for new users
        if self._state.adding:
            if self.date_created and (not self.date_joined or self.date_joined < self.date_created):
                self.date_joined = self.date_created
        super().save(*args, **kwargs)

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
    groom_or = models.CharField(
        _("Groom or Zan Dadash"),
        choices=Choices.GROOM_CHOICES,
        error_messages=FamilyInfoErrorMessages.GROOM_OR_ZAN,
        help_text=FamilyInfoHelpText.GROOM_OR_ZAN,
    )

    class Meta:
        verbose_name = _("Groom")
        verbose_name_plural = _("Grooms")


class BrideOrWife(FamilyMember):
    bride_or = models.CharField(
        _("Bride or Shohar Khahar"),
        choices=Choices.BRIDE_OR_WIFE_CHOICES,
        error_messages=FamilyInfoErrorMessages.BRIDE_OR_WIFE,
        help_text=FamilyInfoHelpText.BRIDE_OR_WIFE,
    )

    class Meta:
        verbose_name = _("Bride or Wife")
        verbose_name_plural = _("Brides or Wives")


class Parent(models.Model):
    language = models.CharField(
        _("Language"),
        max_length=50,
        help_text=FamilyInfoHelpText.LANGUAGE,
        error_messages=ParentErrorMessages.LANGUAGE,
        validators=[ParentInformationValidator.language_validator],
    )
    birth_date = models.DateField(
        _("Birth Date"),
        help_text=FamilyInfoHelpText.BIRTH_DATE,
        error_messages=ParentErrorMessages.BIRTH_DATE,
    )
    job = models.CharField(
        _("Job"),
        max_length=100,
        help_text=FamilyInfoHelpText.JOB,
        error_messages=ParentErrorMessages.JOB,
        validators=[ParentInformationValidator.job_validator],
    )
    originality = models.CharField(
        _("Originality"),
        choices=Choices.IRAN_PROVINCES,
        error_messages=ParentErrorMessages.ORIGINALITY,
        help_text=FamilyInfoHelpText.ORIGINALITY,
    )
    education = models.CharField(
        _("Education"),
        max_length=50,
        choices=Choices.EDUCATION_CHOICES,
        help_text=FamilyInfoHelpText.EDUCATION,
        error_messages=ParentErrorMessages.EDUCATION,
    )
    alive = models.BooleanField(
        _("Alive"),
        help_text=FamilyInfoHelpText.ALIVE,
        error_messages=ParentErrorMessages.ALIVE,
    )
    death_date = models.DateField(
        _("Death Date"),
        blank=True,
        null=True,
        help_text=FamilyInfoHelpText.DEATH_DATE,
    )

    def clean(self):
        super().clean()
        ParentInformationValidator.validate_parent_dates(
            self.birth_date, self.death_date, self.alive
        )

    def __str__(self):
        return f"اطلاعات کاربر: {self.user.last_name}"

    def save(self, *args, **kwargs):
    # Ensure date_joined is not before date_created for new users
        if self._state.adding:
            if self.date_created and (not self.date_joined or self.date_joined < self.date_created):
                self.date_joined = self.date_created
        super().save(*args, **kwargs)

    class Meta:
        abstract = True
        verbose_name = _("Parent")
        verbose_name_plural = _("Parents")
        


class Mother(Parent):
    user = models.OneToOneField(
        "users.user",
        verbose_name=_("User"),
        on_delete=models.CASCADE,
        help_text=FamilyInfoHelpText.USER,
        db_index=True,
        related_name="mother",
    )

    class Meta:
        verbose_name = _("Mother")
        verbose_name_plural = _("Mothers")


class Father(Parent):
    user = models.OneToOneField(
        "users.user",
        verbose_name=_("User"),
        on_delete=models.CASCADE,
        help_text=FamilyInfoHelpText.USER,
        db_index=True,
        related_name="father",
    )

    class Meta:
        verbose_name = _("Father")
        verbose_name_plural = _("Fathers")
