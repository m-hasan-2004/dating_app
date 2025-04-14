import pytest
from django.core.exceptions import ValidationError
from django.utils import timezone
from users.user_related_models.user_model import User
from users.user_related_models.access_code_model import AccessCode


@pytest.mark.django_db
class TestUserModel:
    def test_create_user(self, django_user_model):
        """Test creating a regular user."""
        # Create an access code first
        access_code = AccessCode.objects.create(code="TEST123", active=True)
        
        user = django_user_model.objects.create_user(
            username="testuser",
            email="test@example.com",
            access_code="TEST123",
            password="testpass123"
        )
        
        assert user.username == "testuser"
        assert user.email == "test@example.com"
        assert user.access_code == "TEST123"
        assert not user.is_staff
        assert not user.is_superuser
        assert user.is_active
        
        # Check that access code is marked as used
        access_code.refresh_from_db()
        assert not access_code.active

    def test_create_superuser(self, django_user_model):
        """Test creating a superuser."""
        user = django_user_model.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="admin123"
        )
        
        assert user.username == "admin"
        assert user.email == "admin@example.com"
        assert user.is_staff
        assert user.is_superuser
        assert user.is_active

    def test_user_str_method(self, django_user_model):
        """Test the string representation of a user."""
        user = django_user_model.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        assert str(user) == "testuser"

    @pytest.mark.parametrize(
        "username,email,password,access_code,expected_error",
        [
            ("", "test@example.com", "pass123", "TEST123", "Username"),  # Empty username
            ("test", "", "pass123", "TEST123", "Email"),  # Empty email
            ("test", "invalid-email", "pass123", "TEST123", "Enter a valid email"),  # Invalid email
            ("te", "test@example.com", "pass123", "TEST123", "at least 3 characters"),  # Short username
            ("test" * 50, "test@example.com", "pass123", "TEST123", "not exceed 150"),  # Long username
        ]
    )
    def test_user_validation_errors(self, django_user_model, username, email, password, 
                                  access_code, expected_error):
        """Test user validation errors."""
        with pytest.raises(ValidationError) as exc_info:
            user = django_user_model(
                username=username,
                email=email,
                password=password,
                access_code=access_code
            )
            user.full_clean()
        
        assert expected_error in str(exc_info.value)

    def test_dates_validation(self, django_user_model):
        """Test date validation logic."""
        future_date = timezone.now() + timezone.timedelta(days=1)
        
        user = django_user_model(
            username="testuser",
            email="test@example.com",
            password="testpass123",
            date_joined=future_date
        )
        
        with pytest.raises(ValidationError) as exc_info:
            user.full_clean()
        
        assert "date" in str(exc_info.value)

    def test_middle_man_code_validation(self, django_user_model):
        """Test middle man code validation."""
        long_code = "x" * 101  # Exceeds max_length of 100
        
        user = django_user_model(
            username="testuser",
            email="test@example.com",
            password="testpass123",
            middle_man_code=long_code
        )
        
        with pytest.raises(ValidationError) as exc_info:
            user.full_clean()
        
        assert "Middle man code" in str(exc_info.value)

    def test_phone_number_validation(self, django_user_model):
        """Test phone number validation."""
        user = django_user_model(
            username="testuser",
            email="test@example.com",
            password="testpass123",
            phone_number="invalid-number"
        )
        
        with pytest.raises(ValidationError) as exc_info:
            user.full_clean()
        
        assert "Phone" in str(exc_info.value)

    def test_unique_constraints(self, django_user_model):
        """Test unique constraints on username and phone number."""
        # Create first user
        user1 = django_user_model.objects.create_user(
            username="testuser",
            email="test1@example.com",
            password="testpass123",
            phone_number="+989123456789"
        )
        
        # Try to create second user with same username
        with pytest.raises(ValidationError) as exc_info:
            user2 = django_user_model(
                username="testuser",  # Same username
                email="test2@example.com",
                password="testpass123",
                phone_number="+989123456780"
            )
            user2.full_clean()
        
        assert "username" in str(exc_info.value)
        
        # Try to create third user with same phone number
        with pytest.raises(ValidationError) as exc_info:
            user3 = django_user_model(
                username="testuser2",
                email="test3@example.com",
                password="testpass123",
                phone_number="+989123456789"  # Same phone number
            )
            user3.full_clean()
        
        assert "phone" in str(exc_info.value) 