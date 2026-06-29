"""
URL configuration for dating_app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
"""

from django.contrib import admin
from django.urls import include, path
from django.conf.urls.i18n import i18n_patterns
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)


class CookieAuthSwaggerView(SpectacularSwaggerView):
    template_name = "custom_swagger_ui.html"

urlpatterns = i18n_patterns(
    path("admin/", admin.site.urls),
)

urlpatterns += [
    path("__debug__/", include("debug_toolbar.urls")),
    # API: all users/auth/profile endpoints under /api/
    path("api/", include("users.urls")),
    # OpenAPI schema + Swagger UI + Redoc
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/swagger-ui/",
        CookieAuthSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
]