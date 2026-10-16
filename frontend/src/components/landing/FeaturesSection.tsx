'use client';

import React from 'react';
import { useTranslation } from '@/context/LanguageContext';

export default function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      title: t('Strict Privacy Safeguards'),
      desc: t('Your personal contact details are never exposed to other members without mediator authorization.'),
      badge: 'امنیت و رازداری',
      icon: (
        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      title: t('In-Depth Profiling'),
      desc: t('Complete life criteria, religious practices, economic status, and personal aspirations.'),
      badge: 'جامعیت اطلاعات',
      icon: (
        <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      title: t('Mediator Oversight'),
      desc: t('Experienced and trustworthy advisors facilitate connections and guide families respectfully.'),
      badge: 'واسطه‌گری امین',
      icon: (
        <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50/60 dark:bg-white/[0.02] border-y border-slate-200/60 dark:border-gray-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {t('Why Choose Our Matchmaking Service')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            {t('A principled approach to sacred marriage that respects family values, culture, and privacy.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="relative rounded-3xl p-8 bg-white dark:bg-gray-800/80 border border-slate-200/80 dark:border-gray-700/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-gray-900 flex items-center justify-center mb-6 shadow-xs border border-slate-100 dark:border-gray-800">
                {feat.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                {feat.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
