from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.exceptions import ValidationError
from users.models import AccessCode
from django.utils.translation import gettext_lazy as _

class LandlineNumberValidator:
    def landline_number_validator(number: str):
        RegexValidator(
            regex=r'^\d{3}-\d{8}$', 
            message=_('Phone number must be in the format XXX-XXXXXXXX.'),
            help_text=_('Enter a valid landline number in the format XXX-XXXXXXXX.'),
            verbose_name=_('Landline Number')
        )

# min and max validator for weight and height
class WeightValidator:
    min_weight_validator = MinValueValidator(
        0, 
        message=_('Weight cannot be negative.'),
    )
    max_weight_validator = MaxValueValidator(
        500, 
        message=_('Weight cannot exceed 500 kg.'),
    )

class HeightValidator:
    min_height_validator = MinValueValidator(
        0, 
        message=_('Height cannot be negative.'),
    )
    max_height_validator = MaxValueValidator(
        300, 
        message=_('Height cannot exceed 300 cm.'),
    )
    


def validate_active_access_code(code):
    # Don't validate if code is None (for updates)
    if code is None:
        return
    
    try:
        access_code = AccessCode.objects.get(code=code)
        if not access_code.active:
            raise ValidationError(
                _("The provided access code is inactive or expired."),
                params={"code": code},
            )
    except AccessCode.DoesNotExist:
        raise ValidationError(
            _("The provided access code does not exist."),
            params={"code": code},
        )
