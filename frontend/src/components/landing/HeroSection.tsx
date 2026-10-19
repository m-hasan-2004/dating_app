'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import { useBranding } from '@/context/BrandingContext';
import { useAuth } from '@/hooks/use-auth';

export default function HeroSection() {
  const { t, isRTL } = useTranslation();
  const { siteName, siteTagline } = useBranding();
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const trustBadges = [
    {
      title: t('100% Confidential'),
      desc: t('Privacy Protected'),
      icon: (
        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: t('Identity Verification'),
      desc: t('Verified Members'),
      icon: (
        <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      ),
    },
    {
      title: t('Supervised Meetings'),
      desc: t('Dedicated Mediators'),
      icon: (
        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="home" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[var(--color-primary)]/15 to-[var(--color-accent)]/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Subtle Tagline / Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] dark:bg-[var(--color-primary)]/20 text-xs sm:text-sm font-bold mb-6 border border-[var(--color-primary)]/20 shadow-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
            <span>{siteTagline || t('Secure & Honorable Matchmaking Platform')}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.2] sm:leading-[1.15] mb-6">
            <span className="block mb-2">{t('Secure & Honorable Matchmaking Platform')}</span>
            <span className="bg-gradient-to-r from-[var(--color-primary)] via-brand-500 to-[var(--color-accent)] bg-clip-text text-transparent">
              {siteName}
            </span>
          </h1>

          {/* Subtitle / Value proposition */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto mb-10">
            {t('Find your lifelong companion with dignity, privacy, and verified compatibility through our respectful matchmaking community.')}
          </p>

          {/* Call-to-action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {!mounted ? (
              <div className="w-full sm:w-[220px] h-[58px]" />
            ) : isAuthenticated ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 text-base font-extrabold rounded-2xl text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:brightness-105 active:scale-95 transition-all shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2"
              >
                <span>{t('Go to Dashboard')}</span>
                <svg className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            ) : (
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 text-base font-extrabold rounded-2xl text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:brightness-105 active:scale-95 transition-all shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 group"
              >
                <span>{t('Get Started Free')}</span>
                <svg className={`w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            )}

            <Link
              href="/terms"
              className="w-full sm:w-auto px-6 py-4 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors text-center"
            >
              {t('Explore Platform Rules')}
            </Link>
          </div>

          {/* Three Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 pt-4 max-w-4xl mx-auto">
            {trustBadges.map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-gray-700/60 flex items-center justify-center shrink-0">
                  {badge.icon}
                </div>
                <div className="text-start">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{badge.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
