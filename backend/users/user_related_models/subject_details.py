from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

from core.utils.model_choices.subject_model_choices import SubjectChoices
from core.utils.validators.subject_validators import (
    validate_account_number,
    validate_bank_name,
    validate_amount,
)
from core.utils.error_msgs.subject_error_messages import SubjectErrorMessages
from core.utils.help_texts.subject_help_texts import SubjectHelpText
from users.models import User


class SubjectDetails(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='subject_details',
        verbose_name=_('User')
    )
    
    preferred_date_times = models.CharField(
        _('Preferred Date Times'),
        max_length=255,
        help_text=SubjectHelpText.PREFERRED_DATE_TIMES,
        error_messages=SubjectErrorMessages.SUBJECT_PREFERRED_DATE_TIMES,
        blank=True,
        null=True,
    )
    
    signup_fee_type = models.CharField(
        _('Signup Fee Type'),
        max_length=50,
        choices=SubjectChoices.SIGNUP_FEE_TYPE,
        help_text=SubjectHelpText.SIGNUP_FEE_TYPE,
        error_messages=SubjectErrorMessages.SIGNUP_FEE_TYPE,
        blank=True,
        null=True,
    )
    
    account_number = models.CharField(
        _('Account Number'),
        max_length=20,
        validators=[validate_account_number],
        help_text=SubjectHelpText.ACCOUNT_NUMBER,
        error_messages=SubjectErrorMessages.ACCOUNT_NUMBER,
        blank=True,
        null=True,
    )
    
    bank = models.CharField(
        _('Bank Name'),
        max_length=100,
        validators=[validate_bank_name],
        help_text=SubjectHelpText.BANK,
        error_messages=SubjectErrorMessages.BANK,
        blank=True,
        null=True,
    )
    
    gender_target = models.CharField(
        _('Gender Target'),
        max_length=100,
        help_text=SubjectHelpText.GENDER_TARGET,
        error_messages=SubjectErrorMessages.GENDER_TARGET,
        blank=True,
        null=True,
    )
    
    amount = models.CharField(
        _('Amount'),
        max_length=20,
        validators=[validate_amount],
        help_text=SubjectHelpText.AMOUNT,
        error_messages=SubjectErrorMessages.AMOUNT,
        blank=True,
        null=True,
    )
    
    professional_opinion = models.TextField(
        _('Professional Opinion'),
        max_length=1000,
        help_text=SubjectHelpText.PROFESSIONAL_OPINION,
        error_messages=SubjectErrorMessages.PROFESSIONAL_OPINION,
        blank=True,
        null=True,
    )
    
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('Subject Details')
        verbose_name_plural = _('Subject Details')
    
    def clean(self):
        super().clean()
        # If signup fee type is card, account number and bank are required
        if self.signup_fee_type == 'card' and not (self.account_number and self.bank):
            raise ValidationError({
                'account_number': _('Account number is required for card payment.'),
                'bank': _('Bank name is required for card payment.'),
            })
    
    def __str__(self):
        return f"Subject Details - {self.user.username}" if self.user else "Subject Details"