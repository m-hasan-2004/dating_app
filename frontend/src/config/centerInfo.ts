/**
 * Real contact information of "مرکز همسان‌گزینی امین وصال قم".
 * Single source of truth used across the landing pages
 * (hero, about, contact, terms and footer).
 */
export const CENTER_INFO = {
  /** نام کامل مرکز */
  fullName: 'مرکز همسان‌گزینی امین وصال قم',
  shortName: 'امین وصال',

  /** مدیر مرکز مشاوره */
  director: {
    name: 'مهدی نجفی',
    initials: 'م‌ن',
    title: 'مدیر مرکز مشاوره',
  },

  /** نشانی مرکز */
  address: 'قم، میدان توحید، توحید ۱۲، پلاک ۱۲/۱',

  /** شماره‌های تماس */
  mobile: '09918867633',
  mobileDisplay: '۰۹۹۱ ۸۸۶ ۷۶۳۳',
  landline: '02538823959',
  landlineDisplay: '۰۲۵-۳۸۸۲۳۹۵۹',

  /** نشانی روی نقشه نشان */
  neshanUrl: 'https://nshn.ir/rbs-6pWxQQHx',
  neshanLabel: 'توحید ۱۲',

  /** ایتا — کانال و ارتباط (ارسال پیام فقط از طریق ایتا) */
  eitaa: {
    channel: 'https://eitaa.com/aminevesal313',
    handle: '@aminevesal',
    contact: '09918867633',
  },

  /** روبیکا — کانال و ارتباط */
  rubika: {
    channel: 'https://rubika.ir/aminevesal313',
    handle: '@aminevesal1',
    contact: '09395531546',
  },

  /** تذکر دوراهی ارتباط */
  messagingNote: 'ارتباط و ارسال پیام فقط از طریق ایتا انجام می‌شود؛ ارتباط از طریق روبیکا صرفاً با شماره مربوطه است.',
} as const;
