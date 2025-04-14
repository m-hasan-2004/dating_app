import pytest
from django.core.exceptions import ValidationError
from django.utils import timezone
from users.user_related_models.access_code_model import AccessCode


@pytest.mark.django_db
class TestAccessCodeModel:
    def test_create_access_code(self):
        """Test creating an access code."""
        access_code = AccessCode.objects.create()
        assert access_code.pk is not None
        assert access_code.active is True
        assert isinstance(access_code.code, str)

    def test_access_code_str_method(self):
        """Test the string representation of an access code."""
        access_code = AccessCode.objects.create()
        assert str(access_code) == f"Access Code: {str(access_code.code)}"

    def test_access_code_manager_generate_code(self, user):
        """Test the generate_code manager method."""
        access_code = AccessCode.objects.generate_code(user)
        assert access_code.pk is not None
        assert access_code.active is True

    def test_access_code_manager_validate_code(self, user):
        """Test the validate_code manager method."""
        access_code = AccessCode.objects.create()
        
        # Test with valid code
        validated_code = AccessCode.objects.validate_code(user, access_code.code)
        assert validated_code is not None
        assert validated_code.code == access_code.code

        # Test with invalid code
        invalid_code = "invalid-code"
        validated_code = AccessCode.objects.validate_code(user, invalid_code)
        assert validated_code is None

    def test_access_code_manager_expire_code(self):
        """Test the expire_code manager method."""
        access_code = AccessCode.objects.create()
        assert access_code.active is True
        assert access_code.date_used is None

        AccessCode.objects.expire_code(access_code)
        access_code.refresh_from_db()
        
        assert access_code.active is False
        assert access_code.date_used is not None 