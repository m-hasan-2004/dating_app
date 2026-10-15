from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class SiteSetting(models.Model):
    """
    Singleton model to hold site-wide runtime configurations.
    Only superadmins are permitted to modify these settings.
    """

    require_access_code = models.BooleanField(
        _("Require access code on signup"),
        default=True,
        help_text=_(
            "When disabled, users can register without an access code, "
            "and one is generated automatically behind the scenes."
        ),
    )
    require_email = models.BooleanField(
        _("Require email on signup"),
        default=True,
        help_text=_(
            "When disabled, providing an email address becomes optional during registration."
        ),
    )
    site_name_fa = models.CharField(
        _("Site Name (Persian)"),
        max_length=150,
        default="همسان‌گزینی",
        help_text=_("Site name displayed in Persian locale."),
    )
    site_name_en = models.CharField(
        _("Site Name (English)"),
        max_length=150,
        default="Matrimonial",
        help_text=_("Site name displayed in English locale."),
    )
    color_palette = models.CharField(
        _("Color Palette"),
        max_length=50,
        default="default",
        help_text=_("Visual color theme (default, emerald, purple, rose, amber, indigo, custom)."),
    )
    custom_primary_color = models.CharField(
        _("Custom Primary Color"),
        max_length=30,
        blank=True,
        default="",
        help_text=_("Arbitrary primary hex color (e.g. #465fff)."),
    )
    custom_secondary_color = models.CharField(
        _("Custom Secondary Color"),
        max_length=30,
        blank=True,
        default="",
        help_text=_("Arbitrary secondary/accent hex color."),
    )
    canvas_light_color = models.CharField(
        _("Canvas Light Mode Color"),
        max_length=30,
        blank=True,
        default="",
        help_text=_("Custom light mode canvas background color (default #f8fafc)."),
    )
    canvas_dark_color = models.CharField(
        _("Canvas Dark Mode Color"),
        max_length=30,
        blank=True,
        default="",
        help_text=_("Custom dark mode canvas background color (default #101828)."),
    )
    site_tagline_fa = models.CharField(
        _("Site Tagline (Persian)"),
        max_length=150,
        default="پورتال همسان‌گزینی",
        blank=True,
        help_text=_("Subtitle / Tagline displayed beneath site title in Persian."),
    )
    site_tagline_en = models.CharField(
        _("Site Tagline (English)"),
        max_length=150,
        default="Matchmaking Portal",
        blank=True,
        help_text=_("Subtitle / Tagline displayed beneath site title in English."),
    )
    logo_url = models.TextField(
        _("Logo URL, Base64 Image, or Path"),
        blank=True,
        default="",
        help_text=_("Custom logo URL, local file path or base64 image string."),
    )
    favicon_url = models.TextField(
        _("Favicon URL, Base64 Image, or Path"),
        blank=True,
        default="",
        help_text=_("Custom favicon URL or base64 icon string."),
    )
    updated_at = models.DateTimeField(_("Updated at"), auto_now=True)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="updated_site_settings",
        verbose_name=_("Updated by"),
    )

    class Meta:
        verbose_name = _("Site Setting")
        verbose_name_plural = _("Site Settings")

    def __str__(self):
        return (
            f"Site Settings (require_access_code={self.require_access_code}, "
            f"require_email={self.require_email})"
        )

    def save(self, *args, **kwargs):
        # Enforce singleton row: always keep id=1
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_settings(cls):
        """
        Retrieve or initialize the singleton SiteSetting instance.
        """
        try:
            obj, _ = cls.objects.get_or_create(
                id=1,
                defaults={
                    "require_access_code": True,
                    "require_email": True,
                    "site_name_fa": "سامانه همسان‌گزینی و ازدواج دائم",
                    "site_name_en": "TailAdmin Matchmaking",
                    "color_palette": "default",
                    "custom_primary_color": "",
                    "custom_secondary_color": "",
                    "site_tagline_fa": "پورتال همسان‌گزینی",
                    "site_tagline_en": "Matchmaking Portal",
                    "logo_url": "",
                    "favicon_url": "",
                },
            )
            return obj
        except Exception:
            # Fallback for migrations or pre-db initialization
            return cls(
                require_access_code=True,
                require_email=True,
                site_name_fa="سامانه همسان‌گزینی و ازدواج دائم",
                site_name_en="TailAdmin Matchmaking",
                color_palette="default",
                custom_primary_color="",
                custom_secondary_color="",
                site_tagline_fa="پورتال همسان‌گزینی",
                site_tagline_en="Matchmaking Portal",
                logo_url="",
                favicon_url="",
            )
