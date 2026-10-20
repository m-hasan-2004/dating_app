"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Modal } from "@/components/ui/modal";
import ModernDatePicker from "@/components/ui/ModernDatePicker";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/use-auth";
import {
  CalendarEventItem,
  fetchCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "@/services/api/calendarService";
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

const COLOR_CLASSES: Record<string, { bg: string; text: string; dot: string; labelFa: string; labelEn: string }> = {
  danger: {
    bg: "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    text: "text-red-600 dark:text-red-400",
    dot: "bg-red-500",
    labelFa: "مهم / خطر",
    labelEn: "Danger",
  },
  success: {
    bg: "bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    text: "text-green-600 dark:text-green-400",
    dot: "bg-green-500",
    labelFa: "موفق",
    labelEn: "Success",
  },
  primary: {
    bg: "bg-[var(--color-primary)]/15 dark:bg-[var(--color-primary)]/20 text-[var(--color-primary)] border-[var(--color-primary)]/30 dark:border-[var(--color-primary)]/40",
    text: "text-[var(--color-primary)]",
    dot: "bg-[var(--color-primary)]",
    labelFa: "اصلی",
    labelEn: "Primary",
  },
  warning: {
    bg: "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    text: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
    labelFa: "هشدار",
    labelEn: "Warning",
  },
};

export const Calendar: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const { user } = useAuth();
  const isAdmin = Boolean(user?.is_staff || (user as any)?.is_superuser);

  const [mounted, setMounted] = useState(false);
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchCalendarEvents();
      setEvents(data);
    } catch (err: any) {
      console.error("Failed to load calendar events", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      loadEvents();
    }
  }, [mounted, loadEvents]);

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
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventItem | null>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [modalCategory, setModalCategory] = useState<"danger" | "success" | "primary" | "warning">("primary");
  const [modalStartDate, setModalStartDate] = useState("");
  const [modalEndDate, setModalEndDate] = useState("");

  const formatDateBadge = (dateStr?: string) => {
    if (!dateStr) return "";
    if (!isRTL) return dateStr;
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        const j = gregorianToJalali(new Date(y, m - 1, d));
        return `${toPersianDigits(j.year)}/${toPersianDigits(String(j.month).padStart(2, "0"))}/${toPersianDigits(String(j.day).padStart(2, "0"))}`;
      }
    }
    return dateStr;
  };

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
    setModalDescription("");
    setModalCategory("primary");
    setModalStartDate(gregorianDateStr);
    setModalEndDate(gregorianDateStr);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleEventClick = (e: React.MouseEvent, event: CalendarEventItem) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setModalTitle(event.title);
    setModalDescription(event.description || "");
    setModalCategory((event.category as any) || "primary");
    setModalStartDate(event.start_date);
    setModalEndDate(event.end_date || event.start_date);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim()) return;

    try {
      setSaving(true);
      setErrorMsg("");

      if (selectedEvent) {
        // Can only edit if admin or user-created
        if (selectedEvent.is_admin_created && !isAdmin) {
          setErrorMsg(isRTL ? "شما اجازه ویرایش رویدادهای ثبت‌شده توسط مدیر را ندارید." : "You cannot edit admin-created events.");
          return;
        }

        await updateCalendarEvent(selectedEvent.id, {
          title: modalTitle.trim(),
          description: modalDescription.trim(),
          category: modalCategory,
          start_date: modalStartDate,
          end_date: modalEndDate || null,
        });
      } else {
        await createCalendarEvent({
          title: modalTitle.trim(),
          description: modalDescription.trim(),
          category: modalCategory,
          start_date: modalStartDate,
          end_date: modalEndDate || null,
        });
      }

      await loadEvents();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to save event", err);
      setErrorMsg(err?.message || (isRTL ? "خطا در ثبت رویداد" : "Failed to save event"));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    if (selectedEvent.is_admin_created && !isAdmin) {
      setErrorMsg(isRTL ? "شما اجازه حذف رویدادهای ثبت‌شده توسط مدیر را ندارید." : "You cannot delete admin-created events.");
      return;
    }

    const confirmMsg = isRTL
      ? "آیا از حذف این رویداد اطمینان دارید؟"
      : "Are you sure you want to delete this event?";
    if (!window.confirm(confirmMsg)) return;

    try {
      setSaving(true);
      setErrorMsg("");
      await deleteCalendarEvent(selectedEvent.id);
      await loadEvents();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to delete event", err);
      setErrorMsg(err?.message || (isRTL ? "خطا در حذف رویداد" : "Failed to delete event"));
    } finally {
      setSaving(false);
    }
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
              ev.start_date === cell.gregorianStr ||
              (ev.end_date && cell.gregorianStr >= ev.start_date && cell.gregorianStr <= ev.end_date)
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
                      className={`px-1.5 py-0.5 rounded text-[11px] font-medium border truncate flex items-center justify-between gap-1 hover:opacity-85 transition-opacity ${style.bg}`}
                      title={ev.title}
                    >
                      <div className="flex items-center gap-1 truncate min-w-0">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                        <span className="truncate">{ev.title}</span>
                      </div>
                      {ev.is_admin_created && (
                        <span className="text-[9px] font-extrabold px-1 rounded bg-indigo-200/80 dark:bg-indigo-900/80 text-indigo-900 dark:text-indigo-200 shrink-0">
                          {isRTL ? "مدیر" : "Admin"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── ADD / EDIT / VIEW EVENT MODAL ────────────────────────────── */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-lg w-full" showCloseButton={false}>
        <div className="p-6 w-full" dir={isRTL ? "rtl" : "ltr"}>
          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalenderIcon className="w-5 h-5 text-[var(--color-primary)]" />
              {selectedEvent
                ? selectedEvent.is_admin_created && !isAdmin
                  ? isRTL
                    ? "مشاهده رویداد (ثبت مدیریت)"
                    : "View Event (Admin Created)"
                  : isRTL
                  ? "ویرایش رویداد"
                  : "Edit Event"
                : isRTL
                ? "ثبت رویداد جدید"
                : "Add New Event"}
            </h3>
            {selectedEvent && (!selectedEvent.is_admin_created || isAdmin) && (
              <button
                type="button"
                onClick={handleDeleteEvent}
                disabled={saving}
                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title={isRTL ? "حذف رویداد" : "Delete Event"}
              >
                <TrashBinIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* READ-ONLY VIEW for regular users viewing admin-created event */}
          {selectedEvent && selectedEvent.is_admin_created && !isAdmin ? (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-xs text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
                <span className="font-extrabold text-[11px] px-2 py-0.5 rounded-full bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200">
                  {isRTL ? "ثبت‌شده توسط مدیریت" : "Admin Created"}
                </span>
                <span>
                  {isRTL
                    ? "این رویداد توسط مدیریت سامانه ثبت شده و غیرقابل ویرایش است."
                    : "This event was registered by management and is read-only."}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  {isRTL ? "عنوان رویداد:" : "Title:"}
                </span>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedEvent.title}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-100 dark:border-gray-800">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
                    {isRTL ? "تاریخ شروع:" : "Start Date:"}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {formatDateBadge(selectedEvent.start_date)}
                  </span>
                </div>
                {selectedEvent.end_date && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-100 dark:border-gray-800">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
                      {isRTL ? "تاریخ پایان:" : "End Date:"}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {formatDateBadge(selectedEvent.end_date)}
                    </span>
                  </div>
                )}
              </div>

              {selectedEvent.description ? (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200/80 dark:border-gray-700">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-1.5">
                    {isRTL ? "توضیحات و راهنمایی رویداد (Explanation):" : "Explanation / Details:"}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  {isRTL ? "توضیحاتی برای این رویداد ثبت نشده است." : "No additional explanation provided."}
                </p>
              )}

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  {isRTL ? "بستن" : "Close"}
                </button>
              </div>
            </div>
          ) : (
            /* EDIT / ADD FORM */
            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                  {isRTL ? "عنوان رویداد *" : "Event Title *"}
                </label>
                <input
                  type="text"
                  required
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder={isRTL ? "مثلا: جلسه خواستگاری و هماهنگی" : "e.g. Intro Meeting"}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white text-slate-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                  {isRTL ? "نوع و رنگ رویداد" : "Event Category / Color"}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(COLOR_CLASSES).map(([catKey, style]) => (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => setModalCategory(catKey as any)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        modalCategory === catKey
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/20 text-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20"
                          : "border-slate-200/80 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-300"
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                      <span>{isRTL ? style.labelFa : style.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                    {isRTL ? "تاریخ شروع *" : "Start Date *"}
                  </label>
                  <ModernDatePicker
                    value={modalStartDate}
                    onChange={(val) => setModalStartDate(val)}
                    placeholder={isRTL ? "انتخاب تاریخ شروع" : "Select start date"}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                    {isRTL ? "تاریخ پایان (اختیاری)" : "End Date (Optional)"}
                  </label>
                  <ModernDatePicker
                    value={modalEndDate}
                    onChange={(val) => setModalEndDate(val)}
                    placeholder={isRTL ? "انتخاب تاریخ پایان" : "Select end date"}
                  />
                </div>
              </div>

              {/* Explanation / Description Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                  {isRTL ? "توضیحات و جزییات رویداد (Explanation)" : "Event Explanation & Notes"}
                </label>
                <textarea
                  rows={3}
                  value={modalDescription}
                  onChange={(e) => setModalDescription(e.target.value)}
                  placeholder={
                    isRTL
                      ? "جزییات مکان، مدارک لازم، یادداشت‌های تکمیلی یا شروط جلسه..."
                      : "Meeting details, required documents, notes..."
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white text-slate-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors shadow-2xs cursor-pointer"
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-[var(--color-primary)] hover:brightness-95 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {saving && <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />}
                  <span>
                    {selectedEvent
                      ? isRTL
                        ? "ذخیره تغییرات"
                        : "Save Changes"
                      : isRTL
                      ? "افزودن رویداد"
                      : "Add Event"}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Calendar;
