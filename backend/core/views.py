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


import os
import uuid
from django.conf import settings as django_settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework.parsers import MultiPartParser, FormParser


@extend_schema(
    tags=["Site Settings"],
    summary="Upload site static assets (logo, favicon, font)",
    description="Allows superusers to upload real static files (logo, favicon, font files) which are safely persisted to server media storage.",
)
class SiteAssetUploadView(APIView):
    permission_classes = [IsSuperUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        uploaded_file = request.FILES.get("file")
        asset_type = request.data.get("asset_type", "logo")  # 'logo', 'favicon', or 'font'

        if not uploaded_file:
            return Response(
                {"error": "No file uploaded. Please provide a file field."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate file size (max 10MB)
        if uploaded_file.size > 10 * 1024 * 1024:
            return Response(
                {"error": "File size exceeds 10MB limit."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        ext = os.path.splitext(uploaded_file.name)[1].lower()
        allowed_extensions = {
            "logo": [".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif", ".ico"],
            "favicon": [".ico", ".png", ".svg", ".jpg", ".jpeg", ".webp"],
            "font": [".woff2", ".woff", ".ttf", ".otf"],
        }

        valid_exts = allowed_extensions.get(asset_type, allowed_extensions["logo"])
        if ext not in valid_exts:
            return Response(
                {
                    "error": f"Invalid file type '{ext}' for asset '{asset_type}'. Allowed types: {', '.join(valid_exts)}"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Store in organized backend media directories
        subfolder_map = {
            "logo": "site_branding/logos",
            "favicon": "site_branding/favicons",
            "font": "site_branding/fonts",
        }
        subfolder = subfolder_map.get(asset_type, "site_branding/assets")

        # Create safe unique filename preserving clean name
        clean_basename = "".join(c for c in os.path.splitext(uploaded_file.name)[0] if c.isalnum() or c in ("-", "_"))[:30]
        unique_name = f"{subfolder}/{clean_basename}_{uuid.uuid4().hex[:8]}{ext}"

        saved_path = default_storage.save(unique_name, ContentFile(uploaded_file.read()))
        # Build relative and absolute URLs
        media_url_prefix = getattr(django_settings, "MEDIA_URL", "/media/")
        if not media_url_prefix.startswith("/"):
            media_url_prefix = "/" + media_url_prefix
        if not media_url_prefix.endswith("/"):
            media_url_prefix = media_url_prefix + "/"

        file_url = f"{media_url_prefix}{saved_path}"
        full_url = request.build_absolute_uri(file_url)

        # Optionally auto-update SiteSetting singleton if requested
        auto_apply = str(request.data.get("auto_apply", "true")).lower() == "true"
        settings_obj = SiteSetting.get_settings()
        if auto_apply:
            if asset_type == "logo":
                settings_obj.logo_url = file_url
            elif asset_type == "favicon":
                settings_obj.favicon_url = file_url
            elif asset_type == "font":
                settings_obj.font_family = "custom"
                settings_obj.custom_font_data = file_url
            settings_obj.save(updated_by=request.user)

        return Response(
            {
                "message": f"{asset_type.capitalize()} uploaded and saved successfully.",
                "asset_type": asset_type,
                "file_name": uploaded_file.name,
                "file_path": saved_path,
                "url": file_url,
                "full_url": full_url,
            },
            status=status.HTTP_201_CREATED,
        )


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
            "enable_language_switcher": getattr(settings_obj, "enable_language_switcher", True),
            "enable_identity_and_birth_cert": getattr(settings_obj, "enable_identity_and_birth_cert", True),
            "enable_nextjs_toolbar": getattr(settings_obj, "enable_nextjs_toolbar", True),
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
            "font_family": getattr(settings_obj, "font_family", "Vazirmatn") or "Vazirmatn",
            "custom_font_data": getattr(settings_obj, "custom_font_data", "") or "",
        }
        return Response(data, status=status.HTTP_200_OK)

