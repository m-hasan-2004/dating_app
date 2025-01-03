from django.db import models
from core.utils.model_choices import FinancialInformationChoices
from core.utils.model_error_messages import FinancialInformationErrorMessages
from core.utils.help_text import FinancialInfoHelpText
from multiselectfield import MultiSelectField

class FinancialInformation(models.Model):
    current_residence_status = models.CharField(
        max_length=50,
        choices=FinancialInformationChoices.CURRENT_RESIDENCE_STATUS_CHOICES,
        error_messages=FinancialInformationErrorMessages.CURRENT_RESIDENCE_STATUS_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.CURRENT_RESIDENCE_STATUS
    )
    ownership_status = models.CharField(
        max_length=50,
        choices=FinancialInformationChoices.OWNERSHIP_STATUS_CHOICES,
        error_messages=FinancialInformationErrorMessages.OWNERSHIP_STATUS_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.OWNERSHIP_STATUS
    )
    rent_amount = models.IntegerField(
        error_messages=FinancialInformationErrorMessages.RENT_AMOUNT_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.RENT_AMOUNT
    )
    mortgage_amount = models.IntegerField(
        error_messages=FinancialInformationErrorMessages.MORTGAGE_AMOUNT_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.MORTGAGE_AMOUNT
    )
    capital = MultiSelectField(
        choices=FinancialInformationChoices.CAPITAL_CHOICES,
        error_messages=FinancialInformationErrorMessages.CAPITAL_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.CAPITAL
    )
    after_marriage_residence_status = models.CharField(
        max_length=50,
        choices= FinancialInformationChoices.AFTER_MARRIAGE_RESIDENCE_STATUS_CHOICES,
        error_messages=FinancialInformationErrorMessages.AFTER_MARRIAGE_RESIDENCE_STATUS_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.AFTER_MARRIAGE_RESIDENCE_STATUS
    )
    ex_spouse_financial_status = models.CharField(
        max_length=50,
        choices= FinancialInformationChoices.EX_SPOUSE_FINANCIAL_STATUS_CHOICES,
        error_messages=FinancialInformationErrorMessages.EX_SPOUSE_FINANCIAL_STATUS_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.EX_SPOUSE_FINANCIAL_STATUS
    )
    ex_spouse_financial_amount = models.CharField(
        max_length=50,
        error_messages=FinancialInformationErrorMessages.EX_SPOUSE_FINANCIAL_AMOUNT_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.EX_SPOUSE_FINANCIAL_AMOUNT
    )
    ex_spouse_financial_pay_status = models.CharField(
        max_length=50,
        choices=FinancialInformationChoices.EX_SPOUSE_FINANCIAL_PAY_STATUS_CHOICES,
        error_messages=FinancialInformationErrorMessages.EX_SPOUSE_FINANCIAL_PAY_STATUS_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.EX_SPOUSE_FINANCIAL_PAY_STATUS
    )
    dowry_type = MultiSelectField(
        choices=FinancialInformationChoices.DOWRY_TYPE_CHOICES,
        error_messages=FinancialInformationErrorMessages.DOWRY_TYPE_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.DOWRY_TYPE
    )
    dowry_amount = models.CharField(
        max_length=50,
        error_messages=FinancialInformationErrorMessages.DOWRY_AMOUNT_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.DOWRY_AMOUNT
    )
    tocher = models.CharField(
        max_length=50,
        choices=FinancialInformationChoices.TOCHER_CHOICES,
        error_messages=FinancialInformationErrorMessages.TOCHER_ERROR_MESSAGES,
        help_text=FinancialInfoHelpText.TOCHER
    )
    agreement_id = models.UUIDField(
        unique=True,
        help_text=FinancialInfoHelpText.AGREEMENT_ID
    )
    user = models.OneToOneField(
        'users.User',
        on_delete=models.CASCADE,
        help_text=FinancialInfoHelpText.USER
    )

    class Meta:
        verbose_name = 'Financial Information'
        verbose_name_plural = 'Financial Informations'