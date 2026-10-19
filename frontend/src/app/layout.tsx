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
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
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
      <body className={`${outfit.className} text-slate-800 dark:text-gray-100 min-h-screen`} suppressHydrationWarning>
        {/* Inline script: sets Amine Vesal green palette CSS vars synchronously before hydration — eliminates any color/branding flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  try {
    var r=document.documentElement;
    // Green #289333 palette shades
    var shades={'25':'#f2fbf2','50':'#e8f7e9','100':'#d0efd1','200':'#a2dfa5','300':'#6cca70','400':'#3db341','500':'#289333','600':'#1e7026','700':'#175a1e','800':'#124617','900':'#0d3410','950':'#071f09'};
    Object.keys(shades).forEach(function(k){r.style.setProperty('--color-brand-'+k,shades[k]);});
    r.style.setProperty('--color-primary','#289333');
    r.style.setProperty('--color-primary-rgb','40,147,51');
    r.style.setProperty('--color-accent','#1e7026');
    r.style.setProperty('--color-canvas-light','#f8fafc');
    r.style.setProperty('--color-canvas-dark','#131127');
    r.removeAttribute('data-palette');
  } catch(e){}
})();`,
          }}
        />
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

