'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
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
      setToastMessage(`@${candidate.username} removed from saved bookmarks.`);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-brand-500/5 to-transparent border border-amber-500/20 dark:border-amber-500/10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span className="text-amber-500">★</span>
            Saved Bookmarks
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
            Manage your bookmarked candidate profiles and quick shortcuts
          </p>
        </div>

        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-2xl bg-brand-500 text-white hover:bg-brand-600 transition-all shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 1114 0z" />
          </svg>
          Candidate Search
        </Link>
      </div>

      {/* Count & Status */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
        <span>
          Total saved: <strong className="text-gray-900 dark:text-white font-bold">{bookmarks.length}</strong> profiles
        </span>
        {loading && <span className="text-brand-500 font-medium animate-pulse">Loading bookmarks...</span>}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Bookmarks Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-80 rounded-3xl bg-gray-100 dark:bg-gray-800/40 animate-pulse border border-gray-200 dark:border-gray-800"
            ></div>
          ))}
        </div>
      ) : bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {bookmarks.map((cand) => {
            const isFemale = cand.gender === 'woman' || cand.gender === 'female';
            const loc = cand.birth_location || cand.province || '—';
            const edu = cand.education || cand.educationLevel || cand.degree || '—';
            const mar = cand.marriage_experience || cand.maritalExperience;

            return (
              <div
                key={cand.id}
                className="group relative rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 shadow-sm hover:shadow-xl hover:border-amber-400/50 dark:hover:border-amber-400/50 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md ${
                        isFemale
                          ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-pink-500/20'
                          : 'bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-brand-500/20'
                      }`}
                    >
                      {cand.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-brand-500 transition-colors">
                        @{cand.username}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        <span>{cand.age ? `${cand.age} yrs` : 'Age: —'}</span>
                        <span>•</span>
                        <span className="truncate max-w-[100px]">{loc}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveBookmark(cand)}
                    className="p-2 rounded-xl bg-amber-100 text-amber-500 hover:bg-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:hover:bg-amber-900/60 transition-all cursor-pointer shadow-xs"
                    title="Remove from bookmarks"
                  >
                    <svg className="w-4 h-4 fill-current text-amber-500" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </button>
                </div>

                <div className="my-4 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                    <span className="text-gray-400">🎓</span>
                    <span className="truncate font-medium">{edu}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                    <span className="text-gray-400">💼</span>
                    <span className="truncate font-medium">{cand.job || 'Career: —'}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <span className="text-gray-400">📏</span>
                    <span>
                      {cand.height ? `${cand.height} cm` : '—'} / {cand.weight ? `${cand.weight} kg` : '—'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {mar === 'no' && (
                      <span className="px-2 py-0.5 text-[11px] font-semibold rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                        Never Married
                      </span>
                    )}
                    {mar === 'yes' && (
                      <span className="px-2 py-0.5 text-[11px] font-semibold rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                        Divorced
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/candidates/${cand.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-2xl bg-gray-50 text-gray-700 hover:bg-brand-500 hover:text-white dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-brand-500 dark:hover:text-white transition-all shadow-2xs"
                >
                  <UserCircleIcon className="w-4 h-4" />
                  <span>View Public Profile</span>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white dark:border-gray-800 dark:bg-white/[0.01] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mx-auto mb-4 text-amber-500">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            No Bookmarked Candidates Yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-1 mb-6">
            Bookmark promising candidate profiles in the search page to easily find and review them later.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-2xl bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-sm"
          >
            Discover Candidates
          </Link>
        </div>
      )}
    </div>
  );
}
