import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from core.models import SiteSetting
from users.user_related_models import AccessCode

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def regular_user(db):
    code = AccessCode.objects.create()
    user = User.objects.create_user(
        username="reguser",
        email="reg@example.com",
        password="Password123!",
        phone_number="+989121111111",
        access_code=str(code.code),
    )
    return user


@pytest.fixture
def staff_user(db):
    user = User.objects.create_superuser(
        username="staffuser",
        email="staff@example.com",
        password="Password123!",
        phone_number="+989128888888",
    )
    user.is_superuser = False
    user.is_staff = True
    user.save()
    return user


@pytest.fixture
def superuser(db):
    return User.objects.create_superuser(
        username="adminuser",
        email="admin@example.com",
        password="Password123!",
        phone_number="+989129999999",
    )


@pytest.mark.django_db
class TestSiteSettingsAPI:
    def test_singleton_get_settings(self):
        s1 = SiteSetting.get_settings()
        s2 = SiteSetting.get_settings()
        assert s1.id == 1
        assert s2.id == 1
        assert SiteSetting.objects.count() == 1

    def test_public_registration_config_endpoint(self, api_client):
        setting = SiteSetting.get_settings()
        setting.require_access_code = False
        setting.require_email = True
        setting.save()

        res = api_client.get("/api/auth/registration-config/")
        assert res.status_code == status.HTTP_200_OK
        assert res.data["require_access_code"] is False
        assert res.data["require_email"] is True

    def test_site_settings_permissions(self, api_client, regular_user, staff_user, superuser):
        # 1. Anonymous user -> 401
        res = api_client.get("/api/site-settings/")
        assert res.status_code == status.HTTP_401_UNAUTHORIZED

        # 2. Regular user -> 403
        api_client.force_authenticate(user=regular_user)
        res = api_client.get("/api/site-settings/")
        assert res.status_code == status.HTTP_403_FORBIDDEN

        # 3. Staff non-superuser -> 403
        api_client.force_authenticate(user=staff_user)
        res = api_client.get("/api/site-settings/")
        assert res.status_code == status.HTTP_403_FORBIDDEN

        # 4. Superuser -> 200
        api_client.force_authenticate(user=superuser)
        res = api_client.get("/api/site-settings/")
        assert res.status_code == status.HTTP_200_OK
        assert "require_access_code" in res.data
        assert "require_email" in res.data

    def test_site_settings_patch_by_superuser(self, api_client, superuser):
        api_client.force_authenticate(user=superuser)
        res = api_client.patch(
            "/api/site-settings/",
            {"require_access_code": False, "require_email": False},
            format="json",
        )
        assert res.status_code == status.HTTP_200_OK
        assert res.data["require_access_code"] is False
        assert res.data["require_email"] is False
        assert res.data["updated_by_username"] == superuser.username

        # Verify DB updated
        setting = SiteSetting.get_settings()
        assert setting.require_access_code is False
        assert setting.require_email is False


@pytest.mark.django_db
class TestDynamicRegistrationFlow:
    def test_signup_with_access_code_disabled(self, api_client):
        setting = SiteSetting.get_settings()
        setting.require_access_code = False
        setting.require_email = True
        setting.save()

        # Signup payload without access_code
        payload = {
            "username": "autocode_user",
            "email": "autocode@example.com",
            "phone_number": "+989122222222",
            "password": "Password123!",
            "password2": "Password123!",
        }
        res = api_client.post("/api/auth/register/", payload, format="json")
        assert res.status_code == status.HTTP_201_CREATED

        # Verify user was created with a generated access code
        user = User.objects.get(username="autocode_user")
        assert user.access_code is not None
        assert len(user.access_code) > 0

        # Verify the access code exists in DB and is marked inactive (consumed)
        code_obj = AccessCode.objects.get(code=user.access_code)
        assert code_obj.active is False

    def test_signup_with_access_code_enabled_fails_when_omitted(self, api_client):
        setting = SiteSetting.get_settings()
        setting.require_access_code = True
        setting.require_email = True
        setting.save()

        payload = {
            "username": "failcode_user",
            "email": "failcode@example.com",
            "phone_number": "+989123333333",
            "password": "Password123!",
            "password2": "Password123!",
        }
        res = api_client.post("/api/auth/register/", payload, format="json")
        assert res.status_code == status.HTTP_400_BAD_REQUEST
        assert "access_code" in res.data

    def test_signup_with_email_disabled(self, api_client):
        setting = SiteSetting.get_settings()
        setting.require_access_code = False
        setting.require_email = False
        setting.save()

        # Signup payload without email and without access_code
        payload = {
            "username": "noemail_user",
            "phone_number": "+989124444444",
            "password": "Password123!",
            "password2": "Password123!",
        }
        res = api_client.post("/api/auth/register/", payload, format="json")
        assert res.status_code == status.HTTP_201_CREATED

        user = User.objects.get(username="noemail_user")
        assert user.email is None
