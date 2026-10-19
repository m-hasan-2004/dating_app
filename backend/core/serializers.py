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
            "enable_language_switcher",
            "enable_identity_and_birth_cert",
            "enable_nextjs_toolbar",
            "site_name_fa",
            "site_name_en",
            "site_tagline_fa",
            "site_tagline_en",
            "color_palette",
            "custom_primary_color",
            "custom_secondary_color",
            "canvas_light_color",
            "canvas_dark_color",
            "logo_url",
            "favicon_url",
            "font_family",
            "custom_font_data",
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
    enable_language_switcher = serializers.BooleanField(default=True)
    enable_identity_and_birth_cert = serializers.BooleanField(default=True)
    enable_nextjs_toolbar = serializers.BooleanField(default=True)
    site_name_fa = serializers.CharField(default="سامانه همسان‌گزینی و ازدواج دائم")
    site_name_en = serializers.CharField(default="TailAdmin Matchmaking")
    site_tagline_fa = serializers.CharField(default="پورتال همسان‌گزینی", allow_blank=True)
    site_tagline_en = serializers.CharField(default="Matchmaking Portal", allow_blank=True)
    color_palette = serializers.CharField(default="default")
    custom_primary_color = serializers.CharField(default="", allow_blank=True)
    custom_secondary_color = serializers.CharField(default="", allow_blank=True)
    canvas_light_color = serializers.CharField(default="", allow_blank=True)
    canvas_dark_color = serializers.CharField(default="", allow_blank=True)
    logo_url = serializers.CharField(default="", allow_blank=True, allow_null=True)
    favicon_url = serializers.CharField(default="", allow_blank=True, allow_null=True)
    font_family = serializers.CharField(default="Vazirmatn", allow_blank=True)
    custom_font_data = serializers.CharField(default="", allow_blank=True)

