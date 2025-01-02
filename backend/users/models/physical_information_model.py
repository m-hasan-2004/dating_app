from django.db import models
from .model_choices import Choices
from .model_error_messages import PhysicalInfoErrorMessages
from django.contrib.auth.models import User

class PhysicalInformation(models.Model):
    height = models.BigIntegerField(
        error_messages=PhysicalInfoErrorMessages.HEIGHT
    )
    weight = models.BigIntegerField(
        error_messages=PhysicalInfoErrorMessages.WEIGHT
    )
    skin_color = models.CharField(
        max_length=20,
        choices=Choices.SKIN_COLOR_CHOICES,
        error_messages=PhysicalInfoErrorMessages.SKIN_COLOR
    )
    eyes_color = models.CharField(
        max_length=20,
        choices=Choices.EYES_COLOR_CHOICES,
        error_messages=PhysicalInfoErrorMessages.EYES_COLOR
    )
    blood_type = models.CharField(
        max_length=3,
        choices=Choices.BLOOD_TYPE_CHOICES,
        error_messages=PhysicalInfoErrorMessages.BLOOD_TYPE
    )
    character_and_temperament = models.CharField(
        max_length=20,
        choices=Choices.CHARACTER_AND_TEMPERAMENT_CHOICES,
        error_messages=PhysicalInfoErrorMessages.CHARACTER_AND_TEMPERAMENT
    )
    glasses = models.BooleanField(
        error_messages=PhysicalInfoErrorMessages.GLASSES
    )
    glasses_size = models.IntegerField(
        blank=True,
        null=True,
        error_messages=PhysicalInfoErrorMessages.GLASSES_SIZE
    )
    body_and_face = models.CharField(
        max_length=20,
        choices=Choices.BODY_AND_FACE_CHOICES,
        error_messages=PhysicalInfoErrorMessages.BODY_AND_FACE
    )
    disease_or_surgery = models.BooleanField(
        error_messages=PhysicalInfoErrorMessages.DISEASE_OR_SURGERY
    )
    medication_surgery_disease_type = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        error_messages=PhysicalInfoErrorMessages.MEDICATION_SURGERY_DISEASE_TYPE
    )
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        error_messages=PhysicalInfoErrorMessages.USER
    )
    id = models.AutoField(primary_key=True)

    def __str__(self):
        return f"{self.user.username}'s Physical Information"
