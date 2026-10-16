'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';

export default function ContactSection() {
  const { t, isRTL } = useTranslation();
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
          
          {/* Left Column: Contact Info & Interactive Map Card (7 Cols) */}
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
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {t('Office Address')}
                  </h4>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white leading-relaxed">
                    {t('Qom, Shohada Square (Hojjatiyeh), Beside Holy Shrine, Islamic Guidance & Marriage Support Complex, Unit 4')}
                  </p>
                </div>
              </div>

              {/* Phone Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-slate-200/80 dark:border-gray-700/80 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {t('Phone & Support Hotline')}
                  </h4>
                  <p className="text-sm font-bold text-slate-800 dark:text-white dir-ltr text-start">
                    +98 (25) 3774-8921
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {t('Saturday to Wednesday: 8:00 AM – 3:30 PM')}
                  </p>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-slate-200/80 dark:border-gray-700/80 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {t('Email Inquiries')}
                  </h4>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    support@nikookar.org
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    info@nikookar.org
                  </p>
                </div>
              </div>

            </div>

            {/* Interactive Map Embed / Preview Card for Qom */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-800 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {t('Interactive Location')} • {t('Qom, Islamic Republic of Iran')}
                  </span>
                </div>
                <a
                  href="https://maps.google.com/?q=34.6416,50.8746"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
                >
                  <span>{t('Open in Neshan / Google Maps')}</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              <div className="relative w-full h-[220px] bg-slate-100 dark:bg-gray-900">
                <iframe
                  title="Qom Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13146.471676679545!2d50.8716301!3d34.6415714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f93bb53e7779f77%3A0x6e9a656ea9c5d070!2sHoly%20Shrine%20of%20Lady%20Fatimah%20Masuma!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  className="w-full h-full grayscale-[20%] contrast-[1.05]"
                />
              </div>
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
