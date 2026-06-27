"""
Custom authentication classes for the Dating App API.

The API uses JWT access/refresh tokens delivered via HTTP-only cookies.
``CookieJWTAuthentication`` extends SimpleJWT's ``JWTAuthentication`` so that
the *raw* access token is read from the ``access_token`` cookie (set on login
and refresh) instead of the ``Authorization`` header. This keeps tokens out of
JavaScript (no localStorage/XSS exfiltration) while still allowing the
browsable API / Swagger UI to send the token through the cookie.
"""

from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


class CookieJWTAuthentication(JWTAuthentication):
    """
    JWT authentication that reads the access token from an HTTP-only cookie.

    The cookie name is configurable via ``settings.JWT_AUTH_COOKIE``
    (defaults to ``access_token``). Falls back to the standard
    ``Authorization: Bearer <token>`` header if the cookie is absent, which
    keeps Swagger UI's "Authorize" button functional when testing manually.
    """

    def get_raw_token(self, header):
        """
        Return the raw JWT string.

        Order of precedence:
        1. ``access_token`` HTTP-only cookie (production path).
        2. ``Authorization: Bearer <token>`` header (Swagger UI / debugging).
        """
        # 1. Cookie path
        if self.request is not None:
            cookie_token = self.request.COOKIES.get(settings.JWT_AUTH_COOKIE)
            if cookie_token:
                return cookie_token

        # 2. Header path (parent implementation handles None header gracefully)
        return super().get_raw_token(header)

    def get_validated_token(self, raw_token):
        """
        Validate the raw token and return a ``AccessToken`` / ``Token`` instance.

        Re-raises SimpleJWT's ``InvalidToken`` so DRF returns a proper 401
        response (with ``WWW-Authenticate`` header) instead of a 500.
        """
        try:
            return super().get_validated_token(raw_token)
        except TokenError as exc:
            raise InvalidToken(str(exc))