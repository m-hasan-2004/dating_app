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
  '/bar-chart': { fa: 'نمودار میله‌ای', en: 'Bar Chart' },
  '/line-chart': { fa: 'نمودار خطی', en: 'Line Chart' },
  '/form-elements': { fa: 'فرم‌ها', en: 'Form Elements' },
  '/basic-tables': { fa: 'جداول', en: 'Basic Tables' },
  '/alerts': { fa: 'هشدارها', en: 'Alerts' },
  '/avatars': { fa: 'آواتارها', en: 'Avatars' },
  '/badge': { fa: 'نشان‌ها', en: 'Badges' },
  '/buttons': { fa: 'دکمه‌ها', en: 'Buttons' },
  '/images': { fa: 'تصاویر', en: 'Images' },
  '/modals': { fa: 'مودال‌ها', en: 'Modals' },
  '/videos': { fa: 'ویدیوها', en: 'Videos' },
};

function getPageLabel(pathname: string, language: string): string {
  const cleanPath = pathname?.replace(/\/$/, '') || '/';

  if (ROUTE_TITLES[cleanPath]) {
    return language === 'fa' ? ROUTE_TITLES[cleanPath].fa : ROUTE_TITLES[cleanPath].en;
  }
  if (cleanPath.startsWith('/candidates/')) {
    return language === 'fa' ? 'مشاهده کاندیدا' : 'Candidate Details';
  }
  if (cleanPath.startsWith('/users/') && cleanPath.endsWith('/profile')) {
    return language === 'fa' ? 'پروفایل متقاضی' : 'User Profile';
  }
  if (cleanPath.startsWith('/users/')) {
    return language === 'fa' ? 'جزییات کاربر' : 'User Details';
  }
  // Generic fallback from last path segment
  const segment = cleanPath.split('/').filter(Boolean).pop() || '';
  if (segment) {
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
  }
  return '';
}

export default function DynamicPageTitle() {
  const pathname = usePathname();
  const { siteName, faviconUrl, logoUrl } = useBranding();
  const { language } = useLanguage();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const cleanPath = pathname?.replace(/\/$/, '') || '/';
    const currentSiteName = siteName || (language === 'fa' ? 'امین وصال' : 'Amine vesal');
    const pageLabel = getPageLabel(cleanPath, language);
    const newTitle =
      cleanPath === '/' || !pageLabel
        ? currentSiteName
        : `${currentSiteName} - ${pageLabel}`;

    // Set document.title safely without DOM-level mutation fighting
    document.title = newTitle;

    // Safely update favicon without removing React-managed DOM elements
    // (Never call .remove() on <link> elements to avoid React removeChild TypeError)
    const activeIcon = faviconUrl || logoUrl || '/media/site_branding/favicons/favicon.png';
    const backendBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const baseUrl =
      activeIcon.startsWith('/') && !activeIcon.startsWith('/favicon.ico')
        ? `${backendBase}${activeIcon}`
        : activeIcon;

    const resolvedHref = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;

    let dynamicFavicon = document.getElementById('app-dynamic-favicon') as HTMLLinkElement | null;
    if (!dynamicFavicon) {
      dynamicFavicon = document.createElement('link');
      dynamicFavicon.id = 'app-dynamic-favicon';
      dynamicFavicon.rel = 'icon';
      document.head.appendChild(dynamicFavicon);
    }
    dynamicFavicon.href = resolvedHref;
  }, [pathname, siteName, faviconUrl, logoUrl, language]);

  return null;
}
