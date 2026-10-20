"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "@/components/ui/modal";
import { useTranslation } from "@/context/LanguageContext";
import {
  gregorianToJalali,
  jalaliToGregorian,
  getJalaliMonthDays,
  getJalaliFirstDayOfWeek,
  PERSIAN_MONTH_NAMES,
  PERSIAN_WEEKDAY_NAMES,
  PERSIAN_WEEKDAY_SHORT,
  toPersianDigits,
  formatJalaliDateString,
  JalaliDate,
} from "@/utils/jalali";
import {
  PlusIcon,
  ChevronLeftIcon,
  TrashBinIcon,
  CalenderIcon,
} from "@/icons";

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // YYYY-MM-DD (Gregorian)
  end?: string;
  category: "danger" | "success" | "primary" | "warning";
}

const COLOR_CLASSES: Record<string, { bg: string; text: string; dot: string }> = {
  danger: {
    bg: "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    text: "text-red-600 dark:text-red-400",
    dot: "bg-red-500",
  },
  success: {
    bg: "bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    text: "text-green-600 dark:text-green-400",
    dot: "bg-green-500",
  },
  primary: {
    bg: "bg-[var(--color-primary)]/15 dark:bg-[var(--color-primary)]/20 text-[var(--color-primary)] border-[var(--color-primary)]/30 dark:border-[var(--color-primary)]/40",
    text: "text-[var(--color-primary)]",
    dot: "bg-[var(--color-primary)]",
  },
  warning: {
    bg: "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    text: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
};

export const Calendar: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initial Events
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: isRTL ? "جلسه هماهنگی معرفی" : "Event Conf.",
      start: new Date().toISOString().split("T")[0],
      category: "danger",
    },
    {
      id: "2",
      title: isRTL ? "ملاقات حضوری کاندیدا" : "Meeting",
      start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      category: "success",
    },
    {
      id: "3",
      title: isRTL ? "کارگاه مشاوره ازدواج" : "Workshop",
      start: new Date(Date.now() + 172800000).toISOString().split("T")[0],
      end: new Date(Date.now() + 259200000).toISOString().split("T")[0],
      category: "primary",
    },
  ]);

  // Current view date
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Jalali state
  const todayJalali = useMemo(() => gregorianToJalali(new Date()), []);
  const [viewJalali, setViewJalali] = useState<{ year: number; month: number }>({
    year: todayJalali.year,
    month: todayJalali.month,
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalCategory, setModalCategory] = useState<"danger" | "success" | "primary" | "warning">("primary");
  const [modalStartDate, setModalStartDate] = useState("");
  const [modalEndDate, setModalEndDate] = useState("");

  // Sync view dates
  const handlePrevMonth = () => {
    if (isRTL) {
      setViewJalali((prev) => {
        if (prev.month === 1) {
          return { year: prev.year - 1, month: 12 };
        }
        return { year: prev.year, month: prev.month - 1 };
      });
    } else {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }
  };

  const handleNextMonth = () => {
    if (isRTL) {
      setViewJalali((prev) => {
        if (prev.month === 12) {
          return { year: prev.year + 1, month: 1 };
        }
        return { year: prev.year, month: prev.month + 1 };
      });
    } else {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    const j = gregorianToJalali(now);
    setViewJalali({ year: j.year, month: j.month });
  };

  // Open modal to add event on a specific date
  const handleDayClick = (gregorianDateStr: string) => {
    setSelectedEvent(null);
    setModalTitle("");
    setModalCategory("primary");
    setModalStartDate(gregorianDateStr);
    setModalEndDate(gregorianDateStr);
    setIsModalOpen(true);
  };

  const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setModalTitle(event.title);
    setModalCategory(event.category);
    setModalStartDate(event.start);
    setModalEndDate(event.end || event.start);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim()) return;

    if (selectedEvent) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === selectedEvent.id
            ? {
                ...ev,
                title: modalTitle,
                category: modalCategory,
                start: modalStartDate,
                end: modalEndDate,
              }
            : ev
        )
      );
    } else {
      const newEv: CalendarEvent = {
        id: Date.now().toString(),
        title: modalTitle,
        category: modalCategory,
        start: modalStartDate,
        end: modalEndDate,
      };
      setEvents((prev) => [...prev, newEv]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    setEvents((prev) => prev.filter((ev) => ev.id !== selectedEvent.id));
    setIsModalOpen(false);
  };

  // ─────────────────────────────────────────────────────────────
  // Persian / Shamsi Grid calculation
  // ─────────────────────────────────────────────────────────────
  const jalaliDaysGrid = useMemo(() => {
    if (!isRTL) return [];

    const { year, month } = viewJalali;
    const totalDays = getJalaliMonthDays(year, month);
    const firstDayOfWeek = getJalaliFirstDayOfWeek(year, month); // 0 = Sat, 6 = Fri

    // Previous month filler days
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevMonthTotalDays = getJalaliMonthDays(prevYear, prevMonth);

    const days = [];

    // Filler from previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthTotalDays - i;
      const gDate = jalaliToGregorian(prevYear, prevMonth, dayNum);
      const gStr = gDate.toISOString().split("T")[0];
      days.push({
        dayNum,
        isCurrentMonth: false,
        gregorianStr: gStr,
        isToday: false,
      });
    }

    // Days of current month
    for (let d = 1; d <= totalDays; d++) {
      const gDate = jalaliToGregorian(year, month, d);
      const gStr = gDate.toISOString().split("T")[0];
      const isToday =
        todayJalali.year === year &&
        todayJalali.month === month &&
        todayJalali.day === d;
      days.push({
        dayNum: d,
        isCurrentMonth: true,
        gregorianStr: gStr,
        isToday,
      });
    }

    // Filler for next month to complete 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    for (let d = 1; d <= remaining; d++) {
      const gDate = jalaliToGregorian(nextYear, nextMonth, d);
      const gStr = gDate.toISOString().split("T")[0];
      days.push({
        dayNum: d,
        isCurrentMonth: false,
        gregorianStr: gStr,
        isToday: false,
      });
    }

    return days;
  }, [isRTL, viewJalali, todayJalali]);

  // ─────────────────────────────────────────────────────────────
  // Gregorian Grid calculation (for English mode)
  // ─────────────────────────────────────────────────────────────
  const gregorianDaysGrid = useMemo(() => {
    if (isRTL) return [];

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();

    const todayStr = new Date().toISOString().split("T")[0];
    const days = [];

    // Prev month filler
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthTotalDays - i;
      const gDate = new Date(year, month - 1, d);
      days.push({
        dayNum: d,
        isCurrentMonth: false,
        gregorianStr: gDate.toISOString().split("T")[0],
        isToday: false,
      });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const gDate = new Date(year, month, d);
      const gStr = gDate.toISOString().split("T")[0];
      days.push({
        dayNum: d,
        isCurrentMonth: true,
        gregorianStr: gStr,
        isToday: gStr === todayStr,
      });
    }

    // Next month filler
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const gDate = new Date(year, month + 1, d);
      days.push({
        dayNum: d,
        isCurrentMonth: false,
        gregorianStr: gDate.toISOString().split("T")[0],
        isToday: false,
      });
    }

    return days;
  }, [isRTL, currentDate]);

  const activeDaysGrid = isRTL ? jalaliDaysGrid : gregorianDaysGrid;

  const currentMonthTitle = isRTL
    ? `${PERSIAN_MONTH_NAMES[viewJalali.month - 1]} ${toPersianDigits(viewJalali.year)}`
    : currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const weekDayHeaders = isRTL
    ? PERSIAN_WEEKDAY_NAMES
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (!mounted) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-xs p-12 flex items-center justify-center min-h-[500px]">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-xs overflow-hidden">
      {/* Calendar Toolbar Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 border-b border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-white/[0.01]">
        {/* Month Navigation & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-slate-200/80 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xs overflow-hidden">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 transition-colors cursor-pointer"
              title={isRTL ? "ماه قبل" : "Previous Month"}
            >
              <ChevronLeftIcon className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-gray-200 border-x border-slate-200/80 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              {isRTL ? "امروز" : "Today"}
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 transition-colors cursor-pointer"
              title={isRTL ? "ماه بعد" : "Next Month"}
            >
              <ChevronLeftIcon className={`w-4 h-4 ${isRTL ? "" : "rotate-180"}`} />
            </button>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {currentMonthTitle}
          </h2>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleDayClick(new Date().toISOString().split("T")[0])}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[var(--color-primary)] hover:brightness-95 text-white shadow-xs transition-colors cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            {isRTL ? "افزودن رویداد جدید" : "Add Event"}
          </button>
        </div>
      </div>

      {/* Weekday Columns Header */}
      <div className="grid grid-cols-7 border-b border-slate-100 dark:border-gray-800 bg-slate-50/80 dark:bg-gray-800/40 text-center text-xs font-semibold text-slate-600 dark:text-gray-300 py-3">
        {weekDayHeaders.map((day, idx) => (
          <div
            key={day}
            className={idx === (isRTL ? 6 : 0) ? "text-red-500 dark:text-red-400" : ""}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Month Days Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-gray-800 bg-white dark:bg-transparent min-h-[560px]">
        {activeDaysGrid.map((cell, index) => {
          // Find matching events for this cell's date
          const cellEvents = events.filter(
            (ev) =>
              ev.start === cell.gregorianStr ||
              (ev.end && cell.gregorianStr >= ev.start && cell.gregorianStr <= ev.end)
          );

          return (
            <div
              key={`${cell.gregorianStr}-${index}`}
              onClick={() => handleDayClick(cell.gregorianStr)}
              className={`p-2 sm:p-2.5 min-h-[95px] flex flex-col justify-between transition-colors cursor-pointer hover:bg-[var(--color-primary)]/5 dark:hover:bg-white/[0.02] ${
                !cell.isCurrentMonth
                  ? "bg-slate-50/40 dark:bg-gray-900/20 text-slate-400 dark:text-gray-600"
                  : "text-slate-800 dark:text-gray-200"
              } ${cell.isToday ? "bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/20 ring-1 ring-inset ring-[var(--color-primary)]/30" : ""}`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full ${
                    cell.isToday
                      ? "bg-[var(--color-primary)] text-white shadow-xs"
                      : cell.isCurrentMonth
                      ? "text-slate-800 dark:text-gray-200"
                      : "text-slate-400 dark:text-gray-600"
                  }`}
                >
                  {isRTL ? toPersianDigits(cell.dayNum) : cell.dayNum}
                </span>

                {cell.isToday && (
                  <span className="text-[10px] font-medium text-[var(--color-primary)]">
                    {isRTL ? "امروز" : "Today"}
                  </span>
                )}
              </div>

              {/* Event items in cell */}
              <div className="space-y-1 mt-1.5 flex-1">
                {cellEvents.map((ev) => {
                  const style = COLOR_CLASSES[ev.category] || COLOR_CLASSES.primary;
                  return (
                    <div
                      key={ev.id}
                      onClick={(e) => handleEventClick(e, ev)}
                      className={`px-1.5 py-0.5 rounded text-[11px] font-medium border truncate flex items-center gap-1 hover:opacity-85 transition-opacity ${style.bg}`}
                      title={ev.title}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                      <span className="truncate">{ev.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── ADD / EDIT EVENT MODAL ───────────────────────────────────── */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-lg w-full" showCloseButton={false}>
        <div className="p-6 w-full" dir={isRTL ? "rtl" : "ltr"}>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalenderIcon className="w-5 h-5 text-[var(--color-primary)]" />
              {selectedEvent
                ? isRTL
                  ? "ویرایش رویداد"
                  : "Edit Event"
                : isRTL
                ? "ثبت رویداد جدید"
                : "Add New Event"}
            </h3>
            {selectedEvent && (
              <button
                type="button"
                onClick={handleDeleteEvent}
                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                title={isRTL ? "حذف رویداد" : "Delete Event"}
              >
                <TrashBinIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          <form onSubmit={handleSaveEvent} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                {isRTL ? "عنوان رویداد" : "Event Title"}
              </label>
              <input
                type="text"
                required
                value={modalTitle}
                onChange={(e) => setModalTitle(e.target.value)}
                placeholder={isRTL ? "مثلا: جلسه خواستگاری و معرفی" : "e.g. Intro Meeting"}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white text-slate-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                {isRTL ? "نوع و رنگ رویداد" : "Event Category / Color"}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: "primary", label: isRTL ? "اصلی" : "Primary", color: "bg-[var(--color-primary)]" },
                  { key: "success", label: isRTL ? "موفق" : "Success", color: "bg-green-500" },
                  { key: "warning", label: isRTL ? "هشدار" : "Warning", color: "bg-amber-500" },
                  { key: "danger", label: isRTL ? "مهم" : "Danger", color: "bg-red-500" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setModalCategory(item.key as any)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      modalCategory === item.key
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/20 text-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20"
                        : "border-slate-200/80 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-300"
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                  {isRTL ? "تاریخ شروع" : "Start Date"}
                </label>
                <input
                  type="date"
                  required
                  value={modalStartDate}
                  onChange={(e) => setModalStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                  {isRTL ? "تاریخ پایان" : "End Date"}
                </label>
                <input
                  type="date"
                  value={modalEndDate}
                  onChange={(e) => setModalEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors shadow-2xs cursor-pointer"
              >
                {t("Cancel")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-[var(--color-primary)] hover:brightness-95 text-white shadow-xs transition-colors cursor-pointer"
              >
                {selectedEvent
                  ? isRTL
                    ? "ذخیره تغییرات"
                    : "Save Changes"
                  : isRTL
                  ? "افزودن رویداد"
                  : "Add Event"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Calendar;
