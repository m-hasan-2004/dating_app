'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import { useBranding } from '@/context/BrandingContext';
import { CENTER_INFO } from '@/config/centerInfo';
import { EitaaIcon, RubikaIcon } from './SocialIcons';

export default function LandingFooter() {
  const { t } = useTranslation();
  const { siteName, logoUrl } = useBranding();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">

          {/* Brand & Mission summary (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={siteName}
                  className="h-10 w-auto max-w-[150px] object-contain rounded-lg brightness-110"
                />
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white shadow-sm">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
              )}
              <span className="font-extrabold text-white text-lg tracking-tight">
                {siteName}
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {t(CENTER_INFO.fullName)} — {t('A principled approach to sacred marriage that respects family values, culture, and privacy.')}
            </p>

            {/* Real Contact Info */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 space-y-2">
              <p className="flex items-start gap-2">
                <span className="shrink-0">📍</span>
                <span className="font-bold text-white">{CENTER_INFO.address}</span>
              </p>
              <p className="flex items-center gap-2 dir-ltr justify-end text-end">
                <a href="tel:02538823959" className="font-bold text-white hover:text-[var(--color-primary)] transition-colors dir-ltr">
                  {CENTER_INFO.landline}
                </a>
                <span className="shrink-0">☎️</span>
              </p>
              <p className="flex items-center gap-2 dir-ltr justify-end text-end">
                <a href="tel:09918867633" className="font-bold text-white hover:text-[var(--color-primary)] transition-colors dir-ltr">
                  {CENTER_INFO.mobile}
                </a>
                <span className="shrink-0">📱</span>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <span className="font-bold text-white block mb-0.5">🛡️ {t('Security & Ethical Pledge')}</span>
              <p className="text-[11px] text-slate-400 leading-normal">
                {t('We pledge to protect your personal privacy and honor your trust with the highest standard of Islamic integrity.')}
              </p>
            </div>
          </div>

          {/* Quick Navigation Links (2 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t('Quick Links')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {t('Home')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t('About Us')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {t('Terms & Rules')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t('Contact Us')}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  {t('Dashboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Channels: Domestic Messengers (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t('کانال در ایتا و روبیکا')}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('اطلاعیه‌ها، مقالات آموزشی و مشاوره ازدواج را در کانال رسمی مرکز دنبال نمایید.')}
            </p>

            <div className="grid grid-cols-1 gap-3 pt-1">
              {/* Eitaa Channel */}
              <a
                href={CENTER_INFO.eitaa.channel}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-all hover:scale-[1.02]"
              >
                <EitaaIcon className="w-5 h-5 shrink-0" />
                <span className="truncate">
                  {t('کانال ایتا')} · <span className="dir-ltr">{CENTER_INFO.eitaa.handle}</span>
                </span>
              </a>

              {/* Rubika Channel */}
              <a
                href={CENTER_INFO.rubika.channel}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-all hover:scale-[1.02]"
              >
                <RubikaIcon className="w-5 h-5 shrink-0" />
                <span className="truncate">
                  {t('کانال روبیکا')} · <span className="dir-ltr">{CENTER_INFO.rubika.handle}</span>
                </span>
              </a>

              {/* Contact Handles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`https://eitaa.com/${CENTER_INFO.eitaa.handle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 text-[11px] text-slate-300 transition-colors"
                >
                  <span className="block font-extrabold text-white mb-1">{t('ارتباط در ایتا')}</span>
                  <span className="block dir-ltr text-end">{CENTER_INFO.eitaa.contact}</span>
                  <span className="block dir-ltr text-end truncate">{CENTER_INFO.eitaa.handle}</span>
                </a>
                <a
                  href={`https://rubika.ir/${CENTER_INFO.rubika.handle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 text-[11px] text-slate-300 transition-colors"
                >
                  <span className="block font-extrabold text-white mb-1">{t('ارتباط در روبیکا')}</span>
                  <span className="block dir-ltr text-end">{CENTER_INFO.rubika.contact}</span>
                  <span className="block dir-ltr text-end truncate">{CENTER_INFO.rubika.handle}</span>
                </a>
              </div>
            </div>

            <p className="text-[11px] text-amber-300/90 leading-relaxed flex items-start gap-1.5">
              <span className="shrink-0">⚠️</span>
              <span>{t('ارتباط و ارسال پیام فقط در ایتا')}</span>
            </p>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-start">
            &copy; {new Date().getFullYear()} {siteName}. {t('All rights reserved. Dedicated to virtuous, permanent matrimony.')}
            <span className="block mt-1 text-[11px] text-slate-500">
              {t('طراحی و توسعه سایت')}:{' '}
              <a
                href="https://github.com/m-hasan-2004"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.05 11.05 0 0 1 2.89-.39c.98 0 1.96.13 2.89.39 2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.67.41.35.77 1.04.77 2.1 0 1.52-.01 2.74-.01 3.11 0 .31.2.68.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
                </svg>
                <span dir="ltr">m-hasan-2004</span>
              </a>
            </span>
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              {t('Terms & Rules')}
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">
              {t('Contact Us')}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
