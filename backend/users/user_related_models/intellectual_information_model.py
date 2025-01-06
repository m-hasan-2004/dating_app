from django.db import models
from django.utils.translation import gettext_lazy as _
from multiselectfield import MultiSelectField
from core.utils.model_choices import Choices, IntellectualInformationChoices

class IntellectualInformation(models.Model):
    marriage_goals = models.TextField(
        _("Marriage Goals & Purposes")
    )
    opinion_woman_job = models.CharField(
        _("Opinion About Woman's Job"),
        max_length=50,
        choices=IntellectualInformationChoices.WOMAN_JOB_OPTIONS
    )
    opinion_woman_edu = models.CharField(
        _("Opinion About Woman's Education"),
        max_length=50,
        choices=IntellectualInformationChoices.WOMAN_EDU_OPTIONS
    )
    pros_of_yourself = models.TextField(
        _("Pros Of Yourself")
    )
    cons_of_yourself = models.TextField(
        _("Cons Of Yourself")
    )
    type_connection_friends = models.CharField(
        _("Type of Connection With Friends"),
        max_length=50,
        choices=IntellectualInformationChoices.FRIENDS_CONNECTION_TYPE
    )
    friends_connection_reason = models.CharField(
        _("Friends Connection Reason"),
        max_length=100
    )
    political_orientation = models.BooleanField(
        _("Political Orientation")
    )
    opinion_velayat_faqih = models.CharField(
        _("Opinion About Velayat Faqih"),
        max_length=50,
        choices=IntellectualInformationChoices.VELAYAT_FAQIH_OPTIONS
    )
    opinion_child_quantity = models.CharField(
        _("Opinion About Child Quantity"),
        max_length=50,
        choices=IntellectualInformationChoices.CHILD_QUANTITY_OPTIONS
    )
    contract_how = models.CharField(
        _("Contract How & What"),
        max_length=50,
        choices=IntellectualInformationChoices.CONTRACT_HOW_OPTIONS
    )
    wedding_how = models.CharField(
        _("Wedding How & What"),
        max_length=50,
        choices=IntellectualInformationChoices.WEDDING_HOW_OPTIONS
    )
    worship_prayer = models.CharField(
        _("Worship and Prayer"),
        max_length=50,
        choices=IntellectualInformationChoices.WORSHIP_PRAYER_OPTIONS
    )
    fasting = models.CharField(
        _("Fasting"),
        max_length=50,
        choices=IntellectualInformationChoices.FASTING_OPTIONS
    )
    cover_type_house = models.CharField(
        _("Cover Type in House"),
        max_length=50,
        choices=IntellectualInformationChoices.COVER_TYPE_HOUSE_OPTIONS
    )
    cover_type_society = models.CharField(
        _("Cover Type in Society & Workplace"),
        max_length=50,
        choices=IntellectualInformationChoices.COVER_TYPE_SOCIETY_OPTIONS
    )
    user = models.OneToOneField(
        "users.User",
        on_delete=models.CASCADE,
        related_name="intellectual_info_user",
        db_index=True
    )    
    class Meta:
        verbose_name = _("Intellectual Information")
        verbose_name_plural = _("Intellectual Information")
