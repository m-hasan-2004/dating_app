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

export function resolveMediaUrl(url: string | undefined | null): string {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const backendBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${backendBase}${cleanPath}`;
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
  enableIdentityAndBirthCert: boolean;
  enableNextjsToolbar: boolean;
  logoUrl: string;
  faviconUrl: string;
  fontFamily: string;
  customFontData: string;
  setFontFamily: (font: string, customData?: string) => void;
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
    enableIdentityAndBirthCert?: boolean;
    enableNextjsToolbar?: boolean;
    logoUrl?: string;
    faviconUrl?: string;
    fontFamily?: string;
    customFontData?: string;
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
  enableIdentityAndBirthCert: true,
  enableNextjsToolbar: true,
  logoUrl: '',
  faviconUrl: '',
  fontFamily: 'Vazirmatn',
  customFontData: '',
};

const BrandingContext = createContext<BrandingContextType>({
  ...DEFAULT_BRANDING,
  siteName: DEFAULT_BRANDING.siteNameFa,
  siteTagline: DEFAULT_BRANDING.siteTaglineFa,
  setFontFamily: () => {},
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
  const [enableIdentityAndBirthCert, setEnableIdentityAndBirthCert] = useState(DEFAULT_BRANDING.enableIdentityAndBirthCert);
  const [enableNextjsToolbar, setEnableNextjsToolbar] = useState(DEFAULT_BRANDING.enableNextjsToolbar);
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [fontFamily, setFontFamilyState] = useState(DEFAULT_BRANDING.fontFamily);
  const [customFontData, setCustomFontDataState] = useState(DEFAULT_BRANDING.customFontData);

  // Apply or suppress Next.js dev toolbar
  const applyNextjsToolbar = useCallback((enable: boolean) => {
    if (typeof document === 'undefined') return;
    const styleId = 'nextjs-dev-toolbar-toggle-style';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!enable) {
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = `
        nextjs-portal,
        [data-nextjs-toast],
        #nextjs-dev-tools,
        div[data-nextjs-dev-tools-button],
        .nextjs-toast-errors-parent,
        [data-nextjs-dialog-overlay] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `;
    } else {
      if (styleEl) {
        styleEl.remove();
      }
    }
  }, []);

  // Apply font family globally to documentElement
  const applyFontFamily = useCallback((font: string, customData?: string) => {
    if (typeof document === 'undefined') return;
    const styleId = 'custom-site-font-style';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

    if (font === 'custom' && customData) {
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }
      const fontUrl = customData.startsWith('/') && typeof window !== 'undefined'
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${customData}`
        : customData;

      styleEl.textContent = `
        @font-face {
          font-family: 'CustomUploadedFont';
          src: url('${fontUrl}');
          font-display: swap;
        }
        :root, html, body, [dir="rtl"] body {
          --font-custom: 'CustomUploadedFont', var(--font-outfit), Vazirmatn, Tahoma, sans-serif !important;
          font-family: 'CustomUploadedFont', var(--font-outfit), Vazirmatn, Tahoma, sans-serif !important;
        }
      `;
      document.documentElement.style.setProperty('--font-active', "'CustomUploadedFont', var(--font-outfit), Vazirmatn, Tahoma, sans-serif");
    } else {
      if (styleEl) {
        styleEl.remove();
      }
      const activeFont = font || 'Vazirmatn';
      const fontStack = `'${activeFont}', var(--font-outfit), Vazirmatn, Tahoma, sans-serif`;
      document.documentElement.style.setProperty('--font-active', fontStack);
      document.body.style.fontFamily = fontStack;
    }
  }, []);

  const setFontFamily = useCallback((font: string, customData?: string) => {
    setFontFamilyState(font);
    if (customData !== undefined) setCustomFontDataState(customData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('branding_font_family', font);
      if (customData) localStorage.setItem('branding_custom_font_data', customData);
      else if (font !== 'custom') localStorage.removeItem('branding_custom_font_data');
    }
    applyFontFamily(font, customData !== undefined ? customData : customFontData);
  }, [applyFontFamily, customFontData]);

  // Dynamically update browser tab favicon icon
  const updateTabFavicon = useCallback((url: string) => {
    if (typeof document === 'undefined') return;
    try {
      const activeIcon = url || '/favicon.ico';
      const baseUrl =
        activeIcon.startsWith('/') && !activeIcon.startsWith('/favicon.ico') && typeof window !== 'undefined'
          ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${activeIcon}`
          : activeIcon;

      const resolvedUrl = baseUrl.startsWith('data:')
        ? baseUrl
        : `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;

      const existingLinks = document.querySelectorAll<HTMLLinkElement>(
        "link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon'], link[rel*='icon']"
      );
      existingLinks.forEach((el) => el.remove());

      const rels = ['icon', 'shortcut icon', 'apple-touch-icon'];
      rels.forEach((rel) => {
        const link = document.createElement('link');
        link.rel = rel;
        link.type = resolvedUrl.includes('.svg') ? 'image/svg+xml' : 'image/png';
        link.href = resolvedUrl;
        document.head.appendChild(link);
      });
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
    enableIdentityAndBirthCert?: boolean;
    enableNextjsToolbar?: boolean;
    logoUrl?: string;
    faviconUrl?: string;
    fontFamily?: string;
    customFontData?: string;
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
    if (data.enableIdentityAndBirthCert !== undefined) {
      setEnableIdentityAndBirthCert(data.enableIdentityAndBirthCert);
      if (typeof window !== 'undefined') {
        localStorage.setItem('branding_enable_identity_birth_cert', String(data.enableIdentityAndBirthCert));
      }
    }
    if (data.enableNextjsToolbar !== undefined) {
      setEnableNextjsToolbar(data.enableNextjsToolbar);
      if (typeof window !== 'undefined') {
        localStorage.setItem('branding_enable_nextjs_toolbar', String(data.enableNextjsToolbar));
      }
      applyNextjsToolbar(data.enableNextjsToolbar);
    }
    if (data.colorPalette !== undefined) {
      setColorPaletteState(data.colorPalette);
      applyPalette(data.colorPalette, data.customPrimaryColor || customPrimaryColor, data.customSecondaryColor || customSecondaryColor);
    }
    if (data.logoUrl !== undefined) setLogoUrl(resolveMediaUrl(data.logoUrl));
    if (data.fontFamily !== undefined) {
      setFontFamilyState(data.fontFamily);
      if (typeof window !== 'undefined') {
        localStorage.setItem('branding_font_family', data.fontFamily);
      }
    }
    if (data.customFontData !== undefined) {
      setCustomFontDataState(data.customFontData);
      if (typeof window !== 'undefined') {
        if (data.customFontData) localStorage.setItem('branding_custom_font_data', data.customFontData);
        else localStorage.removeItem('branding_custom_font_data');
      }
    }
    if (data.fontFamily !== undefined || data.customFontData !== undefined) {
      applyFontFamily(data.fontFamily ?? fontFamily, data.customFontData ?? customFontData);
    }
    if (data.faviconUrl !== undefined) {
      const resolvedFav = resolveMediaUrl(data.faviconUrl);
      setFaviconUrl(resolvedFav);
      updateTabFavicon(resolvedFav || resolveMediaUrl(data.logoUrl) || '');
    } else if (data.logoUrl !== undefined) {
      updateTabFavicon(resolveMediaUrl(data.logoUrl));
    }
  }, [applyCanvasColors, applyPalette, applyFontFamily, applyNextjsToolbar, canvasDarkColor, canvasLightColor, customPrimaryColor, customSecondaryColor, fontFamily, customFontData, updateTabFavicon]);

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
      if (config.enable_identity_and_birth_cert !== undefined) {
        setEnableIdentityAndBirthCert(config.enable_identity_and_birth_cert);
      }
      if (config.enable_nextjs_toolbar !== undefined) {
        setEnableNextjsToolbar(config.enable_nextjs_toolbar);
        applyNextjsToolbar(config.enable_nextjs_toolbar);
      }
      if (config.color_palette) {
        const pal = config.color_palette as ColorPalette;
        setColorPaletteState(pal);
        applyPalette(pal, config.custom_primary_color, config.custom_secondary_color);
      }
      if (config.font_family) {
        setFontFamilyState(config.font_family);
        if (config.custom_font_data !== undefined) setCustomFontDataState(config.custom_font_data);
        applyFontFamily(config.font_family, config.custom_font_data);
      }
      if (config.logo_url !== undefined) setLogoUrl(resolveMediaUrl(config.logo_url));
      if (config.favicon_url !== undefined) {
        const resolvedFav = resolveMediaUrl(config.favicon_url);
        setFaviconUrl(resolvedFav);
        updateTabFavicon(resolvedFav || resolveMediaUrl(config.logo_url) || '');
      } else if (config.logo_url) {
        updateTabFavicon(resolveMediaUrl(config.logo_url));
      }
    } catch {
      // Fallback gracefully
    }
  }, [applyCanvasColors, applyPalette, applyFontFamily, applyNextjsToolbar, updateTabFavicon]);

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
    setEnableIdentityAndBirthCert(true);
    setEnableNextjsToolbar(true);
    setLogoUrl('');
    setFaviconUrl('');
    setFontFamilyState(DEFAULT_BRANDING.fontFamily);
    setCustomFontDataState(DEFAULT_BRANDING.customFontData);
    applyPalette('default');
    applyCanvasColors('', '');
    applyFontFamily(DEFAULT_BRANDING.fontFamily, '');
    applyNextjsToolbar(true);
    updateTabFavicon('/favicon.ico');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('branding_color_palette');
      localStorage.removeItem('branding_custom_primary');
      localStorage.removeItem('branding_custom_secondary');
      localStorage.removeItem('branding_canvas_light');
      localStorage.removeItem('branding_canvas_dark');
      localStorage.removeItem('branding_enable_language_switcher');
      localStorage.removeItem('branding_enable_identity_birth_cert');
      localStorage.removeItem('branding_enable_nextjs_toolbar');
      localStorage.removeItem('branding_font_family');
      localStorage.removeItem('branding_custom_font_data');
    }
  }, [applyCanvasColors, applyPalette, applyFontFamily, applyNextjsToolbar, updateTabFavicon]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cachedPalette = localStorage.getItem('branding_color_palette') as ColorPalette;
      const cachedPrimary = localStorage.getItem('branding_custom_primary') || '';
      const cachedSecondary = localStorage.getItem('branding_custom_secondary') || '';
      const cachedCanvasLight = localStorage.getItem('branding_canvas_light') || '';
      const cachedCanvasDark = localStorage.getItem('branding_canvas_dark') || '';
      const cachedEnableLang = localStorage.getItem('branding_enable_language_switcher');
      const cachedEnableIdentity = localStorage.getItem('branding_enable_identity_birth_cert');
      const cachedEnableToolbar = localStorage.getItem('branding_enable_nextjs_toolbar');
      const cachedFont = localStorage.getItem('branding_font_family') || 'Vazirmatn';
      const cachedCustomFont = localStorage.getItem('branding_custom_font_data') || '';

      if (cachedPrimary) setCustomPrimaryColor(cachedPrimary);
      if (cachedSecondary) setCustomSecondaryColor(cachedSecondary);
      if (cachedCanvasLight) setCanvasLightColor(cachedCanvasLight);
      if (cachedCanvasDark) setCanvasDarkColor(cachedCanvasDark);
      if (cachedEnableLang !== null) setEnableLanguageSwitcher(cachedEnableLang === 'true');
      if (cachedEnableIdentity !== null) setEnableIdentityAndBirthCert(cachedEnableIdentity === 'true');
      if (cachedEnableToolbar !== null) {
        const isToolbarEnabled = cachedEnableToolbar === 'true';
        setEnableNextjsToolbar(isToolbarEnabled);
        applyNextjsToolbar(isToolbarEnabled);
      }
      if (cachedFont) {
        setFontFamilyState(cachedFont);
        if (cachedCustomFont) setCustomFontDataState(cachedCustomFont);
        applyFontFamily(cachedFont, cachedCustomFont);
      }
      if (cachedCanvasLight || cachedCanvasDark) {
        applyCanvasColors(cachedCanvasLight, cachedCanvasDark);
      }
      if (cachedPalette) {
        setColorPaletteState(cachedPalette);
        applyPalette(cachedPalette, cachedPrimary, cachedSecondary);
      }
    }
    refreshBranding();
  }, [applyCanvasColors, applyPalette, applyFontFamily, applyNextjsToolbar, refreshBranding]);

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
        enableIdentityAndBirthCert,
        enableNextjsToolbar,
        logoUrl,
        faviconUrl,
        fontFamily,
        customFontData,
        setFontFamily,
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
