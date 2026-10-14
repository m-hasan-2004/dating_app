"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/context/LanguageContext";
import {
  getSiteSettingsApi,
  updateSiteSettingsApi,
  SiteSettings,
} from "@/services/api/siteSettings";
import { formatDate } from "@/utils/formatters";

export default function SiteSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, isRTL } = useLanguage();
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
      });
      setSettings(updated);
      setRequireAccessCode(updated.require_access_code);
      setRequireEmail(updated.require_email);
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
        {/* Header summary */}
        <ComponentCard
          title={t("System & Registration Rules")}
          desc={t(
            "Manage core platform policies. These settings dynamically govern public registration requirements for all new users."
          )}
        >
          {error && (
            <div className="p-4 mb-5 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400 font-medium">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="p-4 mb-5 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900/30 dark:text-green-400 font-medium">
              {successMessage}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
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

              {/* Metadata Info */}
              {settings && settings.updated_at && (
                <div className="text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-4">
                  <span>
                    {t("Last modified")}: {formatDate(settings.updated_at)}
                  </span>
                  {settings.updated_by_username && (
                    <span>
                      {t("Updated by")}: {settings.updated_by_username}
                    </span>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  size="md"
                  type="submit"
                  disabled={isSaving}
                  className="min-w-[130px]"
                >
                  {isSaving ? t("Saving...") : t("Save Settings")}
                </Button>
              </div>
            </form>
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
