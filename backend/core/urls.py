from django.urls import path
from .views import SiteSettingView, PublicRegistrationConfigView
from .backup_views import (
    DatabaseExportView,
    DatabaseImportView,
    DatabaseBackupListView,
    DatabaseBackupDownloadView,
)

urlpatterns = [
    path("site-settings/", SiteSettingView.as_view(), name="site-settings"),
    path("auth/registration-config/", PublicRegistrationConfigView.as_view(), name="registration-config"),
    path("backup/export/", DatabaseExportView.as_view(), name="db-export"),
    path("backup/import/", DatabaseImportView.as_view(), name="db-import"),
    path("backup/list/", DatabaseBackupListView.as_view(), name="db-backup-list"),
    path("backup/download/<str:filename>/", DatabaseBackupDownloadView.as_view(), name="db-backup-download"),
]
