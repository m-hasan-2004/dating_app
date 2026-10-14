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
        default="brand",
        help_text=_("Visual color theme (brand, emerald, purple, rose, amber, indigo)."),
    )
    logo_url = models.CharField(
        _("Logo URL or Identifier"),
        max_length=500,
        blank=True,
        null=True,
        default="",
        help_text=_("Custom logo URL or preset logo identifier."),
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
                    "site_name_fa": "همسان‌گزینی",
                    "site_name_en": "Matrimonial",
                    "color_palette": "brand",
                    "logo_url": "",
                },
            )
            return obj
        except Exception:
            # Fallback for migrations or pre-db initialization
            return cls(
                require_access_code=True,
                require_email=True,
                site_name_fa="همسان‌گزینی",
                site_name_en="Matrimonial",
                color_palette="brand",
                logo_url="",
            )
