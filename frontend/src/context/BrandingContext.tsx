'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getRegistrationConfigApi } from '@/services/api/siteSettings';
import { useTranslation } from '@/context/LanguageContext';

export type ColorPalette = 'default' | 'emerald' | 'purple' | 'rose' | 'amber' | 'indigo';

interface BrandingContextType {
  siteNameFa: string;
  siteNameEn: string;
  siteName: string;
  colorPalette: ColorPalette;
  logoUrl: string;
  setColorPalette: (palette: ColorPalette) => void;
  setBranding: (data: {
    siteNameFa?: string;
    siteNameEn?: string;
    colorPalette?: ColorPalette;
    logoUrl?: string;
  }) => void;
  refreshBranding: () => Promise<void>;
}

const BrandingContext = createContext<BrandingContextType>({
  siteNameFa: 'سامانه همسان‌گزینی و ازدواج دائم',
  siteNameEn: 'TailAdmin Matchmaking',
  siteName: 'سامانه همسان‌گزینی و ازدواج دائم',
  colorPalette: 'default',
  logoUrl: '',
  setColorPalette: () => {},
  setBranding: () => {},
  refreshBranding: async () => {},
});

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useTranslation();
  const [siteNameFa, setSiteNameFa] = useState('سامانه همسان‌گزینی و ازدواج دائم');
  const [siteNameEn, setSiteNameEn] = useState('TailAdmin Matchmaking');
  const [colorPalette, setColorPaletteState] = useState<ColorPalette>('default');
  const [logoUrl, setLogoUrl] = useState('');

  // Apply palette to <html> attribute
  const applyPalette = useCallback((palette: ColorPalette) => {
    if (typeof document !== 'undefined') {
      if (palette === 'default') {
        document.documentElement.removeAttribute('data-palette');
      } else {
        document.documentElement.setAttribute('data-palette', palette);
      }
    }
  }, []);

  const setColorPalette = useCallback((palette: ColorPalette) => {
    setColorPaletteState(palette);
    applyPalette(palette);
    if (typeof window !== 'undefined') {
      localStorage.setItem('branding_color_palette', palette);
    }
  }, [applyPalette]);

  const setBranding = useCallback((data: {
    siteNameFa?: string;
    siteNameEn?: string;
    colorPalette?: ColorPalette;
    logoUrl?: string;
  }) => {
    if (data.siteNameFa !== undefined) setSiteNameFa(data.siteNameFa);
    if (data.siteNameEn !== undefined) setSiteNameEn(data.siteNameEn);
    if (data.colorPalette !== undefined) setColorPalette(data.colorPalette);
    if (data.logoUrl !== undefined) setLogoUrl(data.logoUrl);
  }, [setColorPalette]);

  const refreshBranding = useCallback(async () => {
    try {
      const config = await getRegistrationConfigApi();
      if (config.site_name_fa) setSiteNameFa(config.site_name_fa);
      if (config.site_name_en) setSiteNameEn(config.site_name_en);
      if (config.color_palette) {
        const pal = config.color_palette as ColorPalette;
        setColorPaletteState(pal);
        applyPalette(pal);
      }
      if (config.logo_url !== undefined) setLogoUrl(config.logo_url);
    } catch {
      // Fallback gracefully to existing defaults
    }
  }, [applyPalette]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cachedPalette = localStorage.getItem('branding_color_palette') as ColorPalette;
      if (cachedPalette) {
        setColorPaletteState(cachedPalette);
        applyPalette(cachedPalette);
      }
    }
    refreshBranding();
  }, [applyPalette, refreshBranding]);

  const siteName = language === 'fa' ? siteNameFa : siteNameEn;

  return (
    <BrandingContext.Provider
      value={{
        siteNameFa,
        siteNameEn,
        siteName,
        colorPalette,
        logoUrl,
        setColorPalette,
        setBranding,
        refreshBranding,
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => useContext(BrandingContext);
