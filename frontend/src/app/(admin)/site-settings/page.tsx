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
  const { setBranding, restoreDefaults, setCanvasColors, setColorPalette: setContextColorPalette, canvasLightColor: currentCanvasLight, canvasDarkColor: currentCanvasDark } = useBranding();
  const router = useRouter();

  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const faviconFileInputRef = useRef<HTMLInputElement>(null);

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

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Guard: Feature toggle & superadmin only
  useEffect(() => {
    if (!authLoading) {
      if (!siteSettingEnabled || !isSuperUser) {
        router.replace("/");
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-slate-200/80 rounded-2xl dark:border-gray-800 bg-slate-50/70 dark:bg-white/[0.02] gap-4">
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
                    <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
                      {t(
                        "When enabled, prospective users must enter an active invitation access code during registration. When disabled, the access code field is omitted from the signup form, and the platform automatically creates and consumes an access code for the user at registration."
                      )}
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={requireAccessCode}
                      onChange={(e) => setRequireAccessCode(e.target.checked)}
                    />
                    <div
                      className={`w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--color-primary)]`}
                    ></div>
                  </label>
                </div>

                {/* Setting 2: Require Email */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-slate-200/80 rounded-2xl dark:border-gray-800 bg-slate-50/70 dark:bg-white/[0.02] gap-4">
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
                    <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
                      {t(
                        "When enabled, users must provide a valid email address during signup. When disabled, providing an email address becomes optional during registration."
                      )}
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={requireEmail}
                      onChange={(e) => setRequireEmail(e.target.checked)}
                    />
                    <div
                      className={`w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--color-primary)]`}
                    ></div>
                  </label>
                </div>

                {/* Setting 3: Enable Language Switcher */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-slate-200/80 rounded-2xl dark:border-gray-800 bg-slate-50/70 dark:bg-white/[0.02] gap-4">
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
                    <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
                      {t(
                        "Control visibility of the language toggle button across the entire platform. When disabled, the language switcher button is completely hidden from users."
                      )}
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={enableLanguageSwitcher}
                      onChange={(e) => setEnableLanguageSwitcher(e.target.checked)}
                    />
                    <div
                      className={`w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--color-primary)]`}
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
                    <p className="text-xs text-slate-400 mt-1.5">
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
                    <p className="text-xs text-slate-400 mt-1.5">
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
                    <p className="text-xs text-slate-400 mt-1.5">
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
                    <p className="text-xs text-slate-400 mt-1.5">
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
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
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
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
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
                    <p className="text-xs text-slate-400">
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
                        <span className="text-xs text-slate-500">{t("Active Tab Icon")}</span>
                        <button
                          type="button"
                          onClick={() => setFaviconUrl("")}
                          className="text-xs text-red-500 hover:underline ml-auto"
                        >
                          {t("Remove")}
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-slate-400">
                      {isRTL
                        ? "این آیکون در تب مرورگر (کنار نام سایت در برگه مرورگر) قرار می‌گیرد."
                        : "Applies to the browser tab icon next to the title."}
                    </p>
                  </div>
                </div>
              </div>
            </ComponentCard>

            {/* Metadata Info & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80 dark:border-gray-800">
              <div className="text-xs text-slate-400 dark:text-gray-500">
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
