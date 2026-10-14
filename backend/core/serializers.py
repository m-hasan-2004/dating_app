from rest_framework import serializers
from .models import SiteSetting


class SiteSettingSerializer(serializers.ModelSerializer):
    """
    Serializer for superadmin site configuration.
    """

    updated_by_username = serializers.CharField(
        source="updated_by.username", read_only=True, default=None
    )

    class Meta:
        model = SiteSetting
        fields = (
            "id",
            "require_access_code",
            "require_email",
            "updated_at",
            "updated_by",
            "updated_by_username",
        )
        read_only_fields = ("id", "updated_at", "updated_by", "updated_by_username")


class PublicRegistrationConfigSerializer(serializers.Serializer):
    """
    Publicly exposed registration configuration for signup forms.
    """

    require_access_code = serializers.BooleanField()
    require_email = serializers.BooleanField()
