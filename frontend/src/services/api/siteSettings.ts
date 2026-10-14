import { apiClient } from "./client";

export interface SiteSettings {
  id?: number;
  require_access_code: boolean;
  require_email: boolean;
  updated_at?: string;
  updated_by?: number | null;
  updated_by_username?: string | null;
}

export interface RegistrationConfig {
  require_access_code: boolean;
  require_email: boolean;
}

/**
 * Fetch system runtime settings (superadmin only).
 */
export async function getSiteSettingsApi(): Promise<SiteSettings> {
  return apiClient<SiteSettings>("/api/site-settings/", {
    method: "GET",
  });
}

/**
 * Update system runtime settings (superadmin only).
 */
export async function updateSiteSettingsApi(
  payload: Partial<Pick<SiteSettings, "require_access_code" | "require_email">>
): Promise<SiteSettings> {
  return apiClient<SiteSettings>("/api/site-settings/", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/**
 * Fetch public registration requirements (access code / email neediness).
 */
export async function getRegistrationConfigApi(): Promise<RegistrationConfig> {
  return apiClient<RegistrationConfig>("/api/auth/registration-config/", {
    method: "GET",
  });
}
