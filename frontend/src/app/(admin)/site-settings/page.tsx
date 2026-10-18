"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/context/LanguageContext";
import { useBranding, ColorPalette } from "@/context/BrandingContext";
import {
  getSiteSettingsApi,
  updateSiteSettingsApi,
  SiteSettings,
} from "@/services/api/siteSettings";
import { formatDate } from "@/utils/formatters";


export default function SiteSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, isRTL } = useLanguage();
  const { setBranding, restoreDefaults, setCanvasColors, setColorPalette: setContextColorPalette, canvasLightColor: currentCanvasLight, canvasDarkColor: currentCanvasDark, setFontFamily: setContextFontFamily, fontFamily: currentFontFamily, customFontData: currentCustomFontData } = useBranding();
  const router = useRouter();

  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const faviconFileInputRef = useRef<HTMLInputElement>(null);
  const fontFileInputRef = useRef<HTMLInputElement>(null);

  const isSuperUser = Boolean((user as any)?.is_superuser);
  const siteSettingEnabled =
    String(
      process.env.NEXT_PUBLIC_SITE_SETTING ??
      process.env.site_setting ??
      "true"
    ).toLowerCase() === "true";

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [requireAccessCode, setRequireAccessCode] = useState<boolean>(true);
  const [requireEmail, setRequireEmail] = useState<boolean>(true);
  const [enableLanguageSwitcher, setEnableLanguageSwitcher] = useState<boolean>(true);
  const [siteNameFa, setSiteNameFa] = useState<string>("سامانه همسان‌گزینی و ازدواج دائم");
  const [siteNameEn, setSiteNameEn] = useState<string>("TailAdmin Matchmaking");
  const [siteTaglineFa, setSiteTaglineFa] = useState<string>("پورتال همسان‌گزینی");
  const [siteTaglineEn, setSiteTaglineEn] = useState<string>("Matchmaking Portal");
  const [colorPalette, setColorPalette] = useState<ColorPalette>("default");
  const [customPrimaryColor, setCustomPrimaryColor] = useState<string>("#465fff");
  const [customSecondaryColor, setCustomSecondaryColor] = useState<string>("#3641f5");
  const [canvasLightColor, setCanvasLightColor] = useState<string>(currentCanvasLight || "#f8fafc");
  const [canvasDarkColor, setCanvasDarkColor] = useState<string>(currentCanvasDark || "#131127");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [faviconUrl, setFaviconUrl] = useState<string>("");
  const [fontFamily, setFontFamily] = useState<string>(currentFontFamily || "Vazirmatn");
  const [customFontData, setCustomFontData] = useState<string>(currentCustomFontData || "");
  const [uploadedFontFileName, setUploadedFontFileName] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Guard: Feature toggle & superadmin only
  useEffect(() => {
    if (!authLoading) {
      if (!siteSettingEnabled || !isSuperUser) {
        router.replace("/dashboard");
      }
    }
  }, [authLoading, isSuperUser, siteSettingEnabled, router]);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSiteSettingsApi();
      setSettings(data);
      setRequireAccessCode(data.require_access_code);
      setRequireEmail(data.require_email);
      if (data.enable_language_switcher !== undefined) setEnableLanguageSwitcher(data.enable_language_switcher);
      if (data.site_name_fa) setSiteNameFa(data.site_name_fa);
      if (data.site_name_en) setSiteNameEn(data.site_name_en);
      if (data.site_tagline_fa) setSiteTaglineFa(data.site_tagline_fa);
      if (data.site_tagline_en) setSiteTaglineEn(data.site_tagline_en);
      if (data.color_palette) setColorPalette(data.color_palette as ColorPalette);
      if (data.custom_primary_color) setCustomPrimaryColor(data.custom_primary_color);
      if (data.custom_secondary_color) setCustomSecondaryColor(data.custom_secondary_color);
      if (data.canvas_light_color) setCanvasLightColor(data.canvas_light_color);
      if (data.canvas_dark_color) setCanvasDarkColor(data.canvas_dark_color);
      if (data.logo_url) setLogoUrl(data.logo_url);
      if (data.favicon_url) setFaviconUrl(data.favicon_url);
      if (data.font_family) setFontFamily(data.font_family);
      if (data.custom_font_data) setCustomFontData(data.custom_font_data);
    } catch (err: any) {
      setError(err.message || t("Failed to load site settings."));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (isSuperUser && siteSettingEnabled) {
      loadSettings();
    }
  }, [isSuperUser, siteSettingEnabled, loadSettings]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError(t("File size exceeds 2MB limit."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setter(result);
        setSuccessMessage(t("Local file loaded successfully. Remember to click Save Settings."));
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFontFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setError(t("Font file size exceeds 8MB limit."));
      return;
    }

    setUploadedFontFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCustomFontData(result);
        setFontFamily("custom");
        setContextFontFamily("custom", result);
        setSuccessMessage(isRTL ? "فونت سفارشی با موفقیت بارگذاری شد و روی سایت اعمال گردید. برای ثبت نهایی روی ذخیره تنظیمات کلیک کنید." : "Custom font loaded and applied successfully! Click Save Settings to persist.");
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRestoreDefaults = async () => {
    if (!confirm(t("Are you sure you want to restore all branding and appearance settings to factory defaults?"))) return;

    setIsSaving(true);
    setError(null);
    try {
      const defaults = {
        enable_language_switcher: true,
        site_name_fa: "سامانه همسان‌گزینی و ازدواج دائم",
        site_name_en: "TailAdmin Matchmaking",
        site_tagline_fa: "پورتال همسان‌گزینی",
        site_tagline_en: "Matchmaking Portal",
        color_palette: "default",
        custom_primary_color: "",
        custom_secondary_color: "",
        canvas_light_color: "",
        canvas_dark_color: "",
        logo_url: "",
        favicon_url: "",
        font_family: "Vazirmatn",
        custom_font_data: "",
      };

      const updated = await updateSiteSettingsApi(defaults);
      setSettings(updated);
      setEnableLanguageSwitcher(true);
      setSiteNameFa(defaults.site_name_fa);
      setSiteNameEn(defaults.site_name_en);
      setSiteTaglineFa(defaults.site_tagline_fa);
      setSiteTaglineEn(defaults.site_tagline_en);
      setColorPalette("default");
      setCustomPrimaryColor("#465fff");
      setCustomSecondaryColor("#3641f5");
      setCanvasLightColor("#f1f5f9");
      setCanvasDarkColor("#131127");
      setLogoUrl("");
      setFaviconUrl("");
      setFontFamily("Vazirmatn");
      setCustomFontData("");
      setUploadedFontFileName("");

      await restoreDefaults();
      setSuccessMessage(t("Branding restored to defaults successfully!"));
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err.message || t("Failed to restore defaults."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updated = await updateSiteSettingsApi({
        require_access_code: requireAccessCode,
        require_email: requireEmail,
        enable_language_switcher: enableLanguageSwitcher,
        site_name_fa: siteNameFa,
        site_name_en: siteNameEn,
        site_tagline_fa: siteTaglineFa,
        site_tagline_en: siteTaglineEn,
        color_palette: "custom",
        custom_primary_color: customPrimaryColor,
        custom_secondary_color: customSecondaryColor,
        canvas_light_color: canvasLightColor,
        canvas_dark_color: canvasDarkColor,
        logo_url: logoUrl,
        favicon_url: faviconUrl,
        font_family: fontFamily,
        custom_font_data: customFontData,
      });

      setSettings(updated);
      setRequireAccessCode(updated.require_access_code);
      setRequireEmail(updated.require_email);
      if (updated.enable_language_switcher !== undefined) setEnableLanguageSwitcher(updated.enable_language_switcher);
      if (updated.site_name_fa) setSiteNameFa(updated.site_name_fa);
      if (updated.site_name_en) setSiteNameEn(updated.site_name_en);
      if (updated.site_tagline_fa) setSiteTaglineFa(updated.site_tagline_fa);
      if (updated.site_tagline_en) setSiteTaglineEn(updated.site_tagline_en);
      if (updated.color_palette) setColorPalette(updated.color_palette as ColorPalette);
      if (updated.custom_primary_color !== undefined) setCustomPrimaryColor(updated.custom_primary_color || "#465fff");
      if (updated.custom_secondary_color !== undefined) setCustomSecondaryColor(updated.custom_secondary_color || "#3641f5");
      if (updated.canvas_light_color !== undefined) setCanvasLightColor(updated.canvas_light_color || "#f1f5f9");
      if (updated.canvas_dark_color !== undefined) setCanvasDarkColor(updated.canvas_dark_color || "#131127");
      if (updated.logo_url !== undefined) setLogoUrl(updated.logo_url);
      if (updated.favicon_url !== undefined) setFaviconUrl(updated.favicon_url);
      if (updated.font_family !== undefined) setFontFamily(updated.font_family || "Vazirmatn");
      if (updated.custom_font_data !== undefined) setCustomFontData(updated.custom_font_data || "");

      // Sync active branding site-wide instantly
      setBranding({
        enableLanguageSwitcher: updated.enable_language_switcher,
        siteNameFa: updated.site_name_fa,
        siteNameEn: updated.site_name_en,
        siteTaglineFa: updated.site_tagline_fa,
        siteTaglineEn: updated.site_tagline_en,
        colorPalette: updated.color_palette as ColorPalette,
        customPrimaryColor: updated.custom_primary_color,
        customSecondaryColor: updated.custom_secondary_color,
        canvasLightColor: updated.canvas_light_color,
        canvasDarkColor: updated.canvas_dark_color,
        logoUrl: updated.logo_url,
        faviconUrl: updated.favicon_url,
        fontFamily: updated.font_family,
        customFontData: updated.custom_font_data,
      });

      setSuccessMessage(t("Site settings updated successfully."));
    } catch (err: any) {
      setError(err.message || t("Failed to update site settings."));
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || (!isSuperUser && !authLoading) || !siteSettingEnabled) {
    return null;
  }

  return (
    <div>
      <PageBreadcrumb pageTitle={t("Site Settings")} />

      <div className="space-y-6">
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-xl dark:bg-red-900/30 dark:text-red-400 font-medium">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-4 text-sm text-green-700 bg-green-100 rounded-xl dark:bg-green-900/30 dark:text-green-400 font-medium">
            {successMessage}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Card 1: System & Registration Rules */}
            <ComponentCard
              title={t("System & Registration Rules")}
              desc={t(
                "Manage core platform policies. These settings dynamically govern public registration requirements for all new users."
              )}
            >
              <div className="space-y-6">
                {/* Setting 1: Require Access Code */}
                <div
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-[1.5px] rounded-2xl transition-all gap-4 shadow-xs ${
                    requireAccessCode
                      ? "border-[var(--color-primary)]/60 bg-[var(--color-primary)]/[0.03] dark:border-[var(--color-primary)]/50 dark:bg-[var(--color-primary)]/[0.04]"
                      : "border-slate-300 dark:border-slate-700/80 bg-white dark:bg-white/[0.02]"
                  }`}
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-800 dark:text-white">
                        {t("Require Access Code on Signup")}
                      </h3>
                      {requireAccessCode ? (
                        <Badge variant="solid" color="primary" size="sm">
                          {t("Required")}
                        </Badge>
                      ) : (
                        <Badge variant="solid" color="success" size="sm">
                          {t("Auto-Generated")}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                      {t(
                        "When enabled, prospective users must enter an active invitation access code during registration. When disabled, the access code field is omitted from the signup form, and the platform automatically creates and consumes an access code for the user at registration."
                      )}
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 select-none hover:scale-105 active:scale-95 transition-transform">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={requireAccessCode}
                      onChange={(e) => setRequireAccessCode(e.target.checked)}
                    />
                    <div
                      className="w-12 h-7 bg-slate-300 dark:bg-slate-700 border-2 border-slate-400 dark:border-slate-500 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)]/40 peer-checked:bg-[var(--color-primary)] peer-checked:border-[var(--color-primary)] shadow-inner transition-all duration-200 hover:border-slate-500 dark:hover:border-slate-400 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-slate-300 dark:after:border-slate-400 after:rounded-full after:h-5 after:w-5 after:shadow-md after:transition-all peer-checked:after:translate-x-5 peer-checked:after:border-white"
                    ></div>
                  </label>
                </div>

                {/* Setting 2: Require Email */}
                <div
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-[1.5px] rounded-2xl transition-all gap-4 shadow-xs ${
                    requireEmail
                      ? "border-[var(--color-primary)]/60 bg-[var(--color-primary)]/[0.03] dark:border-[var(--color-primary)]/50 dark:bg-[var(--color-primary)]/[0.04]"
                      : "border-slate-300 dark:border-slate-700/80 bg-white dark:bg-white/[0.02]"
                  }`}
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-800 dark:text-white">
                        {t("Require Email on Signup")}
                      </h3>
                      {requireEmail ? (
                        <Badge variant="solid" color="primary" size="sm">
                          {t("Required")}
                        </Badge>
                      ) : (
                        <Badge variant="solid" color="warning" size="sm">
                          {t("Optional")}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                      {t(
                        "When enabled, users must provide a valid email address during signup. When disabled, providing an email address becomes optional during registration."
                      )}
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 select-none hover:scale-105 active:scale-95 transition-transform">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={requireEmail}
                      onChange={(e) => setRequireEmail(e.target.checked)}
                    />
                    <div
                      className="w-12 h-7 bg-slate-300 dark:bg-slate-700 border-2 border-slate-400 dark:border-slate-500 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)]/40 peer-checked:bg-[var(--color-primary)] peer-checked:border-[var(--color-primary)] shadow-inner transition-all duration-200 hover:border-slate-500 dark:hover:border-slate-400 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-slate-300 dark:after:border-slate-400 after:rounded-full after:h-5 after:w-5 after:shadow-md after:transition-all peer-checked:after:translate-x-5 peer-checked:after:border-white"
                    ></div>
                  </label>
                </div>

                {/* Setting 3: Enable Language Switcher */}
                <div
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-[1.5px] rounded-2xl transition-all gap-4 shadow-xs ${
                    enableLanguageSwitcher
                      ? "border-[var(--color-primary)]/60 bg-[var(--color-primary)]/[0.03] dark:border-[var(--color-primary)]/50 dark:bg-[var(--color-primary)]/[0.04]"
                      : "border-slate-300 dark:border-slate-700/80 bg-white dark:bg-white/[0.02]"
                  }`}
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-800 dark:text-white">
                        {t("Enable Language Switcher")}
                      </h3>
                      {enableLanguageSwitcher ? (
                        <Badge variant="solid" color="success" size="sm">
                          {t("Enabled")}
                        </Badge>
                      ) : (
                        <Badge variant="solid" color="warning" size="sm">
                          {t("Disabled")}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                      {t(
                        "Control visibility of the language toggle button across the entire platform. When disabled, the language switcher button is completely hidden from users."
                      )}
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 select-none hover:scale-105 active:scale-95 transition-transform">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={enableLanguageSwitcher}
                      onChange={(e) => setEnableLanguageSwitcher(e.target.checked)}
                    />
                    <div
                      className="w-12 h-7 bg-slate-300 dark:bg-slate-700 border-2 border-slate-400 dark:border-slate-500 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)]/40 peer-checked:bg-[var(--color-primary)] peer-checked:border-[var(--color-primary)] shadow-inner transition-all duration-200 hover:border-slate-500 dark:hover:border-slate-400 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-slate-300 dark:after:border-slate-400 after:rounded-full after:h-5 after:w-5 after:shadow-md after:transition-all peer-checked:after:translate-x-5 peer-checked:after:border-white"
                    ></div>
                  </label>
                </div>
              </div>
            </ComponentCard>

            {/* Card 2: Site Appearance & Branding */}
            <ComponentCard
              title={t("Site Appearance & Branding")}
              desc={t(
                "Customize the application visual identity, display name, and color theme across the entire portal."
              )}
            >
              <div className="space-y-6">
                {/* Site Names & Taglines */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 dark:text-white mb-2">
                      {t("Site Name (Persian)")}
                    </label>
                    <input
                      type="text"
                      value={siteNameFa}
                      onChange={(e) => setSiteNameFa(e.target.value)}
                      placeholder="سامانه همسان‌گزینی و ازدواج دائم"
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                    />
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1.5">
                      {isRTL ? "عنوانی که در هدر، سایدبار و صفحات ورود نمایش داده می‌شود." : "Displayed in headers, sidebar and auth pages in Persian mode."}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 dark:text-white mb-2">
                      {t("Site Name (English)")}
                    </label>
                    <input
                      type="text"
                      value={siteNameEn}
                      onChange={(e) => setSiteNameEn(e.target.value)}
                      placeholder="TailAdmin Matchmaking"
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                    />
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1.5">
                      {isRTL ? "عنوانی که در حالت انگلیسی سایت نمایش داده می‌شود." : "Displayed when application language is switched to English."}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 dark:text-white mb-2">
                      {t("Site Tagline (Persian)")}
                    </label>
                    <input
                      type="text"
                      value={siteTaglineFa}
                      onChange={(e) => setSiteTaglineFa(e.target.value)}
                      placeholder="پورتال همسان‌گزینی"
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                    />
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1.5">
                      {isRTL ? "زیرعنوان گوشه بالای سایدبار زیر نام سامانه در زبان فارسی." : "Sidebar subtitle displayed under site title in Persian mode."}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 dark:text-white mb-2">
                      {t("Site Tagline (English)")}
                    </label>
                    <input
                      type="text"
                      value={siteTaglineEn}
                      onChange={(e) => setSiteTaglineEn(e.target.value)}
                      placeholder="Matchmaking Portal"
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                    />
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1.5">
                      {isRTL ? "زیرعنوان گوشه بالای سایدبار زیر نام سامانه در زبان انگلیسی." : "Sidebar subtitle displayed under site title in English mode."}
                    </p>
                  </div>
                </div>

                {/* Arbitrary Color Picker Section */}
                <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-gray-800 bg-slate-50/70 dark:bg-white/[0.02] space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {t("Custom Palette & Color Picker")}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                      {isRTL
                        ? "انتخاب رنگ اصلی و رنگ تأکیدی سامانه با استفاده از انتخاب‌گر رنگ یا کد هگز دلخواه."
                        : "Pick any custom primary and accent hex color to dynamically theme the entire portal."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Primary Color Picker */}
                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border-[1.5px] border-slate-300 dark:border-gray-700 rounded-xl shadow-2xs">
                      <input
                        type="color"
                        value={customPrimaryColor || "#465fff"}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomPrimaryColor(val);
                          setColorPalette("custom");
                          setContextColorPalette("custom", val, customSecondaryColor);
                        }}
                        className="w-10 h-10 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                      />
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300">
                          {t("Custom Primary Color")}
                        </label>
                        <input
                          type="text"
                          value={customPrimaryColor}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomPrimaryColor(val);
                            setColorPalette("custom");
                            setContextColorPalette("custom", val, customSecondaryColor);
                          }}
                          placeholder="#465fff"
                          className="w-full text-xs font-mono py-1 px-2 border border-slate-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                        />
                      </div>
                    </div>

                    {/* Secondary Accent Color Picker */}
                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border-[1.5px] border-slate-300 dark:border-gray-700 rounded-xl shadow-2xs">
                      <input
                        type="color"
                        value={customSecondaryColor || "#3641f5"}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomSecondaryColor(val);
                          setColorPalette("custom");
                          setContextColorPalette("custom", customPrimaryColor, val);
                        }}
                        className="w-10 h-10 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                      />
                      <div className="flex-1 min-w-0">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300">
                          {t("Custom Accent Color")}
                        </label>
                        <input
                          type="text"
                          value={customSecondaryColor}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomSecondaryColor(val);
                            setColorPalette("custom");
                            setContextColorPalette("custom", customPrimaryColor, val);
                          }}
                          placeholder="#3641f5"
                          className="w-full text-xs font-mono py-1 px-2 border border-slate-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Canvas Base Background Colors (Light & Dark Mode) */}
                <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-gray-800 bg-slate-50/70 dark:bg-white/[0.02] space-y-5">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {t("Light & Dark Mode Background Colors")}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                      {isRTL
                        ? "تنظیم رنگ پس‌زمینه سایت برای حالت روشن (دیفالت: سفید/طوسی نرم) و حالت تاریک (دیفالت: بنفش تیره/سرمه‌ای) با انتخاب‌گر رنگ یا کد هگز."
                        : "Customize canvas background tone for both Light mode (default: soft slate/white) and Dark mode (default: deep purple/slate) using color pickers or hex code."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Light Mode Canvas Background */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-white dark:bg-gray-800/80 dark:border-gray-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                          ☀️ {t("Light Mode Canvas Background")}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setCanvasLightColor("#f1f5f9");
                            setCanvasColors("#f1f5f9", canvasDarkColor);
                          }}
                          className="text-[11px] text-[var(--color-primary)] hover:underline font-medium cursor-pointer"
                        >
                          {t("Reset to Default")}
                        </button>
                      </div>

                      {/* Custom Picker */}
                      <div className="flex items-center gap-2.5 pt-1">
                        <input
                          type="color"
                          value={canvasLightColor || "#f8fafc"}
                          onChange={(e) => {
                            setCanvasLightColor(e.target.value);
                            setCanvasColors(e.target.value, canvasDarkColor);
                          }}
                          className="w-9 h-9 rounded-lg border-0 cursor-pointer p-0 bg-transparent shrink-0"
                        />
                        <input
                          type="text"
                          value={canvasLightColor}
                          onChange={(e) => {
                            setCanvasLightColor(e.target.value);
                            setCanvasColors(e.target.value, canvasDarkColor);
                          }}
                          placeholder="#f8fafc"
                          className="w-full text-xs font-mono py-1.5 px-2.5 border border-slate-300 dark:border-gray-700 rounded-lg bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                        />
                      </div>
                    </div>

                    {/* Dark Mode Canvas Background */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-white dark:bg-gray-800/80 dark:border-gray-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                          🌙 {t("Dark Mode Canvas Background")}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setCanvasDarkColor("#131127");
                            setCanvasColors(canvasLightColor, "#131127");
                          }}
                          className="text-[11px] text-[var(--color-primary)] hover:underline font-medium cursor-pointer"
                        >
                          {t("Reset to Default")}
                        </button>
                      </div>

                      {/* Custom Picker */}
                      <div className="flex items-center gap-2.5 pt-1">
                        <input
                          type="color"
                          value={canvasDarkColor || "#131127"}
                          onChange={(e) => {
                            setCanvasDarkColor(e.target.value);
                            setCanvasColors(canvasLightColor, e.target.value);
                          }}
                          className="w-9 h-9 rounded-lg border-0 cursor-pointer p-0 bg-transparent shrink-0"
                        />
                        <input
                          type="text"
                          value={canvasDarkColor}
                          onChange={(e) => {
                            setCanvasDarkColor(e.target.value);
                            setCanvasColors(canvasLightColor, e.target.value);
                          }}
                          placeholder="#131127"
                          className="w-full text-xs font-mono py-1.5 px-2.5 border border-slate-300 dark:border-gray-700 rounded-lg bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logo & Favicon Picker with Local File Explorer & Tab Favicon */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  {/* Logo Picker */}
                  <div className="space-y-3 p-4.5 border border-slate-200/80 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-slate-800 dark:text-white">
                        {t("Logo")}
                      </label>
                      <input
                        type="file"
                        ref={logoFileInputRef}
                        accept="image/*,.png,.svg,.jpg,.webp"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setLogoUrl)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => logoFileInputRef.current?.click()}
                        className="text-xs"
                      >
                        📁 {t("Browse File")}
                      </Button>
                    </div>

                    <input
                      type="text"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png or Base64 / Local Path"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] font-mono"
                    />

                    {logoUrl && (
                      <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-gray-800/60 rounded-xl border border-slate-200/80 dark:border-gray-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={logoUrl}
                          alt="Logo Preview"
                          className="h-10 w-auto max-w-[150px] object-contain rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => setLogoUrl("")}
                          className="text-xs text-red-500 hover:underline"
                        >
                          {t("Remove")}
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {isRTL
                        ? "می‌توانید مستقیماً فایلی از سیستم انتخاب کنید یا آدرس آن را وارد نمایید."
                        : "Browse a local image file or enter an external image URL."}
                    </p>
                  </div>

                  {/* Favicon Browser Tab Icon */}
                  <div className="space-y-3 p-4.5 border border-slate-200/80 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-slate-800 dark:text-white">
                        {t("Browser Tab Favicon")}
                      </label>
                      <input
                        type="file"
                        ref={faviconFileInputRef}
                        accept="image/*,.ico,.png,.svg"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setFaviconUrl)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => faviconFileInputRef.current?.click()}
                        className="text-xs"
                      >
                        📁 {t("Browse File")}
                      </Button>
                    </div>

                    <input
                      type="text"
                      value={faviconUrl}
                      onChange={(e) => setFaviconUrl(e.target.value)}
                      placeholder="https://example.com/favicon.ico or Base64 / Local Path"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] font-mono"
                    />

                    {faviconUrl && (
                      <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-gray-800/60 rounded-xl border border-slate-200/80 dark:border-gray-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={faviconUrl}
                          alt="Favicon Preview"
                          className="w-8 h-8 object-contain rounded-md"
                        />
                        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{t("Active Tab Icon")}</span>
                        <button
                          type="button"
                          onClick={() => setFaviconUrl("")}
                          className="text-xs text-red-500 hover:underline ml-auto"
                        >
                          {t("Remove")}
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {isRTL
                        ? "این آیکون در تب مرورگر (کنار نام سایت در برگه مرورگر) قرار می‌گیرد."
                        : "Applies to the browser tab icon next to the title."}
                    </p>
                  </div>
                </div>
              </div>
            </ComponentCard>

            {/* Typography & Font Settings Card */}
            <ComponentCard
              title={isRTL ? "مدیریت قلم و تایپوگرافی سامانه" : "Typography & Font Management"}
              desc={
                isRTL
                  ? "تغییر فونت کلیه بخش‌های سامانه از لیست فونت‌های استاندارد فارسی یا بارگذاری فایل فونت اختصاصی (TTF / WOFF / WOFF2) و اعمال سراسری بر کل سایت."
                  : "Change the active font across the entire site from a curated list of Persian/Arabic fonts, or upload your own custom font file (TTF / WOFF / WOFF2)."
              }
            >
              <div className="space-y-6">
                {/* Predefined Fonts List */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 dark:text-white mb-2">
                    {isRTL ? "انتخاب فونت پیش‌فرض سامانه" : "Select System Font"}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                      { name: 'Vazirmatn', labelFa: 'وزیرمتن (دیفالت)', labelEn: 'Vazirmatn (Default)' },
                      { name: 'Sahel', labelFa: 'ساحل', labelEn: 'Sahel' },
                      { name: 'Samim', labelFa: 'صمیم', labelEn: 'Samim' },
                      { name: 'Shabnam', labelFa: 'شبنم', labelEn: 'Shabnam' },
                      { name: 'Tanha', labelFa: 'تنها', labelEn: 'Tanha' },
                      { name: 'Parastoo', labelFa: 'پرستو', labelEn: 'Parastoo' },
                      { name: 'Yekan Bakh', labelFa: 'یکان بخ', labelEn: 'Yekan Bakh' },
                      { name: 'IRANSans', labelFa: 'ایران‌سنس', labelEn: 'IRANSans' },
                      { name: 'Dana', labelFa: 'دانا', labelEn: 'Dana' },
                      { name: 'Estedad', labelFa: 'استعداد', labelEn: 'Estedad' },
                      { name: 'Gandom', labelFa: 'گندم', labelEn: 'Gandom' },
                      { name: 'Tahoma', labelFa: 'تاهوماه (سیستمی)', labelEn: 'Tahoma (System)' },
                    ].map((fontItem) => {
                      const isSelected = fontFamily === fontItem.name;
                      return (
                        <button
                          key={fontItem.name}
                          type="button"
                          onClick={() => {
                            setFontFamily(fontItem.name);
                            setContextFontFamily(fontItem.name, '');
                          }}
                          className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-[1.5px] transition-all cursor-pointer text-center ${
                            isSelected
                              ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white border-transparent shadow-md hover:shadow-lg'
                              : 'bg-white dark:bg-gray-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 shadow-2xs'
                          }`}
                        >
                          <span className="text-sm font-bold mb-1" style={{ fontFamily: `'${fontItem.name}', var(--font-outfit), sans-serif` }}>
                            {isRTL ? "نمونه خط" : "Sample Text"}
                          </span>
                          <span className="text-[11px] font-medium opacity-90 truncate max-w-full">
                            {isRTL ? fontItem.labelFa : fontItem.labelEn}
                          </span>
                          {isSelected && <span className="mt-1 text-xs font-bold">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Upload Custom Font File */}
                <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-gray-800 bg-slate-50/70 dark:bg-white/[0.02] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>🔤</span>
                        <span>{isRTL ? "بارگذاری فونت سفارشی دلخواه" : "Upload Custom Font File"}</span>
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                        {isRTL
                          ? "فایل فونت با پسوند woff2، woff یا ttf را از سیستم خود انتخاب کنید تا سریعاً به عنوان فونت فعال کل سامانه اعمال شود."
                          : "Upload a font file (.woff2, .woff, or .ttf) from your computer to apply it across all site pages."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="file"
                        ref={fontFileInputRef}
                        accept=".woff2,.woff,.ttf,.otf"
                        className="hidden"
                        onChange={handleFontFileUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fontFileInputRef.current?.click()}
                        className="text-xs"
                      >
                        📁 {isRTL ? "انتخاب فایل فونت" : t("Browse File")}
                      </Button>
                    </div>
                  </div>

                  {/* Active Custom Font Status */}
                  {customFontData && (
                    <div className="flex items-center justify-between p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs">
                      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
                        <span className="font-bold text-sm">✓</span>
                        <span>
                          {isRTL
                            ? `فونت سفارشی فعال است ${uploadedFontFileName ? `(${uploadedFontFileName})` : ''}`
                            : `Custom font is active ${uploadedFontFileName ? `(${uploadedFontFileName})` : ''}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setFontFamily("custom");
                            setContextFontFamily("custom", customFontData);
                          }}
                          className={`px-3 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                            fontFamily === 'custom'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                          }`}
                        >
                          {fontFamily === 'custom' ? (isRTL ? "فعال است" : "Active") : (isRTL ? "فعال‌سازی این فونت" : "Use this font")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomFontData("");
                            setUploadedFontFileName("");
                            if (fontFamily === 'custom') {
                              setFontFamily("Vazirmatn");
                              setContextFontFamily("Vazirmatn", "");
                            }
                          }}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold underline ml-1 cursor-pointer"
                        >
                          {t("Remove")}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Font Live Preview Box */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white dark:bg-gray-900 dark:border-gray-800 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      {isRTL ? "پیش‌نمایش زنده متن با فونت انتخابی:" : "Live Font Preview:"}
                    </span>
                    <p className="text-base text-slate-900 dark:text-white font-medium leading-relaxed">
                      {isRTL
                        ? "سامانه همسان‌گزینی و ازدواج دائم؛ جامعه‌ای امن، آرامش‌بخش و متعهد برای ساختن آینده‌ای پایدار و عاشقانه."
                        : "Matrimonial & Matchmaking Portal — A secure, dignified, and values-aligned platform for finding your life partner."}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      ۱۲۳۴۵۶۷۸۹۰ - 1234567890 • abcdefghijklmnopqrstuvwxyz • ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی
                    </p>
                  </div>
                </div>
              </div>
            </ComponentCard>

            {/* Metadata Info & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80 dark:border-gray-800">
              <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {settings && settings.updated_at && (
                  <span>
                    {t("Last modified")}: {formatDate(settings.updated_at)}
                    {settings.updated_by_username && ` (${t("Updated by")}: ${settings.updated_by_username})`}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                <Button
                  size="md"
                  type="button"
                  variant="outline"
                  onClick={handleRestoreDefaults}
                  disabled={isSaving}
                  className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800/40 dark:hover:bg-red-950/20"
                >
                  ↺ {isRTL ? "بازنشانی به حالت پیش‌فرض" : t("Restore to Default")}
                </Button>

                <Button
                  size="md"
                  type="submit"
                  disabled={isSaving}
                  className="min-w-[140px]"
                >
                  {isSaving ? t("Saving...") : t("Save Settings")}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
