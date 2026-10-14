import { Outfit } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/hooks/use-auth';
import { LanguageProvider } from '@/context/LanguageContext';
import { BrandingProvider } from '@/context/BrandingContext';
import { LanguageToggleButton } from '@/components/common/LanguageToggleButton';

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
      <body className={`${outfit.className} dark:bg-gray-900`} suppressHydrationWarning>
        <LanguageProvider>
          <BrandingProvider>
            <ThemeProvider>
              <AuthProvider>
                <SidebarProvider>
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

