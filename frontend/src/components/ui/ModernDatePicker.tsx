'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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

      {/* Date Picker Dropdown Popover */}
      {isOpen && (
        <div
          className={`absolute z-50 mt-1 w-72 sm:w-80 p-4 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 animate-slide-up ${
            isRTL ? 'right-0' : 'left-0'
          }`}
        >
          {isRTL ? (
            /* Persian / Jalali Calendar */
            <div className="space-y-3">
              {/* Month & Year Selectors */}
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(Number(e.target.value))}
                  className="px-2 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                  className="px-2 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  {jalaliYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {toPersianDigits(yr)}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1">
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
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 cursor-pointer"
                    title="ماه قبل"
                  >
                    ‹
                  </button>
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
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 cursor-pointer"
                    title="ماه بعد"
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {PERSIAN_WEEKDAY_SHORT.map((wd, i) => (
                  <span key={i} className="text-[11px] font-bold text-gray-400 py-1">
                    {wd}
                  </span>
                ))}
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Empty days before 1st of month */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-8" />
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
                      className={`h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'bg-brand-500 text-white font-bold shadow-sm'
                          : isToday
                          ? 'border border-brand-500 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {toPersianDigits(dayNum)}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    handleSelectJalaliDay(todayJalali.day);
                  }}
                  className="font-bold text-brand-600 hover:underline cursor-pointer"
                >
                  امروز ({toPersianDigits(todayJalali.year)}/{toPersianDigits(todayJalali.month)}/{toPersianDigits(todayJalali.day)})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange('');
                    setIsOpen(false);
                  }}
                  className="text-red-500 hover:underline cursor-pointer"
                >
                  پاک کردن
                </button>
              </div>
            </div>
          ) : (
            /* Gregorian Standard Calendar */
            <div className="space-y-3">
              <input
                type="date"
                value={value}
                onChange={(e) => {
                  onChange(e.target.value);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-800 dark:text-white"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onChange('');
                    setIsOpen(false);
                  }}
                  className="text-xs text-red-500 hover:underline"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
