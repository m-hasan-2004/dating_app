'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '@/context/LanguageContext';
import {
  PERSIAN_MONTH_NAMES,
  PERSIAN_WEEKDAY_SHORT,
  toPersianDigits,
  getJalaliMonthDays,
  gregorianToJalali,
  jalaliToGregorian,
  getJalaliFirstDayOfWeek,
  formatJalaliDateString,
} from '@/utils/jalali';

interface ModernDatePickerProps {
  value: string; // ISO date string 'YYYY-MM-DD' or empty
  onChange: (dateStr: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  name?: string;
  id?: string;
  disabled?: boolean;
}

export default function ModernDatePicker({
  value,
  onChange,
  placeholder,
  error,
  required,
  name,
  id,
  disabled,
}: ModernDatePickerProps) {
  const { t, isRTL } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parse initial date
  const parsedDate = value ? new Date(value) : null;
  const isValidDate = parsedDate && !isNaN(parsedDate.getTime());

  // Jalali state
  const todayJalali = gregorianToJalali(new Date());
  const initialJalali = isValidDate ? gregorianToJalali(parsedDate) : todayJalali;

  const [currentYear, setCurrentYear] = useState<number>(initialJalali.year);
  const [currentMonth, setCurrentMonth] = useState<number>(initialJalali.month);

  useEffect(() => {
    if (isValidDate) {
      const j = gregorianToJalali(parsedDate);
      setCurrentYear(j.year);
      setCurrentMonth(j.month);
    }
  }, [value]);

  // Handle Escape key - close datepicker and stop propagation so parent modal stays open
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen]);

  // Manage body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      const activeModals = document.querySelectorAll('.app-modal-root');
      if (activeModals.length <= 1) {
        document.body.style.overflow = 'unset';
      }
    }
    return () => {
      const activeModals = document.querySelectorAll('.app-modal-root');
      if (activeModals.length <= 1) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen]);

  // Format display text for input
  let displayValue = '';
  if (value && isValidDate) {
    if (isRTL) {
      const j = gregorianToJalali(parsedDate);
      displayValue = `${toPersianDigits(j.year)}/${toPersianDigits(String(j.month).padStart(2, '0'))}/${toPersianDigits(String(j.day).padStart(2, '0'))}`;
    } else {
      displayValue = value;
    }
  }

  // Handle Day Selection in Jalali mode
  const handleSelectJalaliDay = (day: number) => {
    const gDate = jalaliToGregorian(currentYear, currentMonth, day);
    const yyyy = gDate.getFullYear();
    const mm = String(gDate.getMonth() + 1).padStart(2, '0');
    const dd = String(gDate.getDate()).padStart(2, '0');
    const isoString = `${yyyy}-${mm}-${dd}`;
    onChange(isoString);
    setIsOpen(false);
  };

  // Handle direct manual input
  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();
    if (!raw) {
      onChange('');
      return;
    }

    if (isRTL) {
      // Expect YYYY/MM/DD or YYYY-MM-DD in Persian/English digits
      const normalized = raw
        .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
        .replace(/[/.-]/g, '/');
      const parts = normalized.split('/');
      if (parts.length === 3) {
        const jy = parseInt(parts[0], 10);
        const jm = parseInt(parts[1], 10);
        const jd = parseInt(parts[2], 10);
        if (jy >= 1300 && jy <= 1450 && jm >= 1 && jm <= 12 && jd >= 1 && jd <= 31) {
          const gDate = jalaliToGregorian(jy, jm, jd);
          const yyyy = gDate.getFullYear();
          const mm = String(gDate.getMonth() + 1).padStart(2, '0');
          const dd = String(gDate.getDate()).padStart(2, '0');
          onChange(`${yyyy}-${mm}-${dd}`);
          return;
        }
      }
    } else {
      onChange(raw);
    }
  };

  // Generate days for current Jalali month
  const daysInMonth = getJalaliMonthDays(currentYear, currentMonth);
  const firstDayOfWeek = getJalaliFirstDayOfWeek(currentYear, currentMonth); // 0 = Sat ... 6 = Fri

  // Generate Year Range (1320 to 1410)
  const jalaliYears = Array.from({ length: 91 }, (_, i) => 1410 - i);

  const selectedJalali = isValidDate ? gregorianToJalali(parsedDate) : null;

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative flex items-center">
        <input
          type="text"
          id={id}
          name={name}
          disabled={disabled}
          required={required}
          value={displayValue}
          onChange={handleManualChange}
          placeholder={placeholder || (isRTL ? 'مثال: ۱۳۷۴/۰۶/۱۵' : 'YYYY-MM-DD')}
          className={`w-full py-2.5 px-3 text-sm rounded-xl border transition-all ${
            isRTL ? 'pl-10 text-right' : 'pr-10 text-left'
          } ${
            error
              ? 'border-red-500 ring-1 ring-red-500 bg-red-50/10 text-red-900 dark:text-red-200 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500'
          }`}
          dir="ltr"
        />

        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`absolute ${
            isRTL ? 'left-2.5' : 'right-2.5'
          } p-1 text-gray-400 hover:text-brand-500 transition-colors cursor-pointer`}
          title={isRTL ? 'انتخاب تاریخ از تقویم' : 'Pick date from calendar'}
        >
          <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>
      </div>

      {/* Date Picker Modal Dialog - Centered on screen & in middle of parent modal */}
      {isOpen &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[100000] overflow-y-auto app-modal-root"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Backdrop with blur */}
            <div
              className="fixed inset-0 h-full w-full bg-black/60 dark:bg-black/80 backdrop-blur-md modal-backdrop transition-opacity duration-200"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Centering wrapper */}
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <div
                className="relative w-full max-w-sm sm:max-w-md rounded-3xl bg-white dark:bg-gray-900 shadow-2xl border-2 border-gray-300 dark:border-gray-600 ring-2 ring-black/10 dark:ring-white/15 p-5 sm:p-6 text-start mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                      <svg
                        className="w-5 h-5 fill-none stroke-current stroke-2"
                        viewBox="0 0 24 24"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        {isRTL ? 'انتخاب تاریخ' : 'Select Date'}
                      </h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {isRTL ? 'تقویم خورشیدی / شمسی' : 'Gregorian Calendar'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer"
                    title={isRTL ? 'بستن' : 'Close'}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {isRTL ? (
                  /* Persian / Jalali Calendar */
                  <div className="space-y-4">
                    {/* Month & Year Selectors with navigation buttons */}
                    <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={() => {
                          if (currentMonth === 1) {
                            setCurrentMonth(12);
                            setCurrentYear(currentYear - 1);
                          } else {
                            setCurrentMonth(currentMonth - 1);
                          }
                        }}
                        className="p-1.5 px-2.5 rounded-xl hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-xs transition cursor-pointer font-bold"
                        title="ماه قبل"
                      >
                        ‹
                      </button>

                      <div className="flex items-center gap-2">
                        <select
                          value={currentMonth}
                          onChange={(e) => setCurrentMonth(Number(e.target.value))}
                          className="px-2.5 py-1.5 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
                        >
                          {PERSIAN_MONTH_NAMES.map((m, idx) => (
                            <option key={idx + 1} value={idx + 1}>
                              {m}
                            </option>
                          ))}
                        </select>

                        <select
                          value={currentYear}
                          onChange={(e) => setCurrentYear(Number(e.target.value))}
                          className="px-2.5 py-1.5 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
                        >
                          {jalaliYears.map((yr) => (
                            <option key={yr} value={yr}>
                              {toPersianDigits(yr)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (currentMonth === 12) {
                            setCurrentMonth(1);
                            setCurrentYear(currentYear + 1);
                          } else {
                            setCurrentMonth(currentMonth + 1);
                          }
                        }}
                        className="p-1.5 px-2.5 rounded-xl hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 shadow-xs transition cursor-pointer font-bold"
                        title="ماه بعد"
                      >
                        ›
                      </button>
                    </div>

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {PERSIAN_WEEKDAY_SHORT.map((wd, i) => (
                        <span
                          key={i}
                          className="text-xs font-bold text-gray-400 dark:text-gray-500 py-1"
                        >
                          {wd}
                        </span>
                      ))}
                    </div>

                    {/* Day Grid */}
                    <div className="grid grid-cols-7 gap-1.5 text-center">
                      {/* Empty days before 1st of month */}
                      {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-9" />
                      ))}

                      {/* Days of month */}
                      {Array.from({ length: daysInMonth }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const isSelected =
                          selectedJalali &&
                          selectedJalali.year === currentYear &&
                          selectedJalali.month === currentMonth &&
                          selectedJalali.day === dayNum;

                        const isToday =
                          todayJalali.year === currentYear &&
                          todayJalali.month === currentMonth &&
                          todayJalali.day === dayNum;

                        return (
                          <button
                            key={dayNum}
                            type="button"
                            onClick={() => handleSelectJalaliDay(dayNum)}
                            className={`h-9 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
                              isSelected
                                ? 'bg-brand-500 text-white font-bold shadow-md shadow-brand-500/30 ring-2 ring-brand-500'
                                : isToday
                                ? 'border-2 border-brand-500 text-brand-600 dark:text-brand-400 font-bold hover:bg-brand-50 dark:hover:bg-brand-950/40'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            {toPersianDigits(dayNum)}
                          </button>
                        );
                      })}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentYear(todayJalali.year);
                          setCurrentMonth(todayJalali.month);
                          handleSelectJalaliDay(todayJalali.day);
                        }}
                        className="font-bold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>امروز:</span>
                        <span dir="ltr">
                          {toPersianDigits(todayJalali.year)}/{toPersianDigits(todayJalali.month)}/{toPersianDigits(todayJalali.day)}
                        </span>
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onChange('');
                            setIsOpen(false);
                          }}
                          className="px-2.5 py-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition cursor-pointer"
                        >
                          پاک کردن
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsOpen(false)}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer font-medium"
                        >
                          انصراف
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Gregorian Standard Calendar */
                  <div className="space-y-4">
                    <input
                      type="date"
                      value={value}
                      onChange={(e) => {
                        onChange(e.target.value);
                        setIsOpen(false);
                      }}
                      className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-gray-800 dark:text-white"
                    />
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={() => {
                          onChange('');
                          setIsOpen(false);
                        }}
                        className="text-xs text-red-500 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer font-medium"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
