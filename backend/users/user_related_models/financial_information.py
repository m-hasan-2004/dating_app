from django.db import models
from django.utils.translation import gettext_lazy as _
from core.utils.model_choices.user_model_choices import FinancialInformationChoices
from core.utils.error_msgs.model_error_messages import FinancialInformationErrorMessages, IdentityInfoErrorMessages
from core.utils.help_texts.help_text import FinancialInfoHelpText, IdentityInfoHelpText
from multiselectfield import MultiSelectField

class FinancialInformation(models.Model):
    job = models.CharField(
        _("Job"),
        max_length=100,
        error_messages=IdentityInfoErrorMessages.JOB,
        help_text=IdentityInfoHelpText.JOB,
        default="None",
    )
    current_residence_status = models.CharField(
        _("Current Residence Status"),
        max_length=50,
        choices=FinancialInformationChoices.CURRENT_RESIDENCE_STATUS_CHOICES,
        error_messages=FinancialInformationErrorMessages.CURRENT_RESIDENCE_STATUS_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.CURRENT_RESIDENCE_STATUS
    )
    ownership_status = models.CharField(
        _("Ownership Status"),
        max_length=50,
        choices=FinancialInformationChoices.OWNERSHIP_STATUS_CHOICES,
        error_messages=FinancialInformationErrorMessages.OWNERSHIP_STATUS_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.OWNERSHIP_STATUS
    )
    rent_amount = models.IntegerField(
        _("Rent Amount"),
        blank=True,
        null=True,
        error_messages=FinancialInformationErrorMessages.RENT_AMOUNT_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.RENT_AMOUNT
    )
    mortgage_amount = models.IntegerField(
        _("Mortgage Amount"),
        blank=True,
        null=True,
        error_messages=FinancialInformationErrorMessages.MORTGAGE_AMOUNT_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.MORTGAGE_AMOUNT
    )
    capital = MultiSelectField(
        _("Capital"),
        choices=FinancialInformationChoices.CAPITAL_CHOICES,
        error_messages=FinancialInformationErrorMessages.CAPITAL_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.CAPITAL,
        db_index=True,
    )
    other_captial = models.CharField(
        _("Other Capital"),
        max_length=150,
        error_messages=FinancialInformationErrorMessages.OTHER_CAPTIAL_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.OTHER_CAPITAL,
        db_index=True,
        blank=True,
        null=True,
    )
    after_marriage_residence_status = models.CharField(
        _("After Marriage Residence Status"),
        max_length=50,
        choices= FinancialInformationChoices.AFTER_MARRIAGE_RESIDENCE_STATUS_CHOICES,
        error_messages=FinancialInformationErrorMessages.AFTER_MARRIAGE_RESIDENCE_STATUS_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.AFTER_MARRIAGE_RESIDENCE_STATUS
    )
    ex_spouse_financial_status = models.CharField(
        _("Ex-Spouse Financial Status"),
        choices=FinancialInformationChoices.EX_SPOUSE_FINANCIAL_STATUS_CHOICES,
        error_messages=FinancialInformationErrorMessages.EX_SPOUSE_FINANCIAL_STATUS_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.EX_SPOUSE_FINANCIAL_STATUS
    )
    ex_spouse_financial_pay_status = models.CharField(
        _("Ex-Spouse Financial Pay Status"),
        max_length=50,
        choices=FinancialInformationChoices.EX_SPOUSE_FINANCIAL_PAY_STATUS_CHOICES,
        error_messages=FinancialInformationErrorMessages.EX_SPOUSE_FINANCIAL_PAY_STATUS_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.EX_SPOUSE_FINANCIAL_PAY_STATUS,
    )
    ex_spouse_financial_amount = models.CharField(
        _("Ex-Spouse Financial Amount"),
        max_length=50,
        blank=True,
        null=True,
        error_messages=FinancialInformationErrorMessages.EX_SPOUSE_FINANCIAL_AMOUNT_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.EX_SPOUSE_FINANCIAL_AMOUNT
    )
    dowry_type = MultiSelectField(
        _("Future Spouse Dowry Type"),
        choices=FinancialInformationChoices.DOWRY_TYPE,
        error_messages=FinancialInformationErrorMessages.DOWRY_TYPE_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.DOWRY_TYPE,
        blank=True,
        null=True,
    )
    dowry_amount = models.CharField(
        _("Future Spose Dowry Amount"),
        max_length=50,
        error_messages=FinancialInformationErrorMessages.DOWRY_AMOUNT_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.DOWRY_AMOUNT
    )
    jahiziyeh = models.CharField(
        _("Future Spose Jahiziyeh"),
        choices=FinancialInformationChoices.JAHIZIYEH_CHOICES,
        error_messages=FinancialInformationErrorMessages.JAHIZIYEH_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.JAHIZIYEH,
        blank=True,
        null=True,
    )
    jahiziyeh_explantion = models.CharField(
        _("Future Spose Jahiziyeh Explantion"),
        error_messages=FinancialInformationErrorMessages.JAHIZIYEH_EXPLANTION_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.JAHIZIYEH_EXPLANATION,
        blank=True,
        null=True,
    )
    user = models.OneToOneField(
        'users.User',
        on_delete=models.CASCADE,
        help_text=FinancialInfoHelpText.USER,
        db_index=True,
        related_name="financialinformation"
    )

    def __str__(self):
        return f"اطلاعات کاربر: {self.user.last_name}"

    class Meta:
        verbose_name = _('Financial Information')
        verbose_name_plural = _('Financial Informations')
