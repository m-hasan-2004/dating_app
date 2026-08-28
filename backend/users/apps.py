from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "users"
    verbose_name = "Users"

    def ready(self):
        # ✅ Keep your existing schema import (important)
        from . import schema  # noqa: F401

        # ✅ Unregister SimpleJWT blacklist models from admin
        from django.contrib import admin
        from django.apps import apps

        try:
            OutstandingToken = apps.get_model('token_blacklist', 'OutstandingToken')
            BlacklistedToken = apps.get_model('token_blacklist', 'BlacklistedToken')

            # Unregister only if already registered
            if OutstandingToken in admin.site._registry:
                admin.site.unregister(OutstandingToken)

            if BlacklistedToken in admin.site._registry:
                admin.site.unregister(BlacklistedToken)

            print("[OK] Token models removed from admin")

        except Exception as e:
            print("[WARN] Unregister failed:", e)