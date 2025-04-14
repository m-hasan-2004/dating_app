import pytest
from django.core.exceptions import ValidationError
from users.user_related_models.intellectual_information_model import IntellectualInformation
from users.user_related_models.user_model import User


@pytest.mark.django_db
class TestIntellectualInformationModel:
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
    def valid_intellectual_info_data(self, user):
        """Return valid intellectual information data."""
        return {
            'user': user,
            'marriage_goals': ['family_formation', 'personal_growth'],
            'opinion_woman_job': 'conditional',
            'opinion_woman_job_explanation': 'Must align with family values',
            'political_orientation': 'moderate',
            'religious_orientation': 'practicing',
            'decision_making_choosing_spouse': 'independent',
            'most_important_moral_feature_of_future_spouse': 'honesty',
            'most_important_intellectual_feature_of_future_spouse': 'wisdom',
            'most_important_physical_feature_of_future_spouse': 'health',
            'red_flags_in_spouse': ['dishonesty', 'addiction'],
            'red_flags_explanation': 'These are fundamental trust issues',
            'opinion_about_disabled_veterans': 'positive',
            'opinion_about_disabled_veterans_explanation': 'They deserve respect and support'
        }

    def test_create_intellectual_info(self, valid_intellectual_info_data):
        """Test creating intellectual information with valid data."""
        intellectual_info = IntellectualInformation.objects.create(**valid_intellectual_info_data)
        assert intellectual_info.pk is not None
        assert str(intellectual_info) == f"اطلاعات کاربر: {intellectual_info.user.last_name}"

    def test_marriage_goals_validation(self, valid_intellectual_info_data):
        """Test marriage goals validation."""
        data = valid_intellectual_info_data.copy()
        data['marriage_goals'] = ['invalid_goal']
        
        intellectual_info = IntellectualInformation(**data)
        with pytest.raises(ValidationError) as exc_info:
            intellectual_info.full_clean()
        
        assert "Invalid marriage goal" in str(exc_info.value)

    def test_opinion_woman_job_explanation_required(self, valid_intellectual_info_data):
        """Test that explanation is required for conditional opinion on woman's job."""
        data = valid_intellectual_info_data.copy()
        data.update({
            'opinion_woman_job': 'conditional',
            'opinion_woman_job_explanation': None
        })
        
        intellectual_info = IntellectualInformation(**data)
        with pytest.raises(ValidationError) as exc_info:
            intellectual_info.full_clean()
        
        assert "Explanation is required" in str(exc_info.value)

    def test_red_flags_explanation_required(self, valid_intellectual_info_data):
        """Test that explanation is required when red flags are specified."""
        data = valid_intellectual_info_data.copy()
        data['red_flags_explanation'] = None
        
        intellectual_info = IntellectualInformation(**data)
        with pytest.raises(ValidationError) as exc_info:
            intellectual_info.full_clean()
        
        assert "Red flags explanation is required" in str(exc_info.value)

    def test_disabled_veterans_explanation_required(self, valid_intellectual_info_data):
        """Test that explanation is required for opinion about disabled veterans."""
        data = valid_intellectual_info_data.copy()
        data['opinion_about_disabled_veterans_explanation'] = None
        
        intellectual_info = IntellectualInformation(**data)
        with pytest.raises(ValidationError) as exc_info:
            intellectual_info.full_clean()
        
        assert "Explanation about disabled veterans is required" in str(exc_info.value)

    def test_unique_user_constraint(self, valid_intellectual_info_data):
        """Test that a user can only have one intellectual information record."""
        # Create first intellectual info
        IntellectualInformation.objects.create(**valid_intellectual_info_data)
        
        # Try to create second intellectual info for same user
        with pytest.raises(ValidationError) as exc_info:
            intellectual_info2 = IntellectualInformation(**valid_intellectual_info_data)
            intellectual_info2.full_clean()
        
        assert "already exists" in str(exc_info.value)

    @pytest.mark.parametrize(
        "field,invalid_value,expected_error",
        [
            ('political_orientation', 'invalid', "Invalid political orientation"),
            ('religious_orientation', 'invalid', "Invalid religious orientation"),
            ('decision_making_choosing_spouse', 'invalid', "Invalid decision making choice"),
        ]
    )
    def test_choice_field_validation(self, valid_intellectual_info_data, field, invalid_value, expected_error):
        """Test validation of choice fields."""
        data = valid_intellectual_info_data.copy()
        data[field] = invalid_value
        
        intellectual_info = IntellectualInformation(**data)
        with pytest.raises(ValidationError) as exc_info:
            intellectual_info.full_clean()
        
        assert expected_error in str(exc_info.value) 