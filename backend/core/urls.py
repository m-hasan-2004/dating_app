from django.urls import path
from .views import SiteSettingView, PublicRegistrationConfigView

urlpatterns = [
    path("site-settings/", SiteSettingView.as_view(), name="site-settings"),
    path("auth/registration-config/", PublicRegistrationConfigView.as_view(), name="registration-config"),
]
