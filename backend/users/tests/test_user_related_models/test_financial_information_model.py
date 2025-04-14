import pytest
from django.core.exceptions import ValidationError
from users.user_related_models.financial_information import FinancialInformation
from users.user_related_models.user_model import User


@pytest.mark.django_db
class TestFinancialInformationModel:
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
    def valid_financial_info_data(self, user):
        """Return valid financial information data."""
        return {
            'user': user,
            'job': 'Software Engineer',
            'current_residence_status': 'rental',
            'ownership_status': 'personal',
            'rent_amount': '2000000',
            'capital': ['house', 'car'],
            'after_marriage_residence_status': 'personal_house',
            'ex_spouse_financial_status': 'no_financial_relation',
            'ex_spouse_financial_pay_status': 'no_payment',
            'dowry_type': ['gold', 'cash'],
            'dowry_amount': '114',
        }

    def test_create_financial_info(self, valid_financial_info_data):
        """Test creating financial information with valid data."""
        financial_info = FinancialInformation.objects.create(**valid_financial_info_data)
        assert financial_info.pk is not None
        assert str(financial_info) == f"اطلاعات کاربر: {financial_info.user.last_name}"

    @pytest.mark.parametrize(
        "field,value,expected_error",
        [
            ('rent_amount', 'invalid', "Invalid amount format"),
            ('mortgage_amount', 'invalid', "Invalid amount format"),
            ('ex_spouse_financial_amount', 'invalid', "Invalid amount format"),
            ('dowry_amount', 'invalid', "Invalid amount format"),
        ]
    )
    def test_amount_validation_errors(self, valid_financial_info_data, field, value, expected_error):
        """Test validation errors for amount fields."""
        data = valid_financial_info_data.copy()
        data[field] = value
        
        financial_info = FinancialInformation(**data)
        with pytest.raises(ValidationError) as exc_info:
            financial_info.full_clean()
        
        assert expected_error in str(exc_info.value)

    def test_rent_mortgage_validation(self, valid_financial_info_data):
        """Test rent and mortgage validation."""
        data = valid_financial_info_data.copy()
        data.update({
            'current_residence_status': 'rental',
            'rent_amount': None
        })
        
        financial_info = FinancialInformation(**data)
        with pytest.raises(ValidationError) as exc_info:
            financial_info.full_clean()
        
        assert "Rent amount is required" in str(exc_info.value)

    def test_jahiziyeh_validation(self, valid_financial_info_data):
        """Test jahiziyeh validation."""
        data = valid_financial_info_data.copy()
        data.update({
            'jahiziyeh': 'other',
            'jahiziyeh_explantion': None
        })
        
        financial_info = FinancialInformation(**data)
        with pytest.raises(ValidationError) as exc_info:
            financial_info.full_clean()
        
        assert "Jahiziyeh explanation is required" in str(exc_info.value)

    def test_ex_spouse_financial_validation(self, valid_financial_info_data):
        """Test ex-spouse financial validation."""
        data = valid_financial_info_data.copy()
        data.update({
            'ex_spouse_financial_status': 'has_financial_relation',
            'ex_spouse_financial_pay_status': 'monthly_payment',
            'ex_spouse_financial_amount': None
        })
        
        financial_info = FinancialInformation(**data)
        with pytest.raises(ValidationError) as exc_info:
            financial_info.full_clean()
        
        assert "Ex-spouse financial amount is required" in str(exc_info.value)

    def test_unique_user_constraint(self, valid_financial_info_data, user):
        """Test that a user can only have one financial information record."""
        # Create first financial info
        FinancialInformation.objects.create(**valid_financial_info_data)
        
        # Try to create second financial info for same user
        with pytest.raises(ValidationError) as exc_info:
            financial_info2 = FinancialInformation(**valid_financial_info_data)
            financial_info2.full_clean()
        
        assert "already exists" in str(exc_info.value) 