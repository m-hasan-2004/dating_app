from django.core.exceptions import ValidationError
from users.user_related_models import AccessCode

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
