import pytest
from django.core.exceptions import ValidationError
from users.user_related_models.physical_information_model import PhysicalInformation
from users.user_related_models.user_model import User


@pytest.mark.django_db
class TestPhysicalInformationModel:
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
    def valid_physical_info_data(self, user):
        """Return valid physical information data."""
        return {
            'user': user,
            'height': 175,
            'weight': 70,
            'face_type': 'normal',
            'skin_color': 'white',
            'eye_color': 'brown',
            'hair_color': 'black',
            'hair_type': 'straight',
            'hair_loss': 'no',
            'beard_type': 'normal',
            'physical_health': 'healthy',
            'disability_type': 'none',
            'disability_description': None,
            'blood_type': 'O+',
            'glasses': 'no',
            'face_cosmetic_surgery': 'no',
            'body_cosmetic_surgery': 'no',
            'cosmetic_surgery_description': None,
        }

    def test_create_physical_info(self, valid_physical_info_data):
        """Test creating physical information with valid data."""
        physical_info = PhysicalInformation.objects.create(**valid_physical_info_data)
        assert physical_info.pk is not None
        assert str(physical_info) == f"اطلاعات کاربر: {physical_info.user.last_name}"

    @pytest.mark.parametrize(
        "field,value,expected_error",
        [
            ('height', 0, "Height must be between"),
            ('height', 300, "Height must be between"),
            ('weight', 0, "Weight must be between"),
            ('weight', 500, "Weight must be between"),
        ]
    )
    def test_measurement_validation_errors(self, valid_physical_info_data, field, value, expected_error):
        """Test validation errors for height and weight measurements."""
        data = valid_physical_info_data.copy()
        data[field] = value
        
        physical_info = PhysicalInformation(**data)
        with pytest.raises(ValidationError) as exc_info:
            physical_info.full_clean()
        
        assert expected_error in str(exc_info.value)

    def test_disability_description_validation(self, valid_physical_info_data):
        """Test disability description validation."""
        data = valid_physical_info_data.copy()
        data.update({
            'physical_health': 'disabled',
            'disability_type': 'other',
            'disability_description': None
        })
        
        physical_info = PhysicalInformation(**data)
        with pytest.raises(ValidationError) as exc_info:
            physical_info.full_clean()
        
        assert "Disability description is required" in str(exc_info.value)

    def test_cosmetic_surgery_description_validation(self, valid_physical_info_data):
        """Test cosmetic surgery description validation."""
        data = valid_physical_info_data.copy()
        data.update({
            'face_cosmetic_surgery': 'yes',
            'cosmetic_surgery_description': None
        })
        
        physical_info = PhysicalInformation(**data)
        with pytest.raises(ValidationError) as exc_info:
            physical_info.full_clean()
        
        assert "Cosmetic surgery description is required" in str(exc_info.value)

    def test_unique_user_constraint(self, valid_physical_info_data, user):
        """Test that a user can only have one physical information record."""
        # Create first physical info
        PhysicalInformation.objects.create(**valid_physical_info_data)
        
        # Try to create second physical info for same user
        with pytest.raises(ValidationError) as exc_info:
            physical_info2 = PhysicalInformation(**valid_physical_info_data)
            physical_info2.full_clean()
        
        assert "already exists" in str(exc_info.value)

    def test_beard_type_validation(self, valid_physical_info_data, user):
        """Test beard type validation based on user gender."""
        # Create a female user
        female_user = User.objects.create_user(
            username="testfemale",
            email="female@example.com",
            password="testpass123",
            phone_number="+989123456788",
            gender='F'
        )
        
        data = valid_physical_info_data.copy()
        data['user'] = female_user
        data['beard_type'] = 'normal'
        
        physical_info = PhysicalInformation(**data)
        with pytest.raises(ValidationError) as exc_info:
            physical_info.full_clean()
        
        assert "Beard type should not be specified for female users" in str(exc_info.value) 