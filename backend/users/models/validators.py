from django.core.validators import RegexValidator

class LandlineNumberValidator:
    def landline_number_validator(number: str):
        RegexValidator(regex=r'^\d{3}-\d{8}$',message='Phone number must be in the format XXX-XXXXXXXX.')
    
# min and max validator for weight and height