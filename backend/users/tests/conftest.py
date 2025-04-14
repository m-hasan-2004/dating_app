import pytest
from django.utils import timezone
from users.user_related_models.user_model import User
from users.user_related_models.access_code_model import AccessCode


@pytest.fixture
def access_code():
    """Create a test access code."""
    return AccessCode.objects.create(code="TEST123", active=True)


@pytest.fixture
def user(access_code):
    """Create a test user with access code."""
    return User.objects.create_user(
        username="testuser",
        email="test@example.com",
        password="testpass123",
        access_code=access_code.code,
        phone_number="+989123456789"
    )


@pytest.fixture
def superuser():
    """Create a test superuser."""
    return User.objects.create_superuser(
        username="admin",
        email="admin@example.com",
        password="admin123"
    )


@pytest.fixture
def future_date():
    """Return a future date."""
    return timezone.now() + timezone.timedelta(days=1)


@pytest.fixture
def past_date():
    """Return a past date."""
    return timezone.now() - timezone.timedelta(days=365*20)  # 20 years ago 