'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getRegistrationConfigApi } from '@/services/api/siteSettings';
import { useTranslation } from '@/context/LanguageContext';

export type ColorPalette = 'default' | 'emerald' | 'purple' | 'rose' | 'amber' | 'indigo' | 'custom';

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return [r, g, b];
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return [r, g, b];
  }
  return null;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function generatePaletteFromHex(hex: string): Record<string, string> {
  const rgb = hexToRgb(hex);
  if (!rgb) return {};
  const [h, s] = rgbToHsl(rgb[0], rgb[1], rgb[2]);

  return {
    '25': hslToHex(h, Math.min(s, 95), 98),
    '50': hslToHex(h, Math.min(s, 95), 96),
    '100': hslToHex(h, Math.min(s, 90), 91),
    '200': hslToHex(h, Math.min(s, 85), 82),
    '300': hslToHex(h, Math.min(s, 80), 71),
    '400': hslToHex(h, Math.min(s, 75), 60),
    '500': hex,
    '600': hslToHex(h, Math.min(s + 5, 100), 44),
    '700': hslToHex(h, Math.min(s + 10, 100), 35),
    '800': hslToHex(h, Math.min(s + 10, 100), 27),
    '900': hslToHex(h, Math.min(s + 10, 100), 20),
    '950': hslToHex(h, Math.min(s + 15, 100), 12),
  };
}

interface BrandingContextType {
  siteNameFa: string;
  siteNameEn: string;
  siteName: string;
  siteTaglineFa: string;
  siteTaglineEn: string;
  siteTagline: string;
  colorPalette: ColorPalette;
  customPrimaryColor: string;
  customSecondaryColor: string;
  canvasLightColor: string;
  canvasDarkColor: string;
  enableLanguageSwitcher: boolean;
  logoUrl: string;
  faviconUrl: string;
  setColorPalette: (palette: ColorPalette, customHex?: string, customSecHex?: string) => void;
  setCanvasColors: (light?: string, dark?: string) => void;
  setBranding: (data: {
    siteNameFa?: string;
    siteNameEn?: string;
    siteTaglineFa?: string;
    siteTaglineEn?: string;
    colorPalette?: ColorPalette;
    customPrimaryColor?: string;
    customSecondaryColor?: string;
    canvasLightColor?: string;
    canvasDarkColor?: string;
    enableLanguageSwitcher?: boolean;
    logoUrl?: string;
    faviconUrl?: string;
  }) => void;
  refreshBranding: () => Promise<void>;
  restoreDefaults: () => Promise<void>;
}

const DEFAULT_BRANDING = {
  siteNameFa: 'سامانه همسان‌گزینی و ازدواج دائم',
  siteNameEn: 'TailAdmin Matchmaking',
  siteTaglineFa: 'پورتال همسان‌گزینی',
  siteTaglineEn: 'Matchmaking Portal',
  colorPalette: 'default' as ColorPalette,
  customPrimaryColor: '',
  customSecondaryColor: '',
  canvasLightColor: '',
  canvasDarkColor: '',
  enableLanguageSwitcher: true,
  logoUrl: '',
  faviconUrl: '',
};

const BrandingContext = createContext<BrandingContextType>({
  ...DEFAULT_BRANDING,
  siteName: DEFAULT_BRANDING.siteNameFa,
  siteTagline: DEFAULT_BRANDING.siteTaglineFa,
  setColorPalette: () => {},
  setCanvasColors: () => {},
  setBranding: () => {},
  refreshBranding: async () => {},
  restoreDefaults: async () => {},
});

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, t } = useTranslation();
  const [siteNameFa, setSiteNameFa] = useState(DEFAULT_BRANDING.siteNameFa);
  const [siteNameEn, setSiteNameEn] = useState(DEFAULT_BRANDING.siteNameEn);
  const [siteTaglineFa, setSiteTaglineFa] = useState(DEFAULT_BRANDING.siteTaglineFa);
  const [siteTaglineEn, setSiteTaglineEn] = useState(DEFAULT_BRANDING.siteTaglineEn);
  const [colorPalette, setColorPaletteState] = useState<ColorPalette>(DEFAULT_BRANDING.colorPalette);
  const [customPrimaryColor, setCustomPrimaryColor] = useState(DEFAULT_BRANDING.customPrimaryColor);
  const [customSecondaryColor, setCustomSecondaryColor] = useState(DEFAULT_BRANDING.customSecondaryColor);
  const [canvasLightColor, setCanvasLightColor] = useState(DEFAULT_BRANDING.canvasLightColor);
  const [canvasDarkColor, setCanvasDarkColor] = useState(DEFAULT_BRANDING.canvasDarkColor);
  const [enableLanguageSwitcher, setEnableLanguageSwitcher] = useState(DEFAULT_BRANDING.enableLanguageSwitcher);
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');

  // Dynamically update browser tab favicon icon
  const updateTabFavicon = useCallback((url: string) => {
    if (typeof document === 'undefined') return;
    try {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = url || '/favicon.ico';
    } catch {
      // Ignore in non-browser env
    }
  }, []);

  // Apply canvas light and dark colors to root
  const applyCanvasColors = useCallback((lightHex?: string, darkHex?: string) => {
    if (typeof document === 'undefined') return;
    if (lightHex && lightHex.startsWith('#')) {
      document.documentElement.style.setProperty('--color-canvas-light', lightHex);
      document.documentElement.style.setProperty('--color-slate-50', lightHex);
      const rgb = hexToRgb(lightHex);
      if (rgb) {
        const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
        const borderHex = hslToHex(h, Math.max(10, s), Math.max(68, l - 16));
        document.documentElement.style.setProperty('--color-canvas-light-border', borderHex);
      }
    } else {
      document.documentElement.style.removeProperty('--color-canvas-light');
      document.documentElement.style.removeProperty('--color-slate-50');
      document.documentElement.style.removeProperty('--color-canvas-light-border');
    }
    if (darkHex && darkHex.startsWith('#')) {
      document.documentElement.style.setProperty('--color-canvas-dark', darkHex);
      const rgb = hexToRgb(darkHex);
      if (rgb) {
        const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
        const surfaceHex = hslToHex(h, Math.min(100, s + 4), Math.min(90, l + 4));
        const borderHex = hslToHex(h, Math.min(100, s + 6), Math.min(90, l + 12));
        document.documentElement.style.setProperty('--color-canvas-dark-surface', surfaceHex);
        document.documentElement.style.setProperty('--color-canvas-dark-border', borderHex);
      }
    } else {
      document.documentElement.style.removeProperty('--color-canvas-dark');
      document.documentElement.style.removeProperty('--color-canvas-dark-surface');
      document.documentElement.style.removeProperty('--color-canvas-dark-border');
    }
  }, []);

  const setCanvasColors = useCallback((lightHex?: string, darkHex?: string) => {
    if (lightHex !== undefined) {
      setCanvasLightColor(lightHex);
      if (typeof window !== 'undefined') {
        if (lightHex) localStorage.setItem('branding_canvas_light', lightHex);
        else localStorage.removeItem('branding_canvas_light');
      }
    }
    if (darkHex !== undefined) {
      setCanvasDarkColor(darkHex);
      if (typeof window !== 'undefined') {
        if (darkHex) localStorage.setItem('branding_canvas_dark', darkHex);
        else localStorage.removeItem('branding_canvas_dark');
      }
    }
    applyCanvasColors(lightHex !== undefined ? lightHex : canvasLightColor, darkHex !== undefined ? darkHex : canvasDarkColor);
  }, [applyCanvasColors, canvasLightColor, canvasDarkColor]);

  // Apply colors to documentElement
  const applyPalette = useCallback((palette: ColorPalette, primaryHex?: string, secondaryHex?: string) => {
    if (typeof document === 'undefined') return;

    if (palette === 'custom' && primaryHex && primaryHex.startsWith('#')) {
      document.documentElement.removeAttribute('data-palette');
      const shades = generatePaletteFromHex(primaryHex);
      Object.entries(shades).forEach(([step, color]) => {
        document.documentElement.style.setProperty(`--color-brand-${step}`, color);
      });
      const rgb = hexToRgb(primaryHex);
      document.documentElement.style.setProperty('--color-primary', primaryHex);
      if (rgb) {
        document.documentElement.style.setProperty('--color-primary-rgb', `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`);
      }

      const accent = secondaryHex && secondaryHex.startsWith('#') ? secondaryHex : (shades['600'] || primaryHex);
      document.documentElement.style.setProperty('--color-accent', accent);
      const secRgb = hexToRgb(accent);
      if (secRgb) {
        document.documentElement.style.setProperty('--color-accent-rgb', `${secRgb[0]}, ${secRgb[1]}, ${secRgb[2]}`);
      }
    } else {
      // Clear custom inline styles
      const steps = ['25', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
      steps.forEach((step) => {
        document.documentElement.style.removeProperty(`--color-brand-${step}`);
      });
      document.documentElement.style.removeProperty('--color-primary');
      document.documentElement.style.removeProperty('--color-primary-rgb');
      document.documentElement.style.removeProperty('--color-accent');
      document.documentElement.style.removeProperty('--color-accent-rgb');

      if (palette === 'default') {
        document.documentElement.removeAttribute('data-palette');
      } else {
        document.documentElement.setAttribute('data-palette', palette);
      }
    }
  }, []);

  const setColorPalette = useCallback((palette: ColorPalette, customHex?: string, customSecHex?: string) => {
    setColorPaletteState(palette);
    const prim = customHex || customPrimaryColor;
    const sec = customSecHex || customSecondaryColor;
    applyPalette(palette, prim, sec);
    if (typeof window !== 'undefined') {
      localStorage.setItem('branding_color_palette', palette);
      if (customHex) localStorage.setItem('branding_custom_primary', customHex);
      if (customSecHex) localStorage.setItem('branding_custom_secondary', customSecHex);
    }
  }, [applyPalette, customPrimaryColor, customSecondaryColor]);

  const setBranding = useCallback((data: {
    siteNameFa?: string;
    siteNameEn?: string;
    siteTaglineFa?: string;
    siteTaglineEn?: string;
    colorPalette?: ColorPalette;
    customPrimaryColor?: string;
    customSecondaryColor?: string;
    canvasLightColor?: string;
    canvasDarkColor?: string;
    enableLanguageSwitcher?: boolean;
    logoUrl?: string;
    faviconUrl?: string;
  }) => {
    if (data.siteNameFa !== undefined) setSiteNameFa(data.siteNameFa);
    if (data.siteNameEn !== undefined) setSiteNameEn(data.siteNameEn);
    if (data.siteTaglineFa !== undefined) setSiteTaglineFa(data.siteTaglineFa);
    if (data.siteTaglineEn !== undefined) setSiteTaglineEn(data.siteTaglineEn);
    if (data.customPrimaryColor !== undefined) setCustomPrimaryColor(data.customPrimaryColor);
    if (data.customSecondaryColor !== undefined) setCustomSecondaryColor(data.customSecondaryColor);
    if (data.canvasLightColor !== undefined) {
      setCanvasLightColor(data.canvasLightColor);
      if (typeof window !== 'undefined') {
        if (data.canvasLightColor) localStorage.setItem('branding_canvas_light', data.canvasLightColor);
        else localStorage.removeItem('branding_canvas_light');
      }
    }
    if (data.canvasDarkColor !== undefined) {
      setCanvasDarkColor(data.canvasDarkColor);
      if (typeof window !== 'undefined') {
        if (data.canvasDarkColor) localStorage.setItem('branding_canvas_dark', data.canvasDarkColor);
        else localStorage.removeItem('branding_canvas_dark');
      }
    }
    if (data.canvasLightColor !== undefined || data.canvasDarkColor !== undefined) {
      applyCanvasColors(data.canvasLightColor ?? canvasLightColor, data.canvasDarkColor ?? canvasDarkColor);
    }
    if (data.enableLanguageSwitcher !== undefined) {
      setEnableLanguageSwitcher(data.enableLanguageSwitcher);
      if (typeof window !== 'undefined') {
        localStorage.setItem('branding_enable_language_switcher', String(data.enableLanguageSwitcher));
      }
    }
    if (data.colorPalette !== undefined) {
      setColorPaletteState(data.colorPalette);
      applyPalette(data.colorPalette, data.customPrimaryColor || customPrimaryColor, data.customSecondaryColor || customSecondaryColor);
    }
    if (data.logoUrl !== undefined) setLogoUrl(data.logoUrl);
    if (data.faviconUrl !== undefined) {
      setFaviconUrl(data.faviconUrl);
      updateTabFavicon(data.faviconUrl || data.logoUrl || '');
    } else if (data.logoUrl !== undefined) {
      updateTabFavicon(data.logoUrl);
    }
  }, [applyCanvasColors, applyPalette, canvasDarkColor, canvasLightColor, customPrimaryColor, customSecondaryColor, updateTabFavicon]);

  const refreshBranding = useCallback(async () => {
    try {
      const config = await getRegistrationConfigApi();
      if (config.site_name_fa) setSiteNameFa(config.site_name_fa);
      if (config.site_name_en) setSiteNameEn(config.site_name_en);
      if (config.site_tagline_fa) setSiteTaglineFa(config.site_tagline_fa);
      if (config.site_tagline_en) setSiteTaglineEn(config.site_tagline_en);
      if (config.custom_primary_color !== undefined) setCustomPrimaryColor(config.custom_primary_color);
      if (config.custom_secondary_color !== undefined) setCustomSecondaryColor(config.custom_secondary_color);
      if (config.canvas_light_color !== undefined) {
        setCanvasLightColor(config.canvas_light_color);
        applyCanvasColors(config.canvas_light_color, config.canvas_dark_color);
      }
      if (config.canvas_dark_color !== undefined) {
        setCanvasDarkColor(config.canvas_dark_color);
        applyCanvasColors(config.canvas_light_color, config.canvas_dark_color);
      }
      if (config.enable_language_switcher !== undefined) {
        setEnableLanguageSwitcher(config.enable_language_switcher);
      }
      if (config.color_palette) {
        const pal = config.color_palette as ColorPalette;
        setColorPaletteState(pal);
        applyPalette(pal, config.custom_primary_color, config.custom_secondary_color);
      }
      if (config.logo_url !== undefined) setLogoUrl(config.logo_url);
      if (config.favicon_url !== undefined) {
        setFaviconUrl(config.favicon_url);
        updateTabFavicon(config.favicon_url || config.logo_url || '');
      } else if (config.logo_url) {
        updateTabFavicon(config.logo_url);
      }
    } catch {
      // Fallback gracefully
    }
  }, [applyCanvasColors, applyPalette, updateTabFavicon]);

  const restoreDefaults = useCallback(async () => {
    setSiteNameFa(DEFAULT_BRANDING.siteNameFa);
    setSiteNameEn(DEFAULT_BRANDING.siteNameEn);
    setSiteTaglineFa(DEFAULT_BRANDING.siteTaglineFa);
    setSiteTaglineEn(DEFAULT_BRANDING.siteTaglineEn);
    setColorPaletteState('default');
    setCustomPrimaryColor('');
    setCustomSecondaryColor('');
    setCanvasLightColor('');
    setCanvasDarkColor('');
    setEnableLanguageSwitcher(true);
    setLogoUrl('');
    setFaviconUrl('');
    applyPalette('default');
    applyCanvasColors('', '');
    updateTabFavicon('/favicon.ico');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('branding_color_palette');
      localStorage.removeItem('branding_custom_primary');
      localStorage.removeItem('branding_custom_secondary');
      localStorage.removeItem('branding_canvas_light');
      localStorage.removeItem('branding_canvas_dark');
      localStorage.removeItem('branding_enable_language_switcher');
    }
  }, [applyCanvasColors, applyPalette, updateTabFavicon]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cachedPalette = localStorage.getItem('branding_color_palette') as ColorPalette;
      const cachedPrimary = localStorage.getItem('branding_custom_primary') || '';
      const cachedSecondary = localStorage.getItem('branding_custom_secondary') || '';
      const cachedCanvasLight = localStorage.getItem('branding_canvas_light') || '';
      const cachedCanvasDark = localStorage.getItem('branding_canvas_dark') || '';
      const cachedEnableLang = localStorage.getItem('branding_enable_language_switcher');
      if (cachedPrimary) setCustomPrimaryColor(cachedPrimary);
      if (cachedSecondary) setCustomSecondaryColor(cachedSecondary);
      if (cachedCanvasLight) setCanvasLightColor(cachedCanvasLight);
      if (cachedCanvasDark) setCanvasDarkColor(cachedCanvasDark);
      if (cachedEnableLang !== null) setEnableLanguageSwitcher(cachedEnableLang === 'true');
      if (cachedCanvasLight || cachedCanvasDark) {
        applyCanvasColors(cachedCanvasLight, cachedCanvasDark);
      }
      if (cachedPalette) {
        setColorPaletteState(cachedPalette);
        applyPalette(cachedPalette, cachedPrimary, cachedSecondary);
      }
    }
    refreshBranding();
  }, [applyCanvasColors, applyPalette, refreshBranding]);

  const siteName = language === 'fa' ? siteNameFa : siteNameEn;
  const siteTagline = language === 'fa' ? (siteTaglineFa || t('Matchmaking Portal')) : (siteTaglineEn || 'Matchmaking Portal');

  return (
    <BrandingContext.Provider
      value={{
        siteNameFa,
        siteNameEn,
        siteName,
        siteTaglineFa,
        siteTaglineEn,
        siteTagline,
        colorPalette,
        customPrimaryColor,
        customSecondaryColor,
        canvasLightColor,
        canvasDarkColor,
        enableLanguageSwitcher,
        logoUrl,
        faviconUrl,
        setColorPalette,
        setCanvasColors,
        setBranding,
        refreshBranding,
        restoreDefaults,
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => useContext(BrandingContext);
