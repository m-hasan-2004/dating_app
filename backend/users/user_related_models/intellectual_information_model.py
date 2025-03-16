from django.db import models
from django.utils.translation import gettext_lazy as _
from core.utils.model_choices.user_model_choices import IntellectualInformationChoices
from core.utils.help_texts.help_text import IntellectualInfoHelpText
from core.utils.error_msgs.model_error_messages import IntellectualInfoErrorMessages
from multiselectfield import MultiSelectField

class IntellectualInformation(models.Model):
    marriage_goals = models.TextField(
        _("Marriage Goals & Purposes"),
        help_text=IntellectualInfoHelpText.MARRIAGE_GOALS,
        error_messages=IntellectualInfoErrorMessages.MARRIAGE_GOALS
    )
    opinion_woman_job = models.CharField(
        _("Opinion About Woman's Job"),
        choices=IntellectualInformationChoices.WOMAN_JOB_OPTIONS,
        help_text=IntellectualInfoHelpText.OPINION_WOMAN_JOB,
        error_messages=IntellectualInfoErrorMessages.OPINION_WOMAN_JOB
    )
    opinion_woman_edu = models.CharField(
        _("Opinion About Woman's Education"),
        choices=IntellectualInformationChoices.WOMAN_EDU_OPTIONS,
        help_text=IntellectualInfoHelpText.OPINION_WOMAN_EDU,
        error_messages=IntellectualInfoErrorMessages.OPINION_WOMAN_EDU
    )
    pros_of_yourself = models.TextField(
        _("Pros Of Yourself"),
        help_text=IntellectualInfoHelpText.PROS_OF_YOURSELF,
        error_messages=IntellectualInfoErrorMessages.PROS_OF_YOURSELF
    )
    cons_of_yourself = models.TextField(
        _("Cons Of Yourself"),
        help_text=IntellectualInfoHelpText.CONS_OF_YOURSELF,
        error_messages=IntellectualInfoErrorMessages.CONS_OF_YOURSELF
    )
    type_connection_friends = models.CharField(
        _("Type of Connection With Friends"),
        choices=IntellectualInformationChoices.FRIENDS_CONNECTION_TYPE,
        help_text=IntellectualInfoHelpText.TYPE_CONNECTION_FRIENDS,
        error_messages=IntellectualInfoErrorMessages.TYPE_CONNECTION_FRIENDS
    )
    friends_connection_reason = models.CharField(
        _("Friends Connection Reason"),
        max_length=100,
        help_text=IntellectualInfoHelpText.FRIENDS_CONNECTION_REASON,
        error_messages=IntellectualInfoErrorMessages.FRIENDS_CONNECTION_REASON
    )
    political_orientation = models.BooleanField(
        _("Political Orientation"),
        help_text=IntellectualInfoHelpText.POLITICAL_ORIENTATION,
        error_messages=IntellectualInfoErrorMessages.POLITICAL_ORIENTATION
    )
    opinion_velayat_faqih = models.CharField(
        _("Opinion About Velayat Faqih"),
        choices=IntellectualInformationChoices.VELAYAT_FAQIH_OPTIONS,
        help_text=IntellectualInfoHelpText.OPINION_VELAYAT_FAQIH,
        error_messages=IntellectualInfoErrorMessages.OPINION_VELAYAT_FAQIH,
        db_index=True
    )
    opinion_child_quantity = models.CharField(
        _("Opinion About Child Quantity"),
        choices=IntellectualInformationChoices.CHILD_QUANTITY_OPTIONS,
        help_text=IntellectualInfoHelpText.OPINION_CHILD_QUANTITY,
        error_messages=IntellectualInfoErrorMessages.OPINION_CHILD_QUANTITY
    )
    contract_how = models.CharField(
        _("Contract How & What"),
        choices=IntellectualInformationChoices.CONTRACT_HOW_OPTIONS,
        help_text=IntellectualInfoHelpText.CONTRACT_HOW,
        error_messages=IntellectualInfoErrorMessages.CONTRACT_HOW
    )
    wedding_how = models.CharField(
        _("Wedding How & What"),
        choices=IntellectualInformationChoices.WEDDING_HOW_OPTIONS,
        help_text=IntellectualInfoHelpText.WEDDING_HOW,
        error_messages=IntellectualInfoErrorMessages.WEDDING_HOW
    )
    worship_prayer = models.CharField(
        _("Worship and Prayer"),
        choices=IntellectualInformationChoices.WORSHIP_PRAYER_OPTIONS,
        help_text=IntellectualInfoHelpText.WORSHIP_PRAYER,
        error_messages=IntellectualInfoErrorMessages.WORSHIP_PRAYER,
        db_index=True
    )
    fasting = models.CharField(
        _("Fasting"),
        choices=IntellectualInformationChoices.FASTING_OPTIONS,
        help_text=IntellectualInfoHelpText.FASTING,
        error_messages=IntellectualInfoErrorMessages.FASTING
    )
    cover_type_house = models.CharField(
        _("Cover Type in House"),
        choices=IntellectualInformationChoices.COVER_TYPE_HOUSE_OPTIONS,
        help_text=IntellectualInfoHelpText.COVER_TYPE_HOUSE,
        error_messages=IntellectualInfoErrorMessages.COVER_TYPE_HOUSE
    )
    cover_type_society = models.CharField(
        _("Cover Type in Society & Workplace"),
        choices=IntellectualInformationChoices.COVER_TYPE_SOCIETY_OPTIONS,
        help_text=IntellectualInfoHelpText.COVER_TYPE_SOCIETY,
        error_messages=IntellectualInfoErrorMessages.COVER_TYPE_SOCIETY
    )
    participating_prayer_quran_meetings = models.CharField(
        _("Participating in Prayer and Quran Religious Meetings"),
        choices=IntellectualInformationChoices.PARTICIPATING_PRAYER_QURAN_MEETINGS_OPTIONS,
        help_text=IntellectualInfoHelpText.PARTICIPATING_PRAYER_QURAN_MEETINGS,
        error_messages=IntellectualInfoErrorMessages.PARTICIPATING_PRAYER_QURAN_MEETINGS
    )
    music = models.CharField(
        _("Music"),
        choices=IntellectualInformationChoices.MUSIC_OPTIONS,
        help_text=IntellectualInfoHelpText.MUSIC,
        error_messages=IntellectualInfoErrorMessages.MUSIC
    )
    dance_singing_assemblies = models.CharField(
        _("Dance & Singing Assemblies"),
        choices=IntellectualInformationChoices.DANCE_SINGING_ASSEMBLIES_OPTIONS,
        help_text=IntellectualInfoHelpText.DANCE_SINGING_ASSEMBLIES,
        error_messages=IntellectualInfoErrorMessages.DANCE_SINGING_ASSEMBLIES
    )
    opinion_innocent_contact = models.CharField(
        _("Opinion About Innocent Contact"),
        choices=IntellectualInformationChoices.OPINION_INNOCENT_CONTACT_OPTIONS,
        help_text=IntellectualInfoHelpText.OPINION_INNOCENT_CONTACT,
        error_messages=IntellectualInfoErrorMessages.OPINION_INNOCENT_CONTACT
    )
    cover_type_innocent_contact = models.CharField(
        _("Cover Type in Contact of Innocent"),
        choices=IntellectualInformationChoices.COVER_TYPE_INNOCENT_CONTACT_OPTIONS,
        help_text=IntellectualInfoHelpText.COVER_TYPE_INNOCENT_CONTACT,
        error_messages=IntellectualInfoErrorMessages.COVER_TYPE_INNOCENT_CONTACT
    )
    decision_making_choosing_spouse = MultiSelectField(
        _("Decision Making in Choosing a Spouse"),
        choices=IntellectualInformationChoices.DECISION_MAKING_CHOOSING_SPOUSE_OPTIONS,
        help_text=IntellectualInfoHelpText.DECISION_MAKING_CHOOSING_SPOUSE,
        error_messages=IntellectualInfoErrorMessages.DECISION_MAKING_CHOOSING_SPOUSE
    )
    user = models.OneToOneField(
        "users.User",
        on_delete=models.CASCADE,
        related_name="intellectual_info",
        db_index=True,
        help_text=IntellectualInfoHelpText.USER,
        error_messages=IntellectualInfoErrorMessages.UNIQUE_ID
    )    
    
    def __str__(self):
        return f"اطلاعات کاربر: {self.user.last_name}"
    
    class Meta:
        verbose_name = _("Intellectual Information")
        verbose_name_plural = _("Intellectual Information")
