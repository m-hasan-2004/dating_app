'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import { useBranding } from '@/context/BrandingContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/use-auth';

export default function LandingHeader() {
  const { t, isRTL, language, toggleLanguage } = useTranslation();
  const { siteName, logoUrl, enableLanguageSwitcher } = useBranding();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: '/', label: t('Home') },
    { href: '/terms', label: t('Terms & Rules') },
    { href: '/about', label: t('About Us') },
    { href: '/contact', label: t('Contact Us') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/85 dark:bg-gray-900/85 border-b border-slate-200/80 dark:border-gray-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={siteName}
                className="h-11 w-auto max-w-[170px] object-contain rounded-xl shadow-xs group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-black text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight group-hover:text-[var(--color-primary)] transition-colors">
                {siteName}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-gray-800/60 rounded-xl transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions: Theme, Lang, Auth */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/80 text-slate-600 dark:text-slate-300 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/40 transition-all cursor-pointer shadow-xs"
              title={theme === 'dark' ? 'حالت روشن (Light)' : 'حالت تاریک (Dark)'}
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Language Switcher */}
            {mounted && enableLanguageSwitcher && (
              <button
                type="button"
                onClick={toggleLanguage}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/80 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/40 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                title={isRTL ? t('Switch to English') : t('Switch to Persian')}
              >
                <span className="text-[11px] font-extrabold uppercase">
                  {language === 'fa' ? 'FA (فا)' : 'EN'}
                </span>
              </button>
            )}

            {/* Auth Buttons */}
            {mounted && isAuthenticated ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl hover:brightness-105 active:scale-95 transition-all shadow-md shadow-brand-500/20"
              >
                {t('Go to Dashboard')}
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/signin"
                  className="px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800/80 transition-all"
                >
                  {t('Sign In')}
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl hover:brightness-105 active:scale-95 transition-all shadow-md shadow-brand-500/20"
                >
                  {t('Sign Up')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Theme Toggle Mobile */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-slate-300"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 px-2 space-y-2 border-t border-slate-200/80 dark:border-gray-800/80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-gray-800"
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-slate-200/60 dark:border-gray-800/60 flex flex-col gap-2">
              {mounted && enableLanguageSwitcher && (
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="w-full text-center py-2 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-lg bg-slate-100 dark:bg-gray-800"
                >
                  {language === 'fa' ? 'Switch to English (EN)' : 'تغییر به زبان فارسی (فا)'}
                </button>
              )}

              {mounted && isAuthenticated ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl"
                >
                  {t('Go to Dashboard')}
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-gray-700 rounded-xl"
                  >
                    {t('Sign In')}
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-xs font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl"
                  >
                    {t('Sign Up')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
