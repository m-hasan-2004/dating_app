"use client";

import React, { useEffect, useState, useCallback } from "react";
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

const PALETTES: { id: ColorPalette; nameKey: string; color: string; ringClass: string }[] = [
  { id: "default", nameKey: "Default Blue", color: "#465fff", ringClass: "ring-blue-500" },
  { id: "emerald", nameKey: "Emerald Green", color: "#10b981", ringClass: "ring-emerald-500" },
  { id: "purple", nameKey: "Royal Purple", color: "#8b5cf6", ringClass: "ring-purple-500" },
  { id: "rose", nameKey: "Rose Red", color: "#f43f5e", ringClass: "ring-rose-500" },
  { id: "amber", nameKey: "Warm Amber", color: "#f59e0b", ringClass: "ring-amber-500" },
  { id: "indigo", nameKey: "Indigo", color: "#6366f1", ringClass: "ring-indigo-500" },
];

export default function SiteSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, isRTL } = useLanguage();
  const { setBranding } = useBranding();
  const router = useRouter();

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
  const [siteNameFa, setSiteNameFa] = useState<string>("سامانه همسان‌گزینی و ازدواج دائم");
  const [siteNameEn, setSiteNameEn] = useState<string>("TailAdmin Matchmaking");
  const [colorPalette, setColorPalette] = useState<ColorPalette>("default");
  const [logoUrl, setLogoUrl] = useState<string>("");

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
      if (data.site_name_fa) setSiteNameFa(data.site_name_fa);
      if (data.site_name_en) setSiteNameEn(data.site_name_en);
      if (data.color_palette) setColorPalette(data.color_palette as ColorPalette);
      if (data.logo_url) setLogoUrl(data.logo_url);
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

  if (authLoading || (!isSuperUser && !authLoading) || !siteSettingEnabled) {
    return null;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updated = await updateSiteSettingsApi({
        require_access_code: requireAccessCode,
        require_email: requireEmail,
        site_name_fa: siteNameFa,
        site_name_en: siteNameEn,
        color_palette: colorPalette,
        logo_url: logoUrl,
      });
      setSettings(updated);
      setRequireAccessCode(updated.require_access_code);
      setRequireEmail(updated.require_email);
      if (updated.site_name_fa) setSiteNameFa(updated.site_name_fa);
      if (updated.site_name_en) setSiteNameEn(updated.site_name_en);
      if (updated.color_palette) setColorPalette(updated.color_palette as ColorPalette);
      if (updated.logo_url !== undefined) setLogoUrl(updated.logo_url);

      // Sync active branding site-wide instantly
      setBranding({
        siteNameFa: updated.site_name_fa,
        siteNameEn: updated.site_name_en,
        colorPalette: updated.color_palette as ColorPalette,
        logoUrl: updated.logo_url,
      });

      setSuccessMessage(t("Site settings updated successfully."));
    } catch (err: any) {
      setError(err.message || t("Failed to update site settings."));
    } finally {
      setIsSaving(false);
    }
  };

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
            <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-gray-200 rounded-2xl dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02] gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-800 dark:text-white">
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
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
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
                      className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500`}
                    ></div>
                  </label>
                </div>

                {/* Setting 2: Require Email */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-gray-200 rounded-2xl dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02] gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-800 dark:text-white">
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
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
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
                      className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500`}
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
                {/* Site Names */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-white mb-2">
                      {t("Site Name (Persian)")}
                    </label>
                    <input
                      type="text"
                      value={siteNameFa}
                      onChange={(e) => setSiteNameFa(e.target.value)}
                      placeholder="سامانه همسان‌گزینی و ازدواج دائم"
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    />
                    <p className="text-xs text-gray-400 mt-1.5">
                      {isRTL ? "عنوانی که در هدر، سایدبار و صفحات ورود نمایش داده می‌شود." : "Displayed in headers, sidebar and auth pages in Persian mode."}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-white mb-2">
                      {t("Site Name (English)")}
                    </label>
                    <input
                      type="text"
                      value={siteNameEn}
                      onChange={(e) => setSiteNameEn(e.target.value)}
                      placeholder="TailAdmin Matchmaking"
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    />
                    <p className="text-xs text-gray-400 mt-1.5">
                      {isRTL ? "عنوانی که در حالت انگلیسی سایت نمایش داده می‌شود." : "Displayed when application language is switched to English."}
                    </p>
                  </div>
                </div>

                {/* Color Palette Picker */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-white mb-3">
                    {t("Color Palette")}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {PALETTES.map((pal) => {
                      const isSelected = colorPalette === pal.id;
                      return (
                        <button
                          key={pal.id}
                          type="button"
                          onClick={() => setColorPalette(pal.id)}
                          className={`flex flex-col items-center gap-2.5 p-3.5 rounded-2xl border transition-all cursor-pointer text-center ${
                            isSelected
                              ? `border-brand-500 bg-brand-50/30 dark:bg-brand-950/20 ring-2 ring-brand-500/40 shadow-sm`
                              : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900"
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-full shadow-md flex items-center justify-center text-white"
                            style={{ backgroundColor: pal.color }}
                          >
                            {isSelected && (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-gray-800 dark:text-white/90">
                            {t(pal.nameKey)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Logo URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-white mb-2">
                    {t("Logo URL")}
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <input
                      type="text"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    />
                    {logoUrl && (
                      <div className="shrink-0 p-1.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={logoUrl}
                          alt="Logo Preview"
                          className="h-8 w-auto max-w-[120px] object-contain rounded-md"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    {isRTL ? "در صورت خالی گذاشتن، آیکون اختصاصی پیش‌فرض همراه با نام سامانه نمایش می‌یابد." : "Leave empty to use the default platform icon and name badge."}
                  </p>
                </div>
              </div>
            </ComponentCard>

            {/* Metadata Info & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {settings && settings.updated_at && (
                  <span>
                    {t("Last modified")}: {formatDate(settings.updated_at)}
                    {settings.updated_by_username && ` (${t("Updated by")}: ${settings.updated_by_username})`}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
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
