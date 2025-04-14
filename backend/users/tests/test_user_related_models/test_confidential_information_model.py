import pytest
from django.core.exceptions import ValidationError
from users.user_related_models.confidintional_information_model import (
    IdentityInformation,
    BirthCertificateInformation,
    IntroducedSubjectsInformation
)
from users.user_related_models.user_model import User
from django.core.files.uploadedfile import SimpleUploadedFile
from datetime import date


@pytest.mark.django_db
class TestIdentityInformationModel:
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
    def valid_identity_info_data(self, user):
        """Return valid identity information data."""
        return {
            'user': user,
            'first_name': 'John',
            'last_name': 'Doe',
            'father_name': 'Michael',
            'eitta_number': '+989123456788',
            'landline_phone': '02112345678',
            'mother_phone': '+989123456787',
            'father_phone': '+989123456786',
            'home_address': 'Test Address 123',
            'work_address': 'Work Address 456',
            'originality': 'Tehran',
            'education': 'bachelors',
            'job': 'Software Engineer',
            'insurance': 'social_security',
            'income': '10_to_15',
            'assets': ['house', 'car'],
            'weight': 75.5,
            'height': 180.0,
            'prefered_meeting_time': 'Evenings after 6 PM',
            'type_of_payment': 'cash',
        }

    def test_create_identity_info(self, valid_identity_info_data):
        """Test creating identity information with valid data."""
        identity_info = IdentityInformation.objects.create(**valid_identity_info_data)
        assert identity_info.pk is not None
        assert str(identity_info) == identity_info.last_name

    def test_phone_number_validation(self, valid_identity_info_data):
        """Test phone number validation."""
        data = valid_identity_info_data.copy()
        data['eitta_number'] = 'invalid'
        
        identity_info = IdentityInformation(**data)
        with pytest.raises(ValidationError):
            identity_info.full_clean()

    def test_landline_validation(self, valid_identity_info_data):
        """Test landline phone validation."""
        data = valid_identity_info_data.copy()
        data['landline_phone'] = '123'  # Invalid format
        
        identity_info = IdentityInformation(**data)
        with pytest.raises(ValidationError):
            identity_info.full_clean()

    def test_measurement_validation(self, valid_identity_info_data):
        """Test height and weight validation."""
        data = valid_identity_info_data.copy()
        data['height'] = 0
        
        identity_info = IdentityInformation(**data)
        with pytest.raises(ValidationError):
            identity_info.full_clean()

    def test_payment_proof_validation(self, valid_identity_info_data):
        """Test payment proof file validation."""
        data = valid_identity_info_data.copy()
        invalid_file = SimpleUploadedFile(
            "test.txt",
            b"invalid file content",
            content_type="text/plain"
        )
        data['payment_proof'] = invalid_file
        
        identity_info = IdentityInformation(**data)
        with pytest.raises(ValidationError):
            identity_info.full_clean()


@pytest.mark.django_db
class TestBirthCertificateInformationModel:
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
    def valid_birth_certificate_data(self, user):
        """Return valid birth certificate information data."""
        return {
            'user': user,
            'national_code': '1234567890',
            'birth_certificate_serial': 'ABC123',
            'birth_certificate_location': 'Tehran',
            'marriage_experince': 'never_married',
            'marriage_status': 'single',
            'birth_date': date(1990, 1, 1),
            'children': []
        }

    def test_create_birth_certificate_info(self, valid_birth_certificate_data):
        """Test creating birth certificate information with valid data."""
        birth_info = BirthCertificateInformation.objects.create(**valid_birth_certificate_data)
        assert birth_info.pk is not None
        assert str(birth_info) == f"اطلاعات کاربر: {birth_info.user.last_name}"

    def test_national_code_validation(self, valid_birth_certificate_data):
        """Test national code validation."""
        data = valid_birth_certificate_data.copy()
        data['national_code'] = '123'  # Invalid length
        
        birth_info = BirthCertificateInformation(**data)
        with pytest.raises(ValidationError):
            birth_info.full_clean()

    def test_marriage_date_validation(self, valid_birth_certificate_data):
        """Test marriage date validation."""
        data = valid_birth_certificate_data.copy()
        data.update({
            'marriage_status': 'married',
            'marriage_date': None
        })
        
        birth_info = BirthCertificateInformation(**data)
        with pytest.raises(ValidationError):
            birth_info.full_clean()

    def test_children_custody_validation(self, valid_birth_certificate_data):
        """Test children custody validation."""
        data = valid_birth_certificate_data.copy()
        data.update({
            'children': ['son'],
            'children_custody': None
        })
        
        birth_info = BirthCertificateInformation(**data)
        with pytest.raises(ValidationError):
            birth_info.full_clean()


@pytest.mark.django_db
class TestIntroducedSubjectsInformationModel:
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
    def valid_introduced_subjects_data(self, user):
        """Return valid introduced subjects information data."""
        return {
            'user': user,
            'username': 'test_subject',
            'birth_date': date(1990, 1, 1),
            'marriage_status': 'single',
            'postive': True,
            'negative': False,
            'reason': 'Compatible personalities and goals',
            'dates_of_meetings': '2023-01-01: First meeting\n2023-01-15: Second meeting',
            'result_and_regards': 'Positive outcome, proceeding with next steps',
            'cost_of_introduction': '1000000',
            'cost_of_meeting': '500000'
        }

    def test_create_introduced_subjects_info(self, valid_introduced_subjects_data):
        """Test creating introduced subjects information with valid data."""
        subjects_info = IntroducedSubjectsInformation.objects.create(**valid_introduced_subjects_data)
        assert subjects_info.pk is not None
        assert str(subjects_info) == subjects_info.username

    def test_username_validation(self, valid_introduced_subjects_data):
        """Test username validation."""
        data = valid_introduced_subjects_data.copy()
        data['username'] = 'a'  # Too short
        
        subjects_info = IntroducedSubjectsInformation(**data)
        with pytest.raises(ValidationError):
            subjects_info.full_clean()

    def test_positive_negative_validation(self, valid_introduced_subjects_data):
        """Test positive/negative validation."""
        data = valid_introduced_subjects_data.copy()
        data.update({
            'postive': True,
            'negative': True  # Cannot be both true
        })
        
        subjects_info = IntroducedSubjectsInformation(**data)
        with pytest.raises(ValidationError):
            subjects_info.full_clean()

    def test_cost_validation(self, valid_introduced_subjects_data):
        """Test cost validation."""
        data = valid_introduced_subjects_data.copy()
        data['cost_of_introduction'] = 'invalid'
        
        subjects_info = IntroducedSubjectsInformation(**data)
        with pytest.raises(ValidationError):
            subjects_info.full_clean()

    def test_dates_of_meetings_validation(self, valid_introduced_subjects_data):
        """Test dates of meetings validation."""
        data = valid_introduced_subjects_data.copy()
        data['dates_of_meetings'] = 'invalid format'
        
        subjects_info = IntroducedSubjectsInformation(**data)
        with pytest.raises(ValidationError):
            subjects_info.full_clean() 