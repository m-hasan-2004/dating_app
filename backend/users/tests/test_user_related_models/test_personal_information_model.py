import pytest
from django.core.exceptions import ValidationError
from django.utils import timezone
from users.user_related_models.personal_information_model import PersonalInformation
from users.user_related_models.user_model import User


@pytest.mark.django_db
class TestPersonalInformationModel:
    @pytest.fixture
    def user(self):
        """Create a test user."""
        return User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123",
            phone_number="+989123456789"
        )

    @pytest.fixture
    def valid_personal_info_data(self, user):
        """Return valid personal information data."""
        return {
            'user': user,
            'gender': 'male',
            'sadat': False,
            'birth_date': timezone.now().date() - timezone.timedelta(days=365*20),  # 20 years ago
            'birth_location': 'Tehran',
            'education': 'bachelor',
            'degree': 'Computer Science',
            'military_status': 'completed',
            'income': '10_to_20',
            'deposit': '100_to_200',
            'have_insurance': True,
            'insurance_type': ['social_security'],
            'insurance_years': 2,
            'leisure_type': ['sports', 'reading'],
            'usage_cases': ['marriage'],
            'tatoo': False,
            'conviction_or_arrest_history': False,
        }

    def test_create_personal_info(self, valid_personal_info_data):
        """Test creating personal information with valid data."""
        personal_info = PersonalInformation.objects.create(**valid_personal_info_data)
        assert personal_info.pk is not None
        assert str(personal_info) == f"اطلاعات کاربر: {personal_info.user.last_name}"

    @pytest.mark.parametrize(
        "field,value,expected_error",
        [
            ('birth_date', timezone.now().date(), "at least 18 years old"),
            ('birth_date', timezone.now().date() - timezone.timedelta(days=365*101), "cannot exceed 100 years"),
            ('military_status', 'exempt_permanent', "explanation is required"),
            ('tatoo', True, "description is required"),
            ('conviction_or_arrest_history', True, "reason is required"),
        ]
    )
    def test_validation_errors(self, valid_personal_info_data, field, value, expected_error):
        """Test validation errors for various fields."""
        data = valid_personal_info_data.copy()
        data[field] = value
        
        personal_info = PersonalInformation(**data)
        with pytest.raises(ValidationError) as exc_info:
            personal_info.full_clean()
        
        assert expected_error in str(exc_info.value)

    def test_insurance_validation(self, valid_personal_info_data):
        """Test insurance-related validations."""
        # Test when have_insurance is False but insurance_type is provided
        data = valid_personal_info_data.copy()
        data['have_insurance'] = False
        data['insurance_type'] = ['social_security']
        
        personal_info = PersonalInformation(**data)
        with pytest.raises(ValidationError) as exc_info:
            personal_info.full_clean()
        
        assert "insurance" in str(exc_info.value)

    def test_usage_cases_validation(self, valid_personal_info_data):
        """Test usage cases validation."""
        # Test when 'other' is selected but no description is provided
        data = valid_personal_info_data.copy()
        data['usage_cases'] = ['marriage', 'other']
        
        personal_info = PersonalInformation(**data)
        with pytest.raises(ValidationError) as exc_info:
            personal_info.full_clean()
        
        assert "description is required" in str(exc_info.value)

    def test_military_status_validation(self, valid_personal_info_data):
        """Test military status validation."""
        data = valid_personal_info_data.copy()
        data['military_status'] = 'exempt_permanent'
        data['military_status_explanation'] = None
        
        personal_info = PersonalInformation(**data)
        with pytest.raises(ValidationError) as exc_info:
            personal_info.full_clean()
        
        assert "Military status explanation is required" in str(exc_info.value)

    def test_conviction_history_validation(self, valid_personal_info_data):
        """Test conviction history validation."""
        data = valid_personal_info_data.copy()
        data['conviction_or_arrest_history'] = True
        data['conviction_reason'] = None
        
        personal_info = PersonalInformation(**data)
        with pytest.raises(ValidationError) as exc_info:
            personal_info.full_clean()
        
        assert "Conviction reason is required" in str(exc_info.value)

    def test_unique_user_constraint(self, valid_personal_info_data, user):
        """Test that a user can only have one personal information record."""
        # Create first personal info
        PersonalInformation.objects.create(**valid_personal_info_data)
        
        # Try to create second personal info for same user
        with pytest.raises(ValidationError) as exc_info:
            personal_info2 = PersonalInformation(**valid_personal_info_data)
            personal_info2.full_clean()
        
        assert "already exists" in str(exc_info.value) 