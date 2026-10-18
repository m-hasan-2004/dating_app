import { apiClient } from "./client";

export interface SiteSettings {
  id?: number;
  require_access_code: boolean;
  require_email: boolean;
  enable_language_switcher?: boolean;
  enable_identity_and_birth_cert?: boolean;
  site_name_fa?: string;
  site_name_en?: string;
  site_tagline_fa?: string;
  site_tagline_en?: string;
  color_palette?: string;
  custom_primary_color?: string;
  custom_secondary_color?: string;
  canvas_light_color?: string;
  canvas_dark_color?: string;
  logo_url?: string;
  favicon_url?: string;
  font_family?: string;
  custom_font_data?: string;
  updated_at?: string;
  updated_by?: number | null;
  updated_by_username?: string | null;
}

export interface RegistrationConfig {
  require_access_code: boolean;
  require_email: boolean;
  enable_language_switcher?: boolean;
  enable_identity_and_birth_cert?: boolean;
  site_name_fa?: string;
  site_name_en?: string;
  site_tagline_fa?: string;
  site_tagline_en?: string;
  color_palette?: string;
  custom_primary_color?: string;
  custom_secondary_color?: string;
  canvas_light_color?: string;
  canvas_dark_color?: string;
  logo_url?: string;
  favicon_url?: string;
  font_family?: string;
  custom_font_data?: string;
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
  payload: Partial<SiteSettings>
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
