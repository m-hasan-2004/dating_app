"""
drf-spectacular OpenAPI extensions for the users app.

Imported lazily in :meth:`users.apps.UsersConfig.ready` to avoid the circular
import that would occur if these were defined inside ``users.authentication``
(that module is referenced by DRF's ``DEFAULT_AUTHENTICATION_CLASSES`` during
framework bootstrapping, before drf-spectacular is ready).
"""

from django.conf import settings
from drf_spectacular.openapi import OpenApiAuthenticationExtension


class CookieJWTAuthenticationExtension(OpenApiAuthenticationExtension):
    """
    Render :class:`users.authentication.CookieJWTAuthentication` as a
    ``jwtCookieAuth`` security scheme in the generated OpenAPI document.

    The name ``jwtCookieAuth`` avoids a collision with drf-spectacular's
    built-in ``SessionAuthentication`` extension (also named ``cookieAuth``).
    """

    target_class = "users.authentication.CookieJWTAuthentication"
    name = "jwtCookieAuth"

    def get_security_definition(self, auto_schema):
        return {
            "type": "apiKey",
            "in": "cookie",
            "name": settings.JWT_AUTH_COOKIE,
            "description": (
                "JWT access token set as an HTTP-only cookie by "
                "/api/auth/login/. The browser sends it automatically; no "
                "JavaScript interaction is required."
            ),
        }