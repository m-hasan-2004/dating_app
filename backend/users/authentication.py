"""
Custom authentication classes for the Dating App API.

The API uses JWT access/refresh tokens delivered via HTTP-only cookies.
``CookieJWTAuthentication`` extends SimpleJWT's ``JWTAuthentication`` so that
the access token is read from the ``access_token`` cookie (set on login and
refresh) instead of the ``Authorization`` header. This keeps tokens out of
JavaScript (no localStorage/XSS exfiltration).

Why override ``authenticate`` instead of ``get_raw_token``:
    SimpleJWT's base ``JWTAuthentication.authenticate()`` calls
    ``get_header(request)`` and returns ``None`` as soon as the
    ``Authorization`` header is missing -- *before* ``get_raw_token`` is ever
    reached. So an override of ``get_raw_token`` alone is dead code for the
    cookie path. We override ``authenticate`` to inspect the cookie first, and
    only fall back to the ``Authorization: Bearer <token>`` header (used by the
    Swagger UI "Authorize" button) when no valid cookie is present.
"""

from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed


class CookieJWTAuthentication(JWTAuthentication):
    """
    JWT authentication that reads the access token from an HTTP-only cookie.

    Order of precedence:
      1. ``access_token`` HTTP-only cookie (production path).
      2. ``Authorization: Bearer <token>`` header (Swagger UI / debugging).

    The cookie name is configurable via ``settings.JWT_AUTH_COOKIE``
    (defaults to ``access_token``).
    """

    def authenticate(self, request):
        # 1. Cookie path -- read the access token straight from the cookie,
        #    bypassing SimpleJWT's header requirement entirely.
        cookie_token = request.COOKIES.get(settings.JWT_AUTH_COOKIE)
        if cookie_token:
            raw_token = (
                cookie_token.encode("utf-8")
                if isinstance(cookie_token, str)
                else cookie_token
            )
            try:
                validated_token = self.get_validated_token(raw_token)
                return self.get_user(validated_token), validated_token
            except AuthenticationFailed:
                # Cookie present but invalid/expired -- fall through to the
                # Authorization header path (or None if no header either).
                pass

        # 2. Header path (Swagger UI "Authorize" button / debugging).
        return super().authenticate(request)
