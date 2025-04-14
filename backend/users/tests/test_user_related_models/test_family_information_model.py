import pytest
from django.core.exceptions import ValidationError
from users.user_related_models.family_information_model import (
    FamilyInformation,
    EngagementOrWeddingStatus,
    ExHusbandChildStatus,
    Sister,
    Brother,
    Groom,
    BrideOrWife,
    Mother,
    Father
)
from users.user_related_models.user_model import User
from datetime import date


@pytest.mark.django_db
class TestFamilyInformationModel:
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
    def valid_family_info_data(self, user):
        """Return valid family information data."""
        return {
            'user': user,
            'average_family_education': 'bachelors',
            'average_family_finance': 'good',
            'family_divorce_history': False,
            'family_divorce_reason': None,
            'contact_with_family': 'Regular weekly visits',
            'contact_with_relatives': 'Monthly gatherings',
            'kids': 'no_kids'
        }

    def test_create_family_info(self, valid_family_info_data):
        """Test creating family information with valid data."""
        family_info = FamilyInformation.objects.create(**valid_family_info_data)
        assert family_info.pk is not None
        assert str(family_info) == f"اطلاعات کاربر: {family_info.user.last_name}"

    def test_divorce_history_validation(self, valid_family_info_data):
        """Test divorce history validation."""
        data = valid_family_info_data.copy()
        data.update({
            'family_divorce_history': True,
            'family_divorce_reason': None
        })
        
        family_info = FamilyInformation(**data)
        with pytest.raises(ValidationError):
            family_info.full_clean()

    def test_contact_validation(self, valid_family_info_data):
        """Test contact validation."""
        data = valid_family_info_data.copy()
        data['contact_with_family'] = 'a' * 151  # Exceeds max length
        
        family_info = FamilyInformation(**data)
        with pytest.raises(ValidationError):
            family_info.full_clean()


@pytest.mark.django_db
class TestEngagementOrWeddingStatusModel:
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
    def valid_engagement_status_data(self, user):
        """Return valid engagement/wedding status data."""
        return {
            'user': user,
            'status': 'engaged',
            'contract_length': '6 months',
            'living_length': None,
            'death_date': None,
            'divorce_date': None,
            'reason_for_divorce_or_death': None
        }

    def test_create_engagement_status(self, valid_engagement_status_data):
        """Test creating engagement status with valid data."""
        status = EngagementOrWeddingStatus.objects.create(**valid_engagement_status_data)
        assert status.pk is not None
        assert str(status) == f"اطلاعات کاربر: {status.user.last_name}"


@pytest.mark.django_db
class TestParentModels:
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
    def valid_parent_data(self, user):
        """Return valid parent data."""
        return {
            'user': user,
            'language': 'Persian',
            'birth_date': date(1960, 1, 1),
            'job': 'Teacher',
            'originality': 'tehran',
            'education': 'bachelors',
            'alive': True,
            'death_date': None
        }

    def test_create_mother(self, valid_parent_data):
        """Test creating mother information."""
        mother = Mother.objects.create(**valid_parent_data)
        assert mother.pk is not None
        assert str(mother) == f"اطلاعات کاربر: {mother.user.last_name}"

    def test_create_father(self, valid_parent_data):
        """Test creating father information."""
        father = Father.objects.create(**valid_parent_data)
        assert father.pk is not None
        assert str(father) == f"اطلاعات کاربر: {father.user.last_name}"

    def test_parent_death_date_validation(self, valid_parent_data):
        """Test parent death date validation."""
        data = valid_parent_data.copy()
        data.update({
            'alive': False,
            'death_date': None
        })
        
        mother = Mother(**data)
        with pytest.raises(ValidationError):
            mother.full_clean()


@pytest.mark.django_db
class TestFamilyMemberModels:
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
    def valid_family_member_data(self, user):
        """Return valid family member data."""
        return {
            'user': user,
            'status': True,
            'education': 'bachelors',
            'job': 'Engineer'
        }

    def test_create_sister(self, valid_family_member_data):
        """Test creating sister information."""
        sister = Sister.objects.create(**valid_family_member_data)
        assert sister.pk is not None
        assert str(sister) == f"اطلاعات کاربر: {sister.user.last_name}"

    def test_create_brother(self, valid_family_member_data):
        """Test creating brother information."""
        brother = Brother.objects.create(**valid_family_member_data)
        assert brother.pk is not None
        assert str(brother) == f"اطلاعات کاربر: {brother.user.last_name}"

    def test_create_groom(self, valid_family_member_data):
        """Test creating groom information."""
        data = valid_family_member_data.copy()
        data['groom_or'] = 'groom'
        groom = Groom.objects.create(**data)
        assert groom.pk is not None
        assert str(groom) == f"اطلاعات کاربر: {groom.user.last_name}"

    def test_create_bride_or_wife(self, valid_family_member_data):
        """Test creating bride/wife information."""
        data = valid_family_member_data.copy()
        data['bride_or'] = 'bride'
        bride = BrideOrWife.objects.create(**data)
        assert bride.pk is not None
        assert str(bride) == f"اطلاعات کاربر: {bride.user.last_name}"


@pytest.mark.django_db
class TestExHusbandChildStatusModel:
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
    def valid_child_status_data(self, user):
        """Return valid ex-husband child status data."""
        return {
            'user': user,
            'gender': 'M',
            'status': True,
            'birth_date': date(2015, 1, 1),
            'custody': 'Father',
            'living_location': 'With father'
        }

    def test_create_child_status(self, valid_child_status_data):
        """Test creating child status with valid data."""
        child_status = ExHusbandChildStatus.objects.create(**valid_child_status_data)
        assert child_status.pk is not None
        assert str(child_status) == f"اطلاعات کاربر: {child_status.user.last_name}"

    def test_birth_date_validation(self, valid_child_status_data):
        """Test birth date validation."""
        data = valid_child_status_data.copy()
        data['birth_date'] = date(2050, 1, 1)  # Future date
        
        child_status = ExHusbandChildStatus(**data)
        with pytest.raises(ValidationError):
            child_status.full_clean()

    def test_living_location_validation(self, valid_child_status_data):
        """Test living location validation."""
        data = valid_child_status_data.copy()
        data['living_location'] = 'a' * 51  # Exceeds max length
        
        child_status = ExHusbandChildStatus(**data)
        with pytest.raises(ValidationError):
            child_status.full_clean() 