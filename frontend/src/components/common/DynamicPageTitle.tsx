'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useBranding } from '@/context/BrandingContext';
import { useLanguage } from '@/context/LanguageContext';

interface RouteTitle {
  fa: string;
  en: string;
}

const ROUTE_TITLES: Record<string, RouteTitle> = {
  '/': { fa: 'صفحه اصلی', en: 'Home' },
  '/search': { fa: 'جست‌وجوی کاندیدا', en: 'Search Candidates' },
  '/dashboard': { fa: 'داشبورد', en: 'Dashboard' },
  '/users': { fa: 'مدیریت کاربران', en: 'Users Management' },
  '/access-codes': { fa: 'کدهای دسترسی', en: 'Access Codes' },
  '/site-settings': { fa: 'تنظیمات سامانه', en: 'Site Settings' },
  '/database-backup': { fa: 'پشتیبان‌گیری پایگاه داده', en: 'Database Backup' },
  '/statistics': { fa: 'آمار و گزارشات', en: 'Statistics' },
  '/about': { fa: 'درباره ما', en: 'About Us' },
  '/contact': { fa: 'تماس با ما', en: 'Contact Us' },
  '/terms': { fa: 'قوانین و مقررات', en: 'Terms & Conditions' },
  '/signin': { fa: 'ورود به سامانه', en: 'Sign In' },
  '/signup': { fa: 'ثبت‌نام متقاضی', en: 'Sign Up' },
  '/profile': { fa: 'پروفایل کاربری', en: 'User Profile' },
  '/profile/bookmarks': { fa: 'نشان‌شده‌ها', en: 'Bookmarks' },
  '/calendar': { fa: 'تقویم', en: 'Calendar' },
  '/blank': { fa: 'صفحه خالی', en: 'Blank Page' },
  '/error-404': { fa: 'صفحه پیدا نشد', en: 'Page Not Found' },
};

export default function DynamicPageTitle() {
  const pathname = usePathname();
  const { siteName, faviconUrl, logoUrl } = useBranding();
  const { language } = useLanguage();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1. Determine matching title
    let pageLabel = '';
    const cleanPath = pathname?.replace(/\/$/, '') || '/';

    if (ROUTE_TITLES[cleanPath]) {
      pageLabel = language === 'fa' ? ROUTE_TITLES[cleanPath].fa : ROUTE_TITLES[cleanPath].en;
    } else if (cleanPath.startsWith('/candidates/')) {
      pageLabel = language === 'fa' ? 'مشاهده کاندیدا' : 'Candidate Details';
    } else if (cleanPath.startsWith('/users/') && cleanPath.endsWith('/profile')) {
      pageLabel = language === 'fa' ? 'پروفایل متقاضی' : 'User Profile';
    } else if (cleanPath.startsWith('/users/')) {
      pageLabel = language === 'fa' ? 'جزییات کاربر' : 'User Details';
    } else {
      // General path title fallback
      const segment = cleanPath.split('/').filter(Boolean).pop() || '';
      if (segment) {
        pageLabel = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      }
    }

    const currentSiteName = siteName || (language === 'fa' ? 'امین وصال' : 'Amine vesal');
    const newTitle = cleanPath === '/' || !pageLabel ? currentSiteName : `${currentSiteName} - ${pageLabel}`;

    // Immediately and reliably set document.title
    document.title = newTitle;

    // Use requestAnimationFrame / timeout to guard against Next.js router resetting title on client route change
    const frameId = requestAnimationFrame(() => {
      if (document.title !== newTitle) {
        document.title = newTitle;
      }
    });

    // 2. Enforce Favicon without breaking tab state during client navigation
    const activeIcon = faviconUrl || logoUrl || '/favicon.ico';
    const baseUrl =
      activeIcon.startsWith('/') && !activeIcon.startsWith('/favicon.ico') && typeof window !== 'undefined'
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${activeIcon}`
        : activeIcon;

    let iconLink = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
    if (!iconLink) {
      iconLink = document.createElement('link');
      iconLink.rel = 'shortcut icon';
      document.head.appendChild(iconLink);
    }

    if (iconLink.href !== baseUrl) {
      iconLink.href = baseUrl;
    }

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [pathname, siteName, faviconUrl, logoUrl, language]);

  return null;
}
