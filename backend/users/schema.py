"""
drf-spectacular OpenAPI extensions for the users app.

Authentication is handled via HTTP-only cookies (CookieJWTAuthentication).
No security scheme is registered in the OpenAPI document because Swagger UI
cannot set or read HTTP-only cookies from JavaScript. Instead, a custom
login form is provided directly in the Swagger UI page.
"""