'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';

export default function RulesSection() {
  const { t, isRTL } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const rules = [
    {
      title: t('Truthful Information'),
      desc: t('Members commit to providing genuine, accurate, and up-to-date demographic, marital history, and health details. Any falsification leads to immediate account termination.'),
      number: '۰۱',
      enNumber: '01',
    },
    {
      title: t('Sole Purpose of Permanent Marriage'),
      desc: t('This service is exclusively dedicated to honorable permanent marriage. Casual dating, temporary relations, or commercial exploitation are strictly prohibited.'),
      number: '۰۲',
      enNumber: '02',
    },
    {
      title: t('Confidentiality & Etiquette'),
      desc: t('Profiles viewed are sacred trusts. Sharing, taking screenshots, or distributing other members personal information outside the platform is legally and ethically forbidden.'),
      number: '۰۳',
      enNumber: '03',
    },
    {
      title: t('Family Engagement'),
      desc: t('We encourage early family involvement and introduction processes supervised by experienced mediators to ensure dignity and lasting harmony.'),
      number: '۰۴',
      enNumber: '04',
    },
  ];

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="terms" className="py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-3 border border-amber-500/20">
            <span>⚖️</span>
            <span>{t('Terms & Rules')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {t('Platform Regulations & Code of Conduct')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            {t('All members must adhere to our ethical standards designed to maintain sincerity and security.')}
          </p>
        </div>

        {/* Clean Accordion List */}
        <div className="space-y-4">
          {rules.map((rule, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[var(--color-primary)]/50 bg-white dark:bg-gray-800 shadow-md ring-1 ring-[var(--color-primary)]/20'
                    : 'border-slate-200 dark:border-gray-800 bg-white/70 dark:bg-gray-800/50 hover:border-slate-300 dark:hover:border-gray-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-start cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-gray-700 flex items-center justify-center font-black text-sm text-[var(--color-primary)] shrink-0">
                      {isRTL ? rule.number : rule.enNumber}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {rule.title}
                    </h3>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-gray-700/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-gray-700/50">
                    <p>{rule.desc}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
