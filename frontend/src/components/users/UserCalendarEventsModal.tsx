'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/ui/modal';
import ModernDatePicker from '@/components/ui/ModernDatePicker';
import { CalenderIcon, TrashBinIcon } from '@/icons';
import { useTranslation } from '@/context/LanguageContext';
import {
  CalendarEventItem,
  fetchCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from '@/services/api/calendarService';
import { formatDate } from '@/utils/formatters';
import { gregorianToJalali, toPersianDigits } from '@/utils/jalali';

interface UserCalendarEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    username: string;
    first_name?: string;
    last_name?: string;
  } | null;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; dot: string; labelFa: string; labelEn: string }> = {
  primary: {
    bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    text: 'text-blue-600 dark:text-blue-400',
    dot: 'bg-blue-500',
    labelFa: 'اصلی',
    labelEn: 'Primary',
  },
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
    labelFa: 'موفق',
    labelEn: 'Success',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    text: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
    labelFa: 'هشدار',
    labelEn: 'Warning',
  },
  danger: {
    bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    text: 'text-rose-600 dark:text-rose-400',
    dot: 'bg-rose-500',
    labelFa: 'مهم / خطر',
    labelEn: 'Danger',
  },
};

export default function UserCalendarEventsModal({
  isOpen,
  onClose,
  user,
}: UserCalendarEventsModalProps) {
  const { t, isRTL } = useTranslation();

  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form mode: 'list' | 'add' | 'edit'
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingEventId, setEditingEventId] = useState<number | string | null>(null);

  // Form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState<string>('primary');
  const [submitting, setSubmitting] = useState(false);

  // Filter in list
  const [searchFilter, setSearchFilter] = useState('');

  const formatDateBadge = (dateStr?: string) => {
    if (!dateStr) return '';
    if (!isRTL) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        const j = gregorianToJalali(new Date(y, m - 1, d));
        return `${toPersianDigits(j.year)}/${toPersianDigits(String(j.month).padStart(2, '0'))}/${toPersianDigits(String(j.day).padStart(2, '0'))}`;
      }
    }
    return dateStr;
  };

  const loadEvents = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError('');
      const data = await fetchCalendarEvents(user.id);
      setEvents(data);
    } catch (err: any) {
      console.error('Failed to load user events', err);
      setError(err?.message || 'خطا در دریافت لیست رویدادها');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isOpen && user?.id) {
      loadEvents();
      setViewMode('list');
      setEditingEventId(null);
      setError('');
      setSuccessMsg('');
    }
  }, [isOpen, user?.id, loadEvents]);

  const handleStartAdd = () => {
    setEditingEventId(null);
    setTitle('');
    setDescription('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setCategory('primary');
    setViewMode('form');
    setError('');
  };

  const handleStartEdit = (item: CalendarEventItem) => {
    setEditingEventId(item.id);
    setTitle(item.title);
    setDescription(item.description || '');
    setStartDate(item.start_date);
    setEndDate(item.end_date || '');
    setCategory(item.category || 'primary');
    setViewMode('form');
    setError('');
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    if (!title.trim()) {
      setError(isRTL ? 'لطفاً عنوان رویداد را وارد کنید.' : 'Title is required.');
      return;
    }
    if (!startDate) {
      setError(isRTL ? 'لطفاً تاریخ شروع را مشخص کنید.' : 'Start date is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      if (editingEventId) {
        await updateCalendarEvent(editingEventId, {
          title: title.trim(),
          description: description.trim(),
          start_date: startDate,
          end_date: endDate || null,
          category,
        });
        setSuccessMsg(isRTL ? 'رویداد با موفقیت به‌روزرسانی شد.' : 'Event updated successfully.');
      } else {
        await createCalendarEvent({
          user: user.id,
          title: title.trim(),
          description: description.trim(),
          start_date: startDate,
          end_date: endDate || null,
          category,
        });
        setSuccessMsg(isRTL ? 'رویداد جدید با موفقیت برای این کاربر ثبت شد.' : 'Event created successfully.');
      }

      await loadEvents();
      setViewMode('list');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Failed to save event', err);
      setError(err?.message || (isRTL ? 'خطا در ثبت رویداد' : 'Failed to save event'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    const confirmMsg = isRTL
      ? 'آیا از حذف این رویداد اطمینان دارید؟'
      : 'Are you sure you want to delete this event?';
    if (!window.confirm(confirmMsg)) return;

    try {
      setLoading(true);
      await deleteCalendarEvent(id);
      setSuccessMsg(isRTL ? 'رویداد با موفقیت حذف شد.' : 'Event deleted successfully.');
      await loadEvents();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Failed to delete event', err);
      setError(err?.message || (isRTL ? 'خطا در حذف رویداد' : 'Failed to delete event'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  const displayName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;

  const filteredEvents = events.filter((ev) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      ev.title.toLowerCase().includes(q) ||
      (ev.description && ev.description.toLowerCase().includes(q))
    );
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl w-full" showCloseButton={false}>
      <div className="p-6 w-full" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <CalenderIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {isRTL ? 'مدیریت رویدادهای تقویم' : 'Manage Calendar Events'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isRTL ? 'کاربر:' : 'User:'}{' '}
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {displayName}
                </span>{' '}
                <span className="font-mono text-slate-400">(@{user.username})</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title={t('Close')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-3 mb-4 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="p-3 mb-4 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
            {successMsg}
          </div>
        )}

        {/* Sub-header Navigation / Actions */}
        <div className="flex items-center justify-between gap-3 mb-4">
          {viewMode === 'list' ? (
            <>
              <div className="flex-1 max-w-xs">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder={isRTL ? 'جست‌وجوی رویداد...' : 'Search events...'}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <button
                type="button"
                onClick={handleStartAdd}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>+</span>
                <span>{isRTL ? 'افزودن رویداد جدید' : 'Add New Event'}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setViewMode('list');
                setError('');
              }}
              className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              {isRTL ? '← بازگشت به لیست رویدادها' : '← Back to Event List'}
            </button>
          )}
        </div>

        {/* VIEW 1: EVENT LIST */}
        {viewMode === 'list' && (
          <div>
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {isRTL ? 'در حال بارگذاری رویدادها...' : 'Loading events...'}
                </span>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-2xl">
                <CalenderIcon className="w-10 h-10 mx-auto text-slate-300 dark:text-gray-600 mb-2" />
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  {isRTL ? 'هیچ رویدادی برای این کاربر یافت نشد' : 'No events found for this user'}
                </p>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  {isRTL
                    ? 'می‌توانید با دکمه زیر، رویداد اختصاصی جدیدی ثبت نمایید.'
                    : 'Click below to register an event for this user.'}
                </p>
                <button
                  type="button"
                  onClick={handleStartAdd}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer"
                >
                  {isRTL ? 'ثبت اولین رویداد' : 'Register First Event'}
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {filteredEvents.map((ev) => {
                  const style = CATEGORY_STYLES[ev.category] || CATEGORY_STYLES.primary;
                  return (
                    <div
                      key={ev.id}
                      className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-gray-800 bg-white dark:bg-gray-800/60 shadow-2xs hover:shadow-xs transition-shadow flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span className={`w-3 h-3 rounded-full mt-1 shrink-0 ${style.dot}`} />
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {ev.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              {/* Date badge */}
                              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg">
                                {formatDateBadge(ev.start_date)}
                                {ev.end_date && ev.end_date !== ev.start_date ? ` ${isRTL ? 'تا' : 'to'} ${formatDateBadge(ev.end_date)}` : ''}
                              </span>

                              {/* Creator Tag */}
                              {ev.is_admin_created ? (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                  {isRTL ? 'مدیریت (ادمین)' : 'Admin Created'}
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-gray-600">
                                  {isRTL ? 'شخصی (کاربر)' : 'User Created'}
                                </span>
                              )}

                              {/* Category badge */}
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.bg}`}>
                                {isRTL ? style.labelFa : style.labelEn}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(ev)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors cursor-pointer"
                            title={isRTL ? 'ویرایش رویداد' : 'Edit Event'}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(ev.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                            title={isRTL ? 'حذف رویداد' : 'Delete Event'}
                          >
                            <TrashBinIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Explanation / Description Box */}
                      {ev.description && (
                        <div className="mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-gray-900/60 border border-slate-100 dark:border-gray-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          <span className="font-bold text-slate-700 dark:text-slate-200 block mb-0.5">
                            {isRTL ? 'توضیحات و جزییات:' : 'Explanation / Notes:'}
                          </span>
                          <p className="whitespace-pre-line">{ev.description}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: ADD / EDIT EVENT FORM */}
        {viewMode === 'form' && (
          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-800 dark:text-indigo-300 font-semibold">
              {editingEventId
                ? isRTL
                  ? 'در حال ویرایش مشخصات رویداد'
                  : 'Editing event record'
                : isRTL
                ? `افزودن رویداد جدید اختصاصی برای ${displayName}`
                : `Adding new event for ${displayName}`}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                {isRTL ? 'نام / عنوان رویداد *' : 'Event Title *'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isRTL ? 'مثال: جلسه مشاوره ازدواج / پیگیری پرونده' : 'e.g. Follow-up consultation'}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white text-slate-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                {isRTL ? 'رنگ و اولویت رویداد' : 'Event Color / Category'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(CATEGORY_STYLES).map(([catKey, style]) => (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      category === catKey
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-300'
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
                  {isRTL ? 'تاریخ شروع *' : 'Start Date *'}
                </label>
                <ModernDatePicker
                  value={startDate}
                  onChange={(val) => setStartDate(val)}
                  placeholder={isRTL ? 'انتخاب تاریخ شروع' : 'Select start date'}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                  {isRTL ? 'تاریخ پایان (اختیاری)' : 'End Date (Optional)'}
                </label>
                <ModernDatePicker
                  value={endDate}
                  onChange={(val) => setEndDate(val)}
                  placeholder={isRTL ? 'انتخاب تاریخ پایان' : 'Select end date'}
                />
              </div>
            </div>

            {/* Explanation / Description Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1">
                {isRTL ? 'توضیحات و یادداشت تکمیلی (Explanation)' : 'Explanation & Notes'}
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  isRTL
                    ? 'جزییات هماهنگی، شروط جلسه، مدارک لازم یا توضیحات رویداد...'
                    : 'Event details, requirements, meeting notes...'
                }
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white text-slate-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Form actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                disabled={submitting}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors shadow-2xs cursor-pointer"
              >
                {t('Cancel')}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {submitting && <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />}
                <span>
                  {editingEventId
                    ? isRTL
                      ? 'ذخیره تغییرات'
                      : 'Save Changes'
                    : isRTL
                    ? 'ثبت رویداد'
                    : 'Create Event'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
