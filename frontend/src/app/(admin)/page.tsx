'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import type { User, UserStats, CandidateProfile } from '@/services/profileService';
import { fetchUsers, fetchUserStats, searchCandidates, fetchBookmarks, toggleBookmark } from '@/services/profileService';
import { fetchAccessCodes, type AccessCode } from '@/services/accessCodeService';
import { AdminMetrics } from '@/components/dashboard/AdminMetrics';
import { AccessCodesOverview } from '@/components/dashboard/AccessCodesOverview';
import { RecentUsersTable } from '@/components/dashboard/RecentUsersTable';
import {
  LockIcon,
  UserCircleIcon,
  PlusIcon,
  BoltIcon,
  PieChartIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from '@/icons';

// ==========================================
// 1. ADMIN DASHBOARD VIEW (Staff Only)
// ==========================================
function AdminDashboardView() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes, codesRes] = await Promise.all([
        fetchUsers({ page_size: 10 }).catch(() => []),
        fetchUserStats().catch(() => null),
        fetchAccessCodes().catch(() => []),
      ]);

      const loadedUsers = Array.isArray(usersRes) ? usersRes : (usersRes?.results ?? []);
      const loadedCodes = Array.isArray(codesRes) ? codesRes : (codesRes?.results ?? []);

      setUsers(loadedUsers);
      setStats(statsRes);
      setAccessCodes(loadedCodes);
    } catch (e) {
      console.error('Failed to load admin dashboard statistics', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalUsers = stats ? stats.total_users : users.length;
  const activeUsers = stats ? stats.active_users : users.filter((u) => u.is_active).length;
  const staffUsers = stats ? stats.staff_users : users.filter((u) => u.is_staff).length;

  const totalCodes = stats ? stats.total_codes : accessCodes.length;
  const activeCodes = stats ? stats.active_codes : accessCodes.filter((c) => c.active).length;
  const usedCodes = stats ? stats.used_codes : totalCodes - activeCodes;

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Admin Panel Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Platform overview, live candidate metrics, access code management, and demographic reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/access-codes"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Generate Access Code
          </Link>
          <Link
            href="/users"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 transition-colors shadow-sm"
          >
            <UserCircleIcon className="w-4 h-4 text-brand-500" />
            Manage Users
          </Link>
        </div>
      </div>

      {/* Database-Wide KPI Overview Metrics */}
      <AdminMetrics
        totalUsers={totalUsers}
        activeUsers={activeUsers}
        staffUsers={staffUsers}
        totalCodes={totalCodes}
        usedCodes={usedCodes}
        activeCodes={activeCodes}
      />

      {/* Statistics Hub Spotlight Banner */}
      <div className="rounded-3xl border border-brand-200 bg-gradient-to-r from-brand-500/10 via-brand-500/5 to-transparent dark:border-brand-900/50 dark:from-brand-950/40 dark:via-brand-950/20 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-md">
            <PieChartIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Demographic & Candidate Statistics
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              Explore in-depth charts and breakdowns for gender ratios, age cohorts, academic qualifications, income brackets, and real-estate ownership.
            </p>
          </div>
        </div>
        <Link
          href="/statistics"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-colors shrink-0 shadow-sm"
        >
          <span>View Full Statistics</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>

      {/* Middle Grid: Access Codes Lifecycle + Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <AccessCodesOverview
            total={totalCodes}
            active={activeCodes}
            used={usedCodes}
          />
        </div>

        <div className="lg:col-span-6 flex flex-col justify-between gap-4">
          <Link
            href="/users"
            className="group rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] hover:border-brand-500 dark:hover:border-brand-500 transition-all shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 group-hover:scale-110 transition-transform">
                <UserCircleIcon className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">User Directory & Management</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Search, filter, and batch manage candidates</p>
              </div>
            </div>
            <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-brand-500 transition-colors" />
          </Link>

          <Link
            href="/statistics"
            className="group rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] hover:border-brand-500 dark:hover:border-brand-500 transition-all shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 group-hover:scale-110 transition-transform">
                <PieChartIcon className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Comprehensive Analytics</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Age, gender, education & income charts</p>
              </div>
            </div>
            <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-brand-500 transition-colors" />
          </Link>

          <Link
            href="/profile"
            className="group rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] hover:border-brand-500 dark:hover:border-brand-500 transition-all shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-950/50 group-hover:scale-110 transition-transform">
                <BoltIcon className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">My Admin Profile</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">View and edit personal matching profile</p>
              </div>
            </div>
            <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-brand-500 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Recently Registered Candidates Feed */}
      <div>
        <RecentUsersTable users={users} loading={loading} />
      </div>
    </div>
  );
}

// ==========================================
// 2. USER DASHBOARD VIEW (Normal Candidates)
// ==========================================
function UserDashboardView({ user }: { user: any }) {
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [bookmarksCount, setBookmarksCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(async () => {
    setLoading(true);
    try {
      const [candRes, bmRes] = await Promise.all([
        searchCandidates({ page_size: 4 }).catch(() => null),
        fetchBookmarks().catch(() => []),
      ]);

      if (candRes?.results) {
        setCandidates(candRes.results);
      }
      const bms = Array.isArray(bmRes) ? bmRes : ((bmRes as any)?.results ?? []);
      setBookmarksCount(bms.length);
    } catch (e) {
      console.error('Failed to load user dashboard feed', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleToggleBookmark = async (cand: CandidateProfile) => {
    try {
      const res = await toggleBookmark(cand.id);
      setCandidates((prev) =>
        prev.map((c) => (c.id === cand.id ? { ...c, is_bookmarked: res.is_bookmarked } : c))
      );
      setBookmarksCount((prev) => (res.is_bookmarked ? prev + 1 : Math.max(0, prev - 1)));
    } catch (e) {
      console.error('Failed to toggle bookmark', e);
    }
  };

  const displayName = user?.first_name ? `${user.first_name} ${user?.last_name || ''}`.trim() : `@${user?.username}`;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-200/80 bg-gradient-to-br from-brand-500 via-indigo-600 to-purple-700 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                ✨ Candidate Member
              </span>
              {user?.middle_man_code && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-black/20 text-white/90">
                  Ref: {user.middle_man_code}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {displayName}!
            </h1>
            <p className="text-sm text-white/85 leading-relaxed">
              Explore faith-aligned candidates of the opposite gender, review spouse criteria, and manage your shortlisted favorites.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold rounded-2xl bg-white text-brand-600 hover:bg-white/90 transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 1114 0z" />
              </svg>
              <span>Search Candidates</span>
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold rounded-2xl bg-white/15 backdrop-blur-md text-white hover:bg-white/25 transition-all border border-white/20"
            >
              <UserCircleIcon className="w-4 h-4" />
              <span>My Profile</span>
            </Link>
          </div>
        </div>

        {/* Decorative Background Circles */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Bookmarks */}
        <Link
          href="/profile/bookmarks"
          className="group rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 hover:border-amber-400 dark:hover:border-amber-500/60 transition-all shadow-xs hover:shadow-md flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 fill-current text-amber-500" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Saved Bookmarks</p>
              <p className="text-xl font-extrabold text-gray-900 dark:text-white mt-0.5">{bookmarksCount} Shortlisted</p>
            </div>
          </div>
          <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
        </Link>

        {/* Discovery Directory */}
        <Link
          href="/search"
          className="group rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 hover:border-brand-500 dark:hover:border-brand-500/60 transition-all shadow-xs hover:shadow-md flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-500 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 1114 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Candidate Search</p>
              <p className="text-xl font-extrabold text-gray-900 dark:text-white mt-0.5">Explore Directory</p>
            </div>
          </div>
          <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-brand-500 transition-colors" />
        </Link>

        {/* My Profile */}
        <Link
          href="/profile"
          className="group rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 hover:border-emerald-500 dark:hover:border-emerald-500/60 transition-all shadow-xs hover:shadow-md flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <UserCircleIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Personal Profile</p>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">Active & Ready</p>
            </div>
          </div>
          <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
        </Link>
      </div>

      {/* Suggested Candidate Matches */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Recommended Candidate Matches
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Opposite gender candidates tailored to your search criteria and demographic filters.
            </p>
          </div>
          <Link
            href="/search"
            className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1"
          >
            <span>View All Search Results</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 rounded-3xl bg-gray-100 dark:bg-gray-800/40 animate-pulse border border-gray-200 dark:border-gray-800" />
            ))}
          </div>
        ) : candidates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {candidates.map((cand) => {
              const isBookmarked = Boolean(cand.is_bookmarked ?? cand.isBookmarked);
              const isFemale = cand.gender === 'woman' || cand.gender === 'female';
              const loc = cand.birth_location || cand.province || '—';
              const edu = cand.education || cand.educationLevel || cand.degree || '—';

              return (
                <div
                  key={cand.id}
                  className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs text-white shadow-xs ${
                        isFemale ? 'bg-pink-500' : 'bg-brand-500'
                      }`}>
                        {cand.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">@{cand.username}</h4>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">{cand.age ? `${cand.age} yrs` : '—'} • {loc}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleBookmark(cand)}
                      className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-100 text-amber-500 dark:bg-amber-950/40 dark:text-amber-400'
                          : 'text-gray-400 hover:bg-gray-100 hover:text-amber-500 dark:hover:bg-gray-800'
                      }`}
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Candidate'}
                    >
                      <svg
                        className={`w-4 h-4 ${isBookmarked ? 'fill-current text-amber-500' : 'fill-none stroke-current stroke-2'}`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </button>
                  </div>

                  <div className="my-3 space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                    <p className="truncate"><span className="text-gray-400">🎓</span> {edu}</p>
                    <p className="truncate"><span className="text-gray-400">💼</span> {cand.job || 'Career: —'}</p>
                  </div>

                  <Link
                    href={`/candidates/${cand.id}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-2xl bg-gray-50 text-gray-700 hover:bg-brand-500 hover:text-white dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-brand-500 dark:hover:text-white transition-all shadow-2xs"
                  >
                    <UserCircleIcon className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white dark:border-gray-800 dark:bg-white/[0.01] p-8 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">No recommended candidates yet. Visit the search page to explore all profiles.</p>
            <Link href="/search" className="inline-block mt-3 px-4 py-2 text-xs font-semibold rounded-xl bg-brand-500 text-white">
              Open Candidate Search
            </Link>
          </div>
        )}
      </div>

      {/* Guidelines Card */}
      <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>🤝</span>
          <span>Matchmaking & Privacy Guidelines</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600 dark:text-gray-300 pt-1">
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800/80 space-y-1">
            <strong className="text-gray-900 dark:text-white block font-bold">1. Verified Information</strong>
            <p className="text-gray-500 dark:text-gray-400">Keep your personal, physical, and financial information complete and honest to receive accurate matches.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800/80 space-y-1">
            <strong className="text-gray-900 dark:text-white block font-bold">2. Middle Man Assistance</strong>
            <p className="text-gray-500 dark:text-gray-400">Your assigned middle man coordinates introductions and meetings with candidate families respectfully.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800/80 space-y-1">
            <strong className="text-gray-900 dark:text-white block font-bold">3. Bookmark Shortlist</strong>
            <p className="text-gray-500 dark:text-gray-400">Save potential spouses to your private bookmarks page to review criteria before initiating introduction requests.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. MAIN DASHBOARD PAGE (Role Dispatcher)
// ==========================================
export default function DashboardPage() {
  const { user, loading } = useAuth();
  const isAdmin = Boolean(user?.is_staff || (user as any)?.is_superuser);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return <AdminDashboardView />;
  }

  return <UserDashboardView user={user} />;
}