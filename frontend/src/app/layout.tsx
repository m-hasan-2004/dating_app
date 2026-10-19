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
  title: 'امین وصال',
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

