from django.urls import path
from .views import SiteSettingView, PublicRegistrationConfigView, SiteAssetUploadView

urlpatterns = [
    path("site-settings/", SiteSettingView.as_view(), name="site-settings"),
    path("site-settings/upload/", SiteAssetUploadView.as_view(), name="site-settings-upload"),
    path("auth/registration-config/", PublicRegistrationConfigView.as_view(), name="registration-config"),
]
