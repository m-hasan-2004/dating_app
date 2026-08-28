'use client';

import React, { useEffect, useState, useCallback } from 'react';
import type { User, UserStats } from '@/services/profileService';
import { fetchUsers, fetchUserStats } from '@/services/profileService';
import { fetchAccessCodes, type AccessCode } from '@/services/accessCodeService';
import { AdminMetrics } from '@/components/dashboard/AdminMetrics';
import { AccessCodesOverview } from '@/components/dashboard/AccessCodesOverview';
import { RecentUsersTable } from '@/components/dashboard/RecentUsersTable';
import Link from 'next/link';
import {
  LockIcon,
  UserCircleIcon,
  PlusIcon,
  BoltIcon,
  PieChartIcon,
  ArrowRightIcon,
} from '@/icons';

export default function AdminDashboardPage() {
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
      console.error('Failed to load dashboard statistics', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Database-wide accurate counts
  const totalUsers = stats ? stats.total_users : users.length;
  const activeUsers = stats ? stats.active_users : users.filter((u) => u.is_active).length;
  const staffUsers = stats ? stats.staff_users : users.filter((u) => u.is_staff).length;

  const totalCodes = stats ? stats.total_codes : accessCodes.length;
  const activeCodes = stats ? stats.active_codes : accessCodes.filter((c) => c.active).length;
  const usedCodes = stats ? stats.used_codes : totalCodes - activeCodes;

  return (
    <div className="space-y-6">
      {/* Dashboard Title Bar */}
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
      <div className="rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-500/10 via-brand-500/5 to-transparent dark:border-brand-900/50 dark:from-brand-950/40 dark:via-brand-950/20 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
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