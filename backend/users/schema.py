"""
drf-spectacular OpenAPI extensions for the users app.

Registers CookieJWTAuthentication so drf-spectacular can document it
in the OpenAPI schema (shows up as a Bearer token security scheme
in Swagger UI, since the auth class also supports the Authorization header).
"""

from drf_spectacular.extensions import OpenApiAuthenticationExtension
from users.authentication import CookieJWTAuthentication


class CookieJWTAuthenticationExtension(OpenApiAuthenticationExtension):
    target_class = CookieJWTAuthentication
    name = "cookieJWTAuth"
    priority = 1

    def get_security_definition(self, auto_schema):
        return {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": (
                "JWT access token. Can be provided as an "
                "`Authorization: Bearer <token>` header, or set via the "
                "`access_token` HTTP-only cookie (login flow)."
            ),
        }
