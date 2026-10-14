"use client";

import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { useTranslation } from "@/context/LanguageContext";
import { useBranding } from "@/context/BrandingContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const { siteName, logoUrl } = useBranding();

  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">
        {children}
        <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
          <div className="relative items-center justify-center flex z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-sm text-center px-4">
              <Link href="/" className="flex flex-col items-center gap-3 mb-6 group">
                {logoUrl ? (
                  <img src={logoUrl} alt={siteName} className="h-14 w-auto max-w-[220px] object-contain rounded-2xl shadow-lg" />
                ) : (
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-xl shadow-brand-500/25 group-hover:scale-105 transition-transform">
                    <svg className="w-9 h-9 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                )}
                <span className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
                  {siteName}
                </span>
              </Link>
              <p className="text-center text-sm text-gray-400 dark:text-white/70 leading-relaxed font-medium">
                {t("Marriage Matching Platform — Secure, Private & Verified")}
              </p>
            </div>
          </div>
        </div>
        <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}

