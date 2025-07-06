from django.db import models
from core.utils.model_choices.user_model_choices import Choices
from core.utils.error_msgs.model_error_messages import PhysicalInfoErrorMessages
from core.utils.help_texts.help_text import PhysicalInfoHelpText
from django.utils.translation import gettext_lazy as _
from core.utils.validators.user_validators import PhysicalInformationValidator
from multiselectfield import MultiSelectField


class PhysicalInformation(models.Model):
    height = models.DecimalField(
        _("Height"),
        max_digits=5,
        decimal_places=2,
        error_messages=PhysicalInfoErrorMessages.HEIGHT,
        help_text=PhysicalInfoHelpText.HEIGHT,
        db_index=True,
        validators=[
            PhysicalInformationValidator.height_validator,
            PhysicalInformationValidator.max_height_validator,
        ],
    )
    weight = models.DecimalField(
        _("Weight"),
        max_digits=5,
        decimal_places=2,
        error_messages=PhysicalInfoErrorMessages.WEIGHT,
        help_text=PhysicalInfoHelpText.WEIGHT,
        db_index=True,
        validators=[
            PhysicalInformationValidator.weight_validator,
            PhysicalInformationValidator.max_weight_validator,
        ],
    )
    skin_color = models.CharField(
        _("Skin Color"),
        max_length=20,
        choices=Choices.SKIN_COLOR_CHOICES,
        error_messages=PhysicalInfoErrorMessages.SKIN_COLOR,
        help_text=PhysicalInfoHelpText.SKIN_COLOR,
        db_index=True,
    )
    eyes_color = models.CharField(
        _("Eyes Color"),
        max_length=20,
        choices=Choices.EYES_COLOR_CHOICES,
        error_messages=PhysicalInfoErrorMessages.EYES_COLOR,
        help_text=PhysicalInfoHelpText.EYES_COLOR,
    )
    blood_type = models.CharField(
        _("Blood Type"),
        max_length=3,
        choices=Choices.BLOOD_TYPE_CHOICES,
        error_messages=PhysicalInfoErrorMessages.BLOOD_TYPE,
        help_text=PhysicalInfoHelpText.BLOOD_TYPE,
    )
    character_and_temperament = models.CharField(
        _("Character and Temperament"),
        max_length=20,
        choices=Choices.CHARACTER_AND_TEMPERAMENT_CHOICES,
        error_messages=PhysicalInfoErrorMessages.CHARACTER_AND_TEMPERAMENT,
        help_text=PhysicalInfoHelpText.CHARACTER_AND_TEMPERAMENT,
    )
    glasses = models.BooleanField(
        _("Glasses"),
        error_messages=PhysicalInfoErrorMessages.GLASSES,
        help_text=PhysicalInfoHelpText.GLASSES,
        db_index=True,
    )
    glasses_size = models.CharField(
        _("Glasses Size"),
        blank=True,
        null=True,
        error_messages=PhysicalInfoErrorMessages.GLASSES_SIZE,
        help_text=PhysicalInfoHelpText.GLASSES_SIZE,
        validators=[PhysicalInformationValidator.glasses_size_validator],
    )
    body_and_face = MultiSelectField(
        _("Body and Face"),
        max_length=20,
        choices=Choices.BODY_AND_FACE_CHOICES,
        error_messages=PhysicalInfoErrorMessages.BODY_AND_FACE,
        help_text=PhysicalInfoHelpText.BODY_AND_FACE,
    )
    disease_or_surgery = models.BooleanField(
        _("Disease or Surgery History"),
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
        error_messages=PhysicalInfoErrorMessages.USER,
        help_text=PhysicalInfoHelpText.USER,
        db_index=True,
    )

    def clean(self):
        super().clean()
        PhysicalInformationValidator.validate_disease_info(
            self.disease_or_surgery, self.medication_surgery_disease_type
        )


    def __str__(self):
        return f"اطلاعات کاربر: {self.user.last_name}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _("Physical Information")
        verbose_name_plural = _("Physical Informations")
