from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema, OpenApiResponse
from users.permissions import IsSuperUser
from .models import SiteSetting
from .serializers import SiteSettingSerializer, PublicRegistrationConfigSerializer


@extend_schema(
    tags=["Site Settings"],
    summary="Retrieve or update site settings",
    description="Allows superusers to view and update system-wide settings.",
    responses={
        200: SiteSettingSerializer,
        403: OpenApiResponse(description="Forbidden: Requires superuser privileges"),
    },
)
class SiteSettingView(APIView):
    permission_classes = [IsSuperUser]

    def get(self, request):
        settings_obj = SiteSetting.get_settings()
        serializer = SiteSettingSerializer(settings_obj)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=SiteSettingSerializer,
        responses={200: SiteSettingSerializer},
    )
    def patch(self, request):
        settings_obj = SiteSetting.get_settings()
        serializer = SiteSettingSerializer(settings_obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(updated_by=request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=SiteSettingSerializer,
        responses={200: SiteSettingSerializer},
    )
    def put(self, request):
        return self.patch(request)


@extend_schema(
    tags=["Auth"],
    summary="Get public registration configuration",
    description="Returns public configuration for signup rules, such as whether an access code or email is required.",
    responses={200: PublicRegistrationConfigSerializer},
)
class PublicRegistrationConfigView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        settings_obj = SiteSetting.get_settings()
        data = {
            "require_access_code": settings_obj.require_access_code,
            "require_email": settings_obj.require_email,
            "site_name_fa": settings_obj.site_name_fa,
            "site_name_en": settings_obj.site_name_en,
            "site_tagline_fa": settings_obj.site_tagline_fa,
            "site_tagline_en": settings_obj.site_tagline_en,
            "color_palette": settings_obj.color_palette,
            "custom_primary_color": settings_obj.custom_primary_color,
            "custom_secondary_color": settings_obj.custom_secondary_color,
            "canvas_light_color": settings_obj.canvas_light_color or "",
            "canvas_dark_color": settings_obj.canvas_dark_color or "",
            "logo_url": settings_obj.logo_url or "",
            "favicon_url": settings_obj.favicon_url or "",
        }
        return Response(data, status=status.HTTP_200_OK)

