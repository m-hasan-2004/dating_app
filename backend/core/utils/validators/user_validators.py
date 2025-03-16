from django.core.validators import RegexValidator
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.utils.translation import gettext_lazy as _

class ConfidentialInfoValidator:
    landline_number_validator = RegexValidator(
            regex=r'^\d{3}-\d{8}$', 
            message=_('Landline number must be in the format XXX-XXXXXXXX.'),
    )