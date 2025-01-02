from django.db import models
from core.utils.model_choices import Choices
from core.utils.model_error_messages import PhysicalInfoErrorMessages
from core.utils.help_text import PhysicalInfoHelpText
from django.utils.translation import gettext_lazy as _

class PhysicalInformation(models.Model):
    height = models.BigIntegerField(
        _("Height"),
        error_messages=PhysicalInfoErrorMessages.HEIGHT,
        help_text=PhysicalInfoHelpText.HEIGHT,
    )
    weight = models.BigIntegerField(
        _("Weight"),
        error_messages=PhysicalInfoErrorMessages.WEIGHT,
        help_text=PhysicalInfoHelpText.WEIGHT,
    )
    skin_color = models.CharField(
        _("Skin Color"),
        max_length=20,
        choices=Choices.SKIN_COLOR_CHOICES,
        error_messages=PhysicalInfoErrorMessages.SKIN_COLOR
    )
    eyes_color = models.CharField(
        _("Eyes Color"),
        max_length=20,
        choices=Choices.EYES_COLOR_CHOICES,
        error_messages=PhysicalInfoErrorMessages.EYES_COLOR
    )
    blood_type = models.CharField(
        _("Blood Type"),
        max_length=3,
        choices=Choices.BLOOD_TYPE_CHOICES,
        error_messages=PhysicalInfoErrorMessages.BLOOD_TYPE
    )
    character_and_temperament = models.CharField(
        _("Character and Temperament"),
        max_length=20,
        choices=Choices.CHARACTER_AND_TEMPERAMENT_CHOICES,
        error_messages=PhysicalInfoErrorMessages.CHARACTER_AND_TEMPERAMENT
    )
    glasses = models.BooleanField(
        _("Glasses"),
        error_messages=PhysicalInfoErrorMessages.GLASSES,
        help_text=PhysicalInfoHelpText.GLASSES,
    )
    glasses_size = models.IntegerField(
        _("Glasses Size"),
        blank=True,
        null=True,
        error_messages=PhysicalInfoErrorMessages.GLASSES_SIZE,
        help_text=PhysicalInfoHelpText.GLASSES_SIZE,
    )
    body_and_face = models.CharField(
        _("Body and Face"),
        max_length=20,
        choices=Choices.BODY_AND_FACE_CHOICES,
        error_messages=PhysicalInfoErrorMessages.BODY_AND_FACE
    )
    disease_or_surgery = models.BooleanField(
        _("Disease or Surgery"),
        error_messages=PhysicalInfoErrorMessages.DISEASE_OR_SURGERY,
        help_text=PhysicalInfoHelpText.DISEASE_OR_SURGERY,
    )
    medication_surgery_disease_type = models.CharField(
        _("Medication/Surgery/Disease Type"),
        max_length=100,
        blank=True,
        null=True,
        error_messages=PhysicalInfoErrorMessages.MEDICATION_SURGERY_DISEASE_TYPE,
        help_text=PhysicalInfoHelpText.MEDICATION_SURGERY_DISEASE_TYPE,
    )
    user = models.OneToOneField(
        "users.User",
        verbose_name=_("User"),
        on_delete=models.CASCADE,
        error_messages=PhysicalInfoErrorMessages.USER
    )

    def __str__(self):
        return f"{self.user.username}'s Physical Information"

    class Meta:
        verbose_name = 'ModelName'
        verbose_name_plural = 'ModelNames'