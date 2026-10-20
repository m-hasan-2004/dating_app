from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class CalendarEvent(models.Model):
    CATEGORY_CHOICES = (
        ("primary", _("Primary")),
        ("danger", _("Danger")),
        ("success", _("Success")),
        ("warning", _("Warning")),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="calendar_events",
        verbose_name=_("User"),
        help_text=_("The user to whom this calendar event belongs."),
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_calendar_events",
        verbose_name=_("Created By"),
        help_text=_("The administrator or user who created this event."),
    )
    title = models.CharField(
        max_length=200,
        verbose_name=_("Event Title"),
    )
    description = models.TextField(
        blank=True,
        default="",
        verbose_name=_("Event Explanation"),
        help_text=_("Detailed explanation or notes for this event."),
    )
    start_date = models.DateField(
        verbose_name=_("Start Date"),
        help_text=_("Event start date (YYYY-MM-DD)."),
    )
    end_date = models.DateField(
        null=True,
        blank=True,
        verbose_name=_("End Date"),
        help_text=_("Optional event end date (YYYY-MM-DD)."),
    )
    category = models.CharField(
        max_length=50,
        default="primary",
        verbose_name=_("Color / Category"),
        help_text=_("Color category (e.g. primary, danger, success, warning)."),
    )
    is_admin_created = models.BooleanField(
        default=False,
        verbose_name=_("Is Admin Created"),
        help_text=_("Indicates whether this event was created by an admin/staff."),
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["start_date", "created_at"]
        verbose_name = _("Calendar Event")
        verbose_name_plural = _("Calendar Events")

    def save(self, *args, **kwargs):
        if self.created_by:
            if self.created_by.is_staff or self.created_by.is_superuser:
                self.is_admin_created = True
            elif self.created_by == self.user:
                self.is_admin_created = False
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.user.username}) - {self.start_date}"
