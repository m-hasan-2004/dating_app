import { Outfit } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/hooks/use-auth';
import { LanguageProvider } from '@/context/LanguageContext';
import { BrandingProvider } from '@/context/BrandingContext';
import { LanguageToggleButton } from '@/components/common/LanguageToggleButton';
import DynamicPageTitle from '@/components/common/DynamicPageTitle';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | امین وصال',
    default: 'امین وصال',
  },
  description: 'مرکز همسان‌گزینی و ازدواج دائم امین وصال قم',
  icons: {
    icon: '/media/site_branding/favicons/favicon.png',
    shortcut: '/media/site_branding/favicons/favicon.png',
    apple: '/media/site_branding/favicons/favicon.png',
  },
};

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Synchronous blocking script: eliminates FOUC and theme/color flash before initial browser paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  try {
    var r = document.documentElement;

    // 1. Dark Mode initialization
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      r.classList.add('dark');
    } else {
      r.classList.remove('dark');
    }

    // 2. Color Palette & Primary/Accent Color resolution
    var PRESETS = {
      default: { primary: '#465fff', accent: '#3641f5' },
      emerald: { primary: '#10b981', accent: '#059669' },
      purple: { primary: '#8b5cf6', accent: '#7c3aed' },
      rose: { primary: '#f43f5e', accent: '#e11d48' },
      amber: { primary: '#f59e0b', accent: '#d97706' },
      indigo: { primary: '#6366f1', accent: '#4f46e5' },
    };

    var cachedPalette = localStorage.getItem('branding_color_palette') || 'custom';
    var cachedPrimary = localStorage.getItem('branding_custom_primary');
    var cachedSecondary = localStorage.getItem('branding_custom_secondary');

    var primaryColor = cachedPrimary || (PRESETS[cachedPalette] ? PRESETS[cachedPalette].primary : '#289333');
    var accentColor = cachedSecondary || (PRESETS[cachedPalette] ? PRESETS[cachedPalette].accent : primaryColor);

    function hexToRgb(hex) {
      if (!hex || typeof hex !== 'string') return null;
      var c = hex.replace('#', '').trim();
      if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
      if (c.length === 6) {
        return [parseInt(c.substring(0, 2), 16), parseInt(c.substring(2, 4), 16), parseInt(c.substring(4, 6), 16)];
      }
      return null;
    }

    function generateShades(hex) {
      var rgb = hexToRgb(hex);
      if (!rgb) return null;
      var rVal = rgb[0] / 255, gVal = rgb[1] / 255, bVal = rgb[2] / 255;
      var max = Math.max(rVal, gVal, bVal), min = Math.min(rVal, gVal, bVal);
      var h = 0, s = 0, l = (max + min) / 2;
      if (max !== min) {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case rVal: h = (gVal - bVal) / d + (gVal < bVal ? 6 : 0); break;
          case gVal: h = (bVal - rVal) / d + 2; break;
          case bVal: h = (rVal - gVal) / d + 4; break;
        }
        h /= 6;
      }
      var hDeg = Math.round(h * 360), sPct = Math.round(s * 100);
      function hslToHex(hue, sat, lum) {
        lum /= 100;
        var a = (sat * Math.min(lum, 1 - lum)) / 100;
        var f = function(n) {
          var k = (n + hue / 30) % 12;
          var color = lum - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
          return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return '#' + f(0) + f(8) + f(4);
      }
      return {
        '25': hslToHex(hDeg, Math.min(sPct, 95), 98),
        '50': hslToHex(hDeg, Math.min(sPct, 95), 96),
        '100': hslToHex(hDeg, Math.min(sPct, 90), 91),
        '200': hslToHex(hDeg, Math.min(sPct, 85), 82),
        '300': hslToHex(hDeg, Math.min(sPct, 80), 71),
        '400': hslToHex(hDeg, Math.min(sPct, 75), 60),
        '500': hex,
        '600': hslToHex(hDeg, Math.min(sPct + 5, 100), 44),
        '700': hslToHex(hDeg, Math.min(sPct + 10, 100), 35),
        '800': hslToHex(hDeg, Math.min(sPct + 10, 100), 27),
        '900': hslToHex(hDeg, Math.min(sPct + 10, 100), 20),
        '950': hslToHex(hDeg, Math.min(sPct + 15, 100), 12),
      };
    }

    var shades = generateShades(primaryColor);
    if (shades) {
      Object.keys(shades).forEach(function(k) {
        r.style.setProperty('--color-brand-' + k, shades[k]);
      });
    }

    var rgb = hexToRgb(primaryColor);
    r.style.setProperty('--color-primary', primaryColor);
    if (rgb) r.style.setProperty('--color-primary-rgb', rgb.join(','));
    r.style.setProperty('--color-accent', accentColor);

    // 3. Canvas light & dark background colors
    var cLight = localStorage.getItem('branding_canvas_light') || '#f8fafc';
    var cDark = localStorage.getItem('branding_canvas_dark') || '#131127';
    r.style.setProperty('--color-canvas-light', cLight);
    r.style.setProperty('--color-canvas-dark', cDark);

    // 4. Custom font
    var cFont = localStorage.getItem('branding_font_family') || 'Vazirmatn';
    r.style.setProperty('--font-active', "'" + cFont + "', var(--font-outfit), Vazirmatn, Tahoma, sans-serif");
  } catch (e) {}
})();`,
          }}
        />
      </head>
      <body className={`${outfit.className} text-slate-800 dark:text-gray-100 min-h-screen`} suppressHydrationWarning>
        <LanguageProvider>
          <BrandingProvider>
            <ThemeProvider>
              <AuthProvider>
                <SidebarProvider>
                  <DynamicPageTitle />
                  {children}
                  <LanguageToggleButton />
                </SidebarProvider>
              </AuthProvider>
            </ThemeProvider>
          </BrandingProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

