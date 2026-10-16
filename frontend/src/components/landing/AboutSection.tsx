'use client';

import React from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { useBranding } from '@/context/BrandingContext';

export default function AboutSection() {
  const { t } = useTranslation();
  const { siteName } = useBranding();

  return (
    <section id="about" className="py-16 sm:py-24 bg-slate-50/70 dark:bg-white/[0.02] border-y border-slate-200/60 dark:border-gray-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold mb-3 border border-brand-500/20">
            <span>📖</span>
            <span>{t('About Us')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {t('About Our Mission')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            {t('Facilitating blessed unions through traditional ethics and modern discernment.')}
          </p>
        </div>

        {/* Two-Part Layout: Company Mission & Director Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Part 1: About the Platform / Mission (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-white dark:bg-gray-800/90 border border-slate-200/80 dark:border-gray-700/80 shadow-md">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white shadow-sm">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {t('Our Platform Mission')}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {siteName}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
                <p>
                  {t('Founded with the conviction that permanent marriage is the foundation of individual fulfillment and social flourishing. We combine secure technology with authentic values to offer a dignified alternative to superficial modern apps. Every profile is examined, each interaction is treated with reverence, and families are respected at every juncture.')}
                </p>
              </div>
            </div>

            {/* Core Values tags */}
            <div className="pt-8 mt-6 border-t border-slate-100 dark:border-gray-700/50 flex flex-wrap gap-2.5">
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-gray-700/60 text-xs font-bold text-slate-700 dark:text-slate-200">
                💎 {t('Family Oriented')}
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-gray-700/60 text-xs font-bold text-slate-700 dark:text-slate-200">
                🔒 {t('Strict Privacy Safeguards')}
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-gray-700/60 text-xs font-bold text-slate-700 dark:text-slate-200">
                🤝 {t('Dedicated Mediators')}
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-gray-700/60 text-xs font-bold text-slate-700 dark:text-slate-200">
                🌱 {t('Verified Members')}
              </span>
            </div>
          </div>

          {/* Part 2: Leadership / Director Bio (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-white via-white to-brand-50/30 dark:from-gray-800 dark:via-gray-800 dark:to-brand-950/20 border border-slate-200/80 dark:border-gray-700/80 shadow-md relative overflow-hidden">
            
            {/* Top decorative accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-bl-full pointer-events-none" />

            <div>
              <div className="flex items-center gap-4 mb-6">
                {/* Director Avatar Placeholder */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-brand-500/20 shrink-0">
                  <span>MR</span>
                </div>
                <div>
                  <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
                    {t('Executive Director')}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {t('Hojjat al-Islam Dr. M. Rezaei')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t('Specialist in Family Ethics & Counseling')}
                  </p>
                </div>
              </div>

              {/* Vision Quote */}
              <div className="relative p-5 rounded-2xl bg-white/80 dark:bg-gray-900/60 border border-slate-200/60 dark:border-gray-700/50 my-4 shadow-2xs">
                <span className="text-3xl text-brand-500/30 font-serif leading-none block mb-1">“</span>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 italic leading-relaxed">
                  {t('Director Vision Statement')}
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <svg className="w-4 h-4 text-brand-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{t('Qom Seminary & University Faculty')}</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
