'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import { useBranding } from '@/context/BrandingContext';
import { EitaaIcon, RubikaIcon, TelegramIcon, InstagramIcon } from './SocialIcons';

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
              {t('A principled approach to sacred marriage that respects family values, culture, and privacy.')}
            </p>

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

          {/* Social Channels: Domestic & Global (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t('Social Networks & Channels')}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('Follow our announcements, educational articles, and marital advice across domestic and global networks.')}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Eitaa */}
              <a
                href="https://eitaa.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-bold text-white transition-all hover:scale-[1.02]"
              >
                <EitaaIcon className="w-5 h-5 shrink-0" />
                <span className="truncate">{t('Eitaa Channel')}</span>
              </a>

              {/* Rubika */}
              <a
                href="https://rubika.ir"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-bold text-white transition-all hover:scale-[1.02]"
              >
                <RubikaIcon className="w-5 h-5 shrink-0" />
                <span className="truncate">{t('Rubika Channel')}</span>
              </a>

              {/* Telegram */}
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-bold text-white transition-all hover:scale-[1.02]"
              >
                <TelegramIcon className="w-5 h-5 shrink-0" />
                <span className="truncate">{t('Telegram Channel')}</span>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-bold text-white transition-all hover:scale-[1.02]"
              >
                <InstagramIcon className="w-5 h-5 shrink-0" />
                <span className="truncate">{t('Instagram Page')}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-start">
            &copy; {new Date().getFullYear()} {siteName}. {t('All rights reserved. Dedicated to virtuous, permanent matrimony.')}
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
