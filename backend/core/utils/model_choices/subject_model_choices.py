from django.utils.translation import gettext_lazy as _


class SubjectChoices:
    SIGNUP_FEE_TYPE = (
        ("cash", _("Cash")),
        ("card", _("Card (Transfer to Card)")),
    )

