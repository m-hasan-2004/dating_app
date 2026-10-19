'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { CENTER_INFO } from '@/config/centerInfo';

export default function ContactSection() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact || !formData.message) return;
    setSubmitted(true);
    setFormData({ name: '', contact: '', subject: '', message: '' });
  };

  return (
    <section id="contact" className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/20">
            <span>📍</span>
            <span>{t('Contact Us')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {t('Contact Our Team')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            {t('We are here to answer your questions, listen to suggestions, and assist your matchmaking journey.')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Contact Info & Location Card (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Contact Details Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Address Card */}
              <div className="sm:col-span-2 p-5 rounded-2xl bg-white dark:bg-gray-800 border border-slate-200/80 dark:border-gray-700/80 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {t('Office Address')}
                  </h4>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white leading-relaxed">
                    {t('مرکز همسان‌گزینی امین وصال قم')} — {CENTER_INFO.address}
                  </p>
                  <a
                    href={CENTER_INFO.neshanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:underline"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span>{t('مشاهده موقعیت در نقشه نشان')}</span>
                  </a>
                </div>
              </div>

              {/* Phone Card (Landline + Mobile) */}
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-slate-200/80 dark:border-gray-700/80 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {t('Phone & Support Hotline')}
                  </h4>
                  <p className="text-sm font-bold text-slate-800 dark:text-white dir-ltr text-start">
                    {CENTER_INFO.landline}
                  </p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white dir-ltr text-start mt-1">
                    {CENTER_INFO.mobile}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {t('تلفن ثابت و شماره همراه مرکز')}
                  </p>
                </div>
              </div>

              {/* Messaging Card (Eitaa only) */}
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-slate-200/80 dark:border-gray-700/80 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/50 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {t('ارتباط در پیام‌رسان‌ها')}
                  </h4>
                  <a href={`https://eitaa.com/${CENTER_INFO.eitaa.handle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="block text-sm font-bold text-slate-800 dark:text-white hover:text-[var(--color-primary)] transition-colors dir-ltr text-start">
                    ایتا: {CENTER_INFO.eitaa.handle} • {CENTER_INFO.eitaa.contact}
                  </a>
                  <a href={`https://rubika.ir/${CENTER_INFO.rubika.handle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="block text-sm font-bold text-slate-800 dark:text-white hover:text-[var(--color-primary)] transition-colors dir-ltr text-start mt-1">
                    روبیکا: {CENTER_INFO.rubika.handle} • {CENTER_INFO.rubika.contact}
                  </a>
                </div>
              </div>

            </div>

            {/* Messaging Notice */}
            <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 p-4 flex items-start gap-3">
              <span className="text-lg shrink-0">⚠️</span>
              <div>
                <h4 className="text-xs font-extrabold text-amber-800 dark:text-amber-300 mb-0.5">
                  {t('راهنمای ارتباط')}
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-200/90 leading-relaxed">
                  {CENTER_INFO.messagingNote}
                </p>
              </div>
            </div>

            {/* Location Card (Neshan) */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-800 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                    {t('Interactive Location')} • {t('قم، میدان توحید')}
                  </span>
                </div>
                <a
                  href={CENTER_INFO.neshanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1 shrink-0"
                >
                  <span>{t('Open in Neshan')}</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              <a
                href={CENTER_INFO.neshanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative w-full h-[200px] bg-gradient-to-br from-brand-50 via-slate-50 to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-brand-950/40 group"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-white mb-1">
                    {CENTER_INFO.address}
                  </p>
                  <p className="text-xs font-bold text-[var(--color-primary)] group-hover:underline">
                    {t('مشاهده در نقشه نشان')} ↗
                  </p>
                </div>
              </a>
            </div>

          </div>

          {/* Right Column: Inquiry / Contact Form (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800 border border-slate-200/80 dark:border-gray-700/80 shadow-md">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
              {t('Send an Inquiry')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
              {t('We are here to answer your questions, listen to suggestions, and assist your matchmaking journey.')}
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center text-xl">
                  ✓
                </div>
                <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                  {t('Message Sent Successfully!')}
                </h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  {t('Thank you for reaching out. Our support team will contact you soon.')}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-3 text-xs font-bold text-emerald-700 dark:text-emerald-300 underline"
                >
                  {t('Send an Inquiry')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('Your Name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-900/50 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('Phone or Email')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-900/50 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all dir-ltr text-start"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('Subject')}
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-900/50 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('Your Message')} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-900/50 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl hover:brightness-105 active:scale-95 transition-all shadow-md shadow-brand-500/20 cursor-pointer"
                >
                  {t('Send Message')}
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
