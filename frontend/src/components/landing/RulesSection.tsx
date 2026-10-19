'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { CENTER_INFO } from '@/config/centerInfo';

export default function RulesSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const commitments: { number: string; title: string; desc: string }[] = [
    {
      number: '۱',
      title: 'خدمت ما فقط برای بی‌همسران ایرانی و در زمینه ازدواج دائم، تک‌همسری است.',
      desc: 'ثبت‌نام مرکز «امین وصال» مخصوص اشخاص مجرد (فاقد همسر و عِدّه) ایرانی است و تنها به قصد ازدواج دائم تک‌همسری سرویس ارائه می‌شود.',
    },
    {
      number: '۲',
      title: 'ارائه اطلاعات صحیح و مدارک درخواستی الزامی است.',
      desc: 'ارائه اطلاعات صحیح و مدارک درخواستی برای صحت‌سنجی متقاضی الزامی است و ارائه هرگونه اطلاعات اشتباه موجب عدم پیگیری درخواست شما و عواقب و مسئولیت قانونی و شرعی با شماست.',
    },
    {
      number: '۳',
      title: 'مرکز خود را ملزم به تعجیل و فوریت نمی‌داند.',
      desc: '«امین وصال» خود را ملزم به تعجیل و فوریت شما نسبت به حصول نتیجه نمی‌داند و به جهت شرایط متقاضیان، امکان و احتمال عدم معرفی و عدم ازدواج شما نیز وجود دارد.',
    },
    {
      number: '۴',
      title: 'ممنوعیت ارتباط مستقیم بدون هماهنگی مرکز',
      desc: 'متقاضی بدون هماهنگی حق ندارد خارج از مرکز و مقررات مرکز با فرد متقاضی ازدواج، قرار ملاقات گذاشته و اطلاعات (اعم از شماره تماس و نشانی و...) تبادل کند.',
    },
    {
      number: '۵',
      title: 'اعتبار ۳ ماهه قرارداد و پیگیری ثبت‌نام',
      desc: 'این قرارداد ۳ ماه معتبر است و بعد از ۳ ماه با شرایط جدید تفاهم می‌شود. در صورتی که ۳ ماه از تاریخ ثبت‌نام پیگیر ثبت‌نام و معرفی همسر نشوید و نیز در صورت عدم رعایت مقررات مرکز، نام شما از اسامی متقاضیان معرفی همسر حذف شده و هیچ مسئولیتی متوجه مدیر مرکز همسان‌گزینی «امین وصال» نخواهد بود.',
    },
    {
      number: '۶',
      title: 'پیگیری ۱۵ روز پس از ثبت‌نام، فقط از طریق ایتا',
      desc: 'متقاضی گرامی، ۱۵ روز پس از ثبت‌نام جهت پیگیری فقط از طریق ایتا پیام دهد.',
    },
    {
      number: '۷',
      title: 'اطلاع به مرکز پس از عقد',
      desc: 'در صورتی که ان‌شاءالله تعالی عقد کردید، مرکز «امین وصال» را در جریان قرار دهید تا نامتان از لیست معرفی‌ها حذف شود.',
    },
  ];

  const fees: { label: string; value: string }[] = [
    { label: t('هزینه ثبت‌نام و تشکیل پرونده'), value: '۳۰۰ هزار تومان' },
    { label: t('هزینه هر جلسه قرار ملاقات'), value: '۱۵۰ هزار تومان' },
    { label: t('هزینه معرفی هر مورد'), value: '۱۰۰ هزار تومان' },
  ];

  const channels = [
    {
      label: 'کانال ایتا',
      url: CENTER_INFO.eitaa.channel,
      handle: CENTER_INFO.eitaa.handle,
      contact: CENTER_INFO.eitaa.contact,
      color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#F47B20" />
          <path d="M23.2 16.2C23.1 19.8 20.2 22.8 16.5 22.8C12.4 22.8 9.3 19.5 9.3 15.6C9.3 11.6 12.5 8.4 16.6 8.4C20.6 8.4 23.3 11.2 23.3 15.3V16.3C23.3 17.5 22.4 18.4 21.2 18.4C20.1 18.4 19.3 17.6 19.2 16.5C18.4 17.7 17.2 18.4 15.7 18.4C13.4 18.4 11.7 16.6 11.7 14.3C11.7 12 13.5 10.3 15.8 10.3C17.3 10.3 18.5 11.1 19.1 12.3V8.8H20.9V15.4C20.9 16.2 21.4 16.7 22.1 16.7C22.8 16.7 23.3 16.2 23.3 15.4V15.2C23.3 10.2 19.8 6.7 15.5 6.7C10.7 6.7 6.8 10.6 6.8 15.5C6.8 20.4 10.7 24.3 15.6 24.3C19.7 24.3 23.1 21.4 23.7 17.5L23.2 16.2ZM15.8 16.7C17.2 16.7 18.3 15.6 18.3 14.3C18.3 13 17.2 11.9 15.8 11.9C14.4 11.9 13.3 13 13.3 14.3C13.3 15.6 14.4 16.7 15.8 16.7Z" fill="white" />
        </svg>
      ),
    },
    {
      label: 'کانال روبیکا',
      url: CENTER_INFO.rubika.channel,
      handle: CENTER_INFO.rubika.handle,
      contact: CENTER_INFO.rubika.contact,
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="url(#rubika-rules-gradient)" />
          <path d="M16 6.5C10.75 6.5 6.5 10.75 6.5 16C6.5 21.25 10.75 25.5 16 25.5C21.25 25.5 25.5 21.25 25.5 16C25.5 10.75 21.25 6.5 16 6.5ZM16 22.6C12.35 22.6 9.4 19.65 9.4 16C9.4 12.35 12.35 9.4 16 9.4C19.65 9.4 22.6 12.35 22.6 16C22.6 19.65 19.65 22.6 16 22.6Z" fill="white" />
          <circle cx="16" cy="16" r="3.8" fill="white" />
          <defs>
            <linearGradient id="rubika-rules-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8A2387" />
              <stop offset="0.5" stopColor="#E94057" />
              <stop offset="1" stopColor="#F27121" />
            </linearGradient>
          </defs>
        </svg>
      ),
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
            {t('قوانین و مقررات')} {CENTER_INFO.shortName}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            {t('All members must adhere to our ethical standards designed to maintain sincerity and security.')}
          </p>
        </div>

        {/* Declaration (اعلان متقاضی) */}
        <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800 border border-slate-200/80 dark:border-gray-700/80 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('اعلان و تعهد صداقت متقاضی')}
            </h3>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-loose text-justify">
            {t('اینجانب ....................... فرزند ....................... کتباً اعلام می‌دارم، همسری ندارم / در عِدّه کسی نیستم و تمامی سوالات فرم ثبت‌نام مرکز همسرگزینی «امین وصال» را با صداقت کامل اظهار، تکمیل و پاسخ داده‌ام و مسئولیت هرگونه بیان غیر واقعی یا عدم بیان تمام حقیقت را برعهده می‌گیرم.')}
          </p>
        </div>

        {/* Commitments (تعهدات و تذکرات) */}
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
          <span className="w-1.5 h-6 rounded-full bg-[var(--color-primary)] inline-block" />
          {t('تعهدات و تذکرات')}
        </h3>

        <div className="space-y-4 mb-12">
          {commitments.map((rule, idx) => {
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
                      {rule.number}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {rule.title}
                    </h3>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-gray-700/60 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-gray-700/50">
                    <p className="text-justify">{rule.desc}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Intro Process (فرایند معرفی همسر) */}
        <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white to-brand-50/40 dark:from-gray-800 dark:to-brand-950/20 border border-slate-200/80 dark:border-gray-700/80 shadow-md">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('فرایند معرفی همسر')}
            </h3>
          </div>
          <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-loose text-justify">
            <p>
              {t('بعد از بررسی کارشناس، ابتدا فرم‌ها و عکس آقایان به خانم‌های منتخب ارسال می‌شود و بعد از اینکه خانم‌ها موارد را انتخاب کردند، فقط فرم خانم بدون عکس خانم به آقایان منتخب ارسال می‌شود و اگر آقایان تمایل داشتند، حضوری عکس خانم را در مرکز می‌بینند و بعد از پسندیدن طرفین، ملاقات برگزار می‌شود.')}
            </p>
            <p>
              {t('در جلسه نهایی، مدیر مؤسسه با حضور خانواده طرفین، شماره تماس خانواده خانم را به خانواده خواستگار می‌دهد تا خانواده خواستگار به صورت رسمی و سنتی پیگیری و خواستگاری نمایند.')}
            </p>
            <p className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 p-4 text-xs sm:text-sm text-amber-800 dark:text-amber-200">
              {t('لازم به ذکر است خواستگار (آقا) اجازه قانونی و شرعی می‌دهد که مرکز «امین وصال» عکس و فرم ثبت‌نام را از طریق فضای مجازی به خانم‌های منتخب ارسال کند و خانم نیز تعهد قانونی و شرعی می‌دهد که عکس و فرم خواستگارها را بعد از ملاحظه حذف نموده و به هیچ عنوان برای فامیل و غیرفامیل نفرستد.')}
            </p>
          </div>
        </div>

        {/* Fees (هزینه‌ها) */}
        <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-white dark:bg-gray-800 border border-slate-200/80 dark:border-gray-700/80 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m-2-6h4m-4 4h4m8 2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2h13a2 2 0 002-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('هزینه‌های ثبت‌نام و خدمات')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {fees.map((fee, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-gray-900/60 border border-slate-200/70 dark:border-gray-700/60 text-center">
                <p className="text-lg font-black text-[var(--color-primary)] mb-1">{fee.value}</p>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{fee.label}</p>
              </div>
            ))}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
            {t('معرفی یعنی: به صرف ارسال فرم، معرفی صورت گرفته و هزینه باید پرداخت شود و پسندیدن و نپسندیدن و ملاقات یا عدم ملاقات، ملاک و معیار واریز هزینه نیست. ضمناً هزینه‌ها غیرقابل برگشت است.')}
          </p>
        </div>

        {/* Final Declaration & Channels */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 dark:bg-gray-900 border border-slate-800 shadow-md text-slate-300">
          <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📜</span>
            {t('پایان قرارداد و اظهار پذیرش')}
          </h3>
          <p className="text-xs sm:text-sm leading-loose text-justify mb-6">
            {t('اینجانب ....................... فرزند ....................... دارای کد ثبت‌نام اینترنتی، مطالب و مفاد بالا را مطالعه کرده و با قبول و آگاهی و تعهد به مفاد فوق، در همسرگزینی ثبت‌نام می‌کنم و اعتراضی نسبت به مفاد آیین‌نامه فوق ندارم.')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {channels.map((ch, idx) => (
              <a
                key={idx}
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-3.5 rounded-xl border ${ch.color} bg-white dark:bg-gray-800 transition-all hover:scale-[1.01]`}
              >
                <span className="shrink-0">{ch.icon}</span>
                <span className="min-w-0">
                  <span className="block text-xs font-extrabold text-slate-800 dark:text-white truncate">
                    {ch.label} — {t(CENTER_INFO.shortName)}
                  </span>
                  <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 dir-ltr text-start truncate">
                    {ch.handle} • {ch.contact}
                  </span>
                </span>
              </a>
            ))}
          </div>

          <p className="mt-5 text-[11px] sm:text-xs text-slate-400 flex items-start gap-2">
            <span className="shrink-0">ℹ️</span>
            <span>{CENTER_INFO.messagingNote}</span>
          </p>
        </div>

      </div>
    </section>
  );
}
