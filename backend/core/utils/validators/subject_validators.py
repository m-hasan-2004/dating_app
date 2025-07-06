from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_account_number(value):
    """
    Validate account number format.
    Account number should be between 10 to 40 digits.
    """
    if not value.isdigit():
        raise ValidationError(
            _('Account number must contain only digits.')
        )
    if len(value) < 10 or len(value) > 40:
        raise ValidationError(
            _('Account number must be between 10 to 40 digits.')
        )


def validate_bank_name(value):
    """
    Validate bank name.
    Only letters, spaces, and hyphens are allowed.
    """
    if not all(c.isalpha() or c.isspace() or c == '-' for c in value):
        raise ValidationError(
            _('Bank name can only contain letters, spaces, and hyphens.')
        )


def validate_amount(value):
    """
    Validate amount format.
    Should be a positive number with optional decimal places.
    """
    try:
        amount = float(value)
        if amount <= 0:
            raise ValidationError(
                _('Amount must be a positive number.')
            )
    except (ValueError, TypeError):
        raise ValidationError(
            _('Please enter a valid amount.')
        )
