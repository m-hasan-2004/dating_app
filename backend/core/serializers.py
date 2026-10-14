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
            "site_name_fa",
            "site_name_en",
            "color_palette",
            "logo_url",
            "updated_at",
            "updated_by",
            "updated_by_username",
        )
        read_only_fields = ("id", "updated_at", "updated_by", "updated_by_username")


class PublicRegistrationConfigSerializer(serializers.Serializer):
    """
    Publicly exposed registration & branding configuration for frontend apps and signup forms.
    """

    require_access_code = serializers.BooleanField()
    require_email = serializers.BooleanField()
    site_name_fa = serializers.CharField(default="همسان‌گزینی")
    site_name_en = serializers.CharField(default="Matrimonial")
    color_palette = serializers.CharField(default="brand")
    logo_url = serializers.CharField(default="", allow_blank=True, allow_null=True)

