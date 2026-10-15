'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import {
  fetchBookmarks,
  toggleBookmark,
  type CandidateProfile,
} from '@/services/profileService';
import {
  UserCircleIcon,
  CheckCircleIcon,
} from '@/icons';

export default function BookmarksPage() {
  const { t } = useTranslation();
  const [bookmarks, setBookmarks] = useState<CandidateProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const loadBookmarks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchBookmarks();
      setBookmarks(data);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load saved bookmarks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const handleRemoveBookmark = async (candidate: CandidateProfile) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== candidate.id));
    try {
      await toggleBookmark(candidate.id);
      setToastMessage(`@${candidate.username} ${t("removed from saved bookmarks.")}`);
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      setBookmarks((prev) => [...prev, candidate]);
      setError('Failed to remove bookmark. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-2xl bg-gray-900 text-white shadow-2xl dark:bg-white dark:text-gray-900 transition-all transform animate-slide-up border border-gray-700/50">
          <CheckCircleIcon className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-[var(--color-primary)]/5 to-transparent border border-amber-500/20 dark:border-amber-500/10 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span className="text-amber-500">★</span>
            {t("Saved Candidate Bookmarks")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mt-1">
            {t("Manage your shortlisted candidate profiles for easy review and future introduction coordination.")}
          </p>
        </div>

        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-2xl bg-[var(--color-primary)] text-white hover:brightness-95 transition-all shadow-xs"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 1114 0z" />
          </svg>
          {t("Candidate Search")}
        </Link>
      </div>

      {/* Count & Status */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400 px-1">
        <span>
          {t("Total saved")}: <strong className="text-slate-900 dark:text-white font-bold">{bookmarks.length}</strong> {t("candidates")}
        </span>
        {loading && <span className="text-[var(--color-primary)] font-medium animate-pulse">{t("Loading...")}</span>}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Bookmarks Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-72 rounded-3xl bg-slate-100 dark:bg-gray-800/40 animate-pulse border border-slate-200/80 dark:border-gray-800" />
          ))}
        </div>
      ) : bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {bookmarks.map((cand) => {
            const isFemale = cand.gender === 'woman' || cand.gender === 'female';
            const loc = cand.birth_location || cand.province || '—';
            const edu = cand.education || cand.educationLevel || cand.degree || '—';

            return (
              <div
                key={cand.id}
                className="group relative rounded-3xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 shadow-xs hover:shadow-md hover:border-amber-400/60 dark:hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md transition-transform group-hover:scale-105 ${
                          isFemale
                            ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-pink-500/20'
                            : 'bg-gradient-to-br from-[var(--color-primary)] to-indigo-600 text-white shadow-brand-500/20'
                        }`}
                      >
                        {cand.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-amber-500 transition-colors">
                          @{cand.username}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                          <span>{cand.age ? `${cand.age} ${t("Years")}` : '—'}</span>
                          <span>•</span>
                          <span className="truncate max-w-[100px]">{t(loc)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveBookmark(cand)}
                      className="p-2 rounded-xl text-amber-500 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors cursor-pointer"
                      title={t("Remove Bookmark")}
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </button>
                  </div>

                  <div className="my-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
                      <span className="text-slate-400">🎓</span>
                      <span className="truncate font-medium">{t(edu)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
                      <span className="text-slate-400">💼</span>
                      <span className="truncate font-medium">{cand.job ? t(cand.job) : '—'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400">
                      <span className="text-slate-400">📏</span>
                      <span>
                        {cand.height ? `${cand.height} cm` : '—'} / {cand.weight ? `${cand.weight} kg` : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-gray-800/80">
                  <Link
                    href={`/candidates/${cand.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-2xl bg-slate-100 text-slate-700 hover:bg-[var(--color-primary)] hover:text-white dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-brand-500 dark:hover:text-white transition-all shadow-2xs"
                  >
                    <UserCircleIcon className="w-3.5 h-3.5" />
                    <span>{t("View Profile")}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleRemoveBookmark(cand)}
                    className="p-2 text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-red-950/30 rounded-2xl transition-colors"
                    title={t("Remove Bookmark")}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-gray-800 bg-white dark:bg-white/[0.01] p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto text-2xl mb-3 shadow-xs">
            ★
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t("No Candidates Bookmarked Yet")}
          </h3>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
            {t("Browse the candidate discovery directory and click the star icon on profiles you wish to shortlist.")}
          </p>
          <Link
            href="/search"
            className="inline-block mt-4 px-5 py-2.5 text-xs font-semibold rounded-2xl bg-[var(--color-primary)] text-white hover:brightness-95 transition-all shadow-xs"
          >
            {t("Open Candidate Search")}
          </Link>
        </div>
      )}
    </div>
  );
}