'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import type { User, UserStats } from '@/services/profileService';
import {
  fetchUsers,
  fetchUserStats,
  executeBatchUserAction,
  updateUser,
} from '@/services/profileService';
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  TrashBinIcon,
  UserCircleIcon,
  CheckCircleIcon,
  AlertIcon,
  LockIcon,
  CalenderIcon,
} from '@/icons';
import UserCalendarEventsModal from '@/components/users/UserCalendarEventsModal';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/context/LanguageContext';
import { formatDate, formatIranianPhoneNumber, formatNumber, toPersianDigits, toEnglishDigits } from '@/utils/formatters';
import { fetchBatchProfileCompletion, ProfileCompletionResult } from '@/utils/profileCompletion';
import { useRouter } from 'next/navigation';

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

export default function UsersListPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const isAdmin = Boolean(user?.is_staff || (user as any)?.is_superuser);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace('/dashboard');
    }
  }, [authLoading, isAdmin, router]);

  if (!isAdmin && !authLoading) {
    return null;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'staff' | 'user'>('all');

  // Batch selection
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [batchActionLoading, setBatchActionLoading] = useState(false);
  const [selectedBatchAction, setSelectedBatchAction] = useState<string>('');
  const [completionMap, setCompletionMap] = useState<Record<string, ProfileCompletionResult>>({});

  // Calendar Events Modal for Admin
  const [calendarModalUser, setCalendarModalUser] = useState<User | null>(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  const handleOpenCalendarEvents = (targetUser: User) => {
    setCalendarModalUser(targetUser);
    setIsCalendarModalOpen(true);
  };

  const loadStats = useCallback(async () => {
    try {
      const s = await fetchUserStats();
      setStats(s);
    } catch (e) {
      console.error('Failed to load user stats', e);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, any> = {
        page,
        page_size: pageSize,
      };
      if (searchQuery.trim()) {
        params.search = toEnglishDigits(searchQuery.trim());
      }
      if (statusFilter === 'active') {
        params.is_active = 'true';
      } else if (statusFilter === 'inactive') {
        params.is_active = 'false';
      }
      if (roleFilter === 'staff') {
        params.is_staff = 'true';
      } else if (roleFilter === 'user') {
        params.is_staff = 'false';
      }

      const res = await fetchUsers(params);
      let loadedUsers: User[] = [];
      if (Array.isArray(res)) {
        loadedUsers = res;
        setUsers(res);
        setTotalCount(res.length);
      } else {
        loadedUsers = res.results ?? [];
        setUsers(loadedUsers);
        setTotalCount(res.count ?? 0);
      }

      // Fetch profile completion for each user on current page in single batch
      if (loadedUsers.length > 0) {
        fetchBatchProfileCompletion(loadedUsers.map((u) => u.id)).then((batchMap) => {
          setCompletionMap((prev) => ({
            ...prev,
            ...batchMap,
          }));
        });
      }
    } catch (e: any) {
      setError(e?.message ?? t('Failed to load users'));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery, statusFilter, roleFilter, t]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Clear selections when page/filter changes
  useEffect(() => {
    setSelectedUserIds([]);
  }, [page, pageSize, statusFilter, roleFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Selection handlers
  const handleSelectAllOnPage = () => {
    if (users.length === 0) return;
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map((u) => u.id));
    }
  };

  const handleSelectActiveOnPage = () => {
    setSelectedUserIds(users.filter((u) => u.is_active).map((u) => u.id));
  };

  const handleSelectInactiveOnPage = () => {
    setSelectedUserIds(users.filter((u) => !u.is_active).map((u) => u.id));
  };

  const handleSelectOne = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isAllOnPageSelected =
    users.length > 0 && users.every((u) => selectedUserIds.includes(u.id));

  // Batch action executor
  const runBatchAction = async (action: 'enable' | 'disable' | 'make_staff' | 'make_normal') => {
    if (selectedUserIds.length === 0) {
      alert(t('Please select at least 1 user from the list.'));
      return;
    }

    const actionLabels: Record<string, string> = {
      enable: t('Enable'),
      disable: t('Disable'),
      make_staff: t('Change to Admin/Staff'),
      make_normal: t('Change to Normal User'),
    };

    if (
      !confirm(
        `${t('Are you sure you want to perform')} "${actionLabels[action]}" ${t('on')} ${selectedUserIds.length} ${t('selected user(s)?')}`
      )
    ) {
      return;
    }

    setBatchActionLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const res = await executeBatchUserAction(action, selectedUserIds);
      setSuccessMessage(`${t('Successfully applied action')} "${actionLabels[action]}" ${t('to')} ${res.affected} ${t('user(s).')}`);
      setSelectedUserIds([]);
      setSelectedBatchAction('');
      await Promise.all([loadUsers(), loadStats()]);
    } catch (e: any) {
      setError(e?.message ?? t('Failed to perform batch action'));
    } finally {
      setBatchActionLoading(false);
    }
  };

  // Single user toggles
  const handleToggleActive = async (user: User) => {
    const newStatus = !user.is_active;
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, is_active: newStatus } : u)));
    try {
      await updateUser(user.id, { is_active: newStatus });
      setSuccessMessage(`${t('User')} @${user.username} ${newStatus ? t('activated') : t('deactivated')} ${t('successfully.')}`);
      setTimeout(() => setSuccessMessage(''), 3000);
      await Promise.all([loadUsers(), loadStats()]);
    } catch (e: any) {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, is_active: user.is_active } : u)));
      setError(e?.message ?? t('Failed to update user status'));
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleToggleStaff = async (user: User) => {
    const newStaff = !user.is_staff;
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, is_staff: newStaff } : u)));
    try {
      await updateUser(user.id, { is_staff: newStaff });
      setSuccessMessage(`${t('User')} @${user.username} ${t('role updated to')} ${newStaff ? t('Staff') : t('User')}.`);
      setTimeout(() => setSuccessMessage(''), 3000);
      await Promise.all([loadUsers(), loadStats()]);
    } catch (e: any) {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, is_staff: user.is_staff } : u)));
      setError(e?.message ?? t('Failed to update user role'));
      setTimeout(() => setError(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("User Management")}</h1>
          <p className="text-sm text-slate-500 dark:text-gray-400">
            {t("View, search, batch manage, and edit dating app user profiles and access roles.")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/access-codes"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 transition-all shadow-2xs"
          >
            <LockIcon className="w-4 h-4 text-[var(--color-primary)]" />
            {t("Access Codes")}
          </Link>
        </div>
      </div>

      {/* System-wide True Overview Stats (Database-wide) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4.5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">{t("Total Users")}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {stats ? stats.total_users : totalCount}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4.5 shadow-xs">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{t("Active Users")}</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {stats ? stats.active_users : '—'}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4.5 shadow-xs">
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">{t("Inactive Users")}</p>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {stats ? stats.inactive_users : '—'}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4.5 shadow-xs">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{t("Staff & Mediators")}</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {stats ? stats.staff_users : '—'}
          </p>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertIcon className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Filter & Search Bar + Selection & Actions Toolbar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4.5 space-y-4 shadow-xs">
        {/* Row 1: Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="relative flex-1 max-w-lg">
            <input
              type="text"
              placeholder={t("Search username, phone, middle man code...")}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-3 pr-4 py-2 text-sm border border-slate-300 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setPage(1);
              }}
              className="px-3 py-2 text-sm border border-slate-300 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
            >
              <option value="all">{t("All Status")}</option>
              <option value="active">{t("Active Only")}</option>
              <option value="inactive">{t("Inactive Only")}</option>
            </select>

            {/* Role filter */}
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value as any);
                setPage(1);
              }}
              className="px-3 py-2 text-sm border border-slate-300 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
            >
              <option value="all">{t("All Roles")}</option>
              <option value="staff">{t("Staff / Admin")}</option>
              <option value="user">{t("Regular User")}</option>
            </select>

            {/* Page Size Selector */}
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
              <span>{t("Per page:")}</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
              >
                {PAGE_SIZE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Row 2: Select 1 to N Helper & Batch Actions Menu */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-gray-800">
          {/* Selection helpers (1 to N) */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600 dark:text-gray-300">{t("Select:")}</span>
            <button
              type="button"
              onClick={handleSelectAllOnPage}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 transition-colors cursor-pointer"
            >
              {isAllOnPageSelected ? t('Deselect All') : `${t('All on Page')} (${users.length})`}
            </button>
            <button
              type="button"
              onClick={handleSelectActiveOnPage}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 transition-colors cursor-pointer"
            >
              {t("Active on Page")}
            </button>
            <button
              type="button"
              onClick={handleSelectInactiveOnPage}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 transition-colors cursor-pointer"
            >
              {t("Inactive on Page")}
            </button>
            {selectedUserIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedUserIds([])}
                className="text-rose-500 hover:underline px-1 cursor-pointer font-semibold"
              >
                {t("Clear")} ({selectedUserIds.length})
              </button>
            )}
          </div>

          {/* Batch Actions Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-gray-300">
              {t("Actions")} ({selectedUserIds.length} {t("selected")}):
            </span>

            <button
              type="button"
              onClick={() => runBatchAction('enable')}
              disabled={selectedUserIds.length === 0 || batchActionLoading}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              {t("Enable")}
            </button>
            <button
              type="button"
              onClick={() => runBatchAction('disable')}
              disabled={selectedUserIds.length === 0 || batchActionLoading}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              {t("Disable")}
            </button>
            <button
              type="button"
              onClick={() => runBatchAction('make_staff')}
              disabled={selectedUserIds.length === 0 || batchActionLoading}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              {t("Set Staff")}
            </button>
            <button
              type="button"
              onClick={() => runBatchAction('make_normal')}
              disabled={selectedUserIds.length === 0 || batchActionLoading}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-600 hover:bg-slate-700 text-white transition-colors disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              {t("Set Normal")}
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 dark:bg-gray-800/60 border-b border-slate-100 dark:border-gray-800">
              <tr>
                <th className="w-12 px-4 py-3.5 text-center">
                  <input
                    type="checkbox"
                    checked={isAllOnPageSelected}
                    onChange={handleSelectAllOnPage}
                    className="w-4 h-4 rounded text-[var(--color-primary)] border-slate-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-[var(--color-primary)]"
                    title={t("Select all on this page")}
                  />
                </th>
                <th className={`px-4 py-3.5 font-semibold text-slate-600 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>{t("User")}</th>
                <th className={`px-4 py-3.5 font-semibold text-slate-600 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>{t("Phone")}</th>
                <th className={`px-4 py-3.5 font-semibold text-slate-600 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>{t("Status")}</th>
                <th className={`px-4 py-3.5 font-semibold text-slate-600 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>{t("Role")}</th>
                <th className={`px-4 py-3.5 font-semibold text-slate-600 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>{t("Joined")}</th>
                <th className={`px-4 py-3.5 font-semibold text-slate-600 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? "میزان تکمیل پروفایل" : "Profile Completion"}</th>
                <th className={`px-4 py-3.5 font-semibold text-slate-600 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>{t("Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
                    {t("Loading matching users...")}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400 italic">
                    {t("No users found matching your search or filters.")}
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isSelected = selectedUserIds.includes(user.id);
                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition-colors ${
                        isSelected ? 'bg-[var(--color-primary)]/10 dark:bg-brand-950/20' : ''
                      }`}
                    >
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(user.id)}
                          className="w-4 h-4 rounded text-[var(--color-primary)] border-slate-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-[var(--color-primary)]"
                        />
                      </td>
                      <td className={`px-4 py-4 font-medium text-slate-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] dark:bg-brand-950/60 flex items-center justify-center font-bold text-xs uppercase">
                            {user.username.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{user.username}</p>
                            {user.middle_man_code && (
                              <p className="text-xs text-slate-400">{t("Ref")}: {user.middle_man_code}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={`px-4 py-4 text-slate-600 dark:text-gray-400 font-mono text-xs ${isRTL ? 'text-right' : 'text-left'}`}>
                        {formatIranianPhoneNumber(user.phone_number)}
                      </td>
                      <td className={`px-4 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(user)}
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80 ${
                            user.is_active
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                          }`}
                          title={t("Click to toggle status")}
                        >
                          {user.is_active ? t('Active') : t('Inactive')}
                        </button>
                      </td>
                      <td className={`px-4 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <button
                          type="button"
                          onClick={() => handleToggleStaff(user)}
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80 ${
                            user.is_staff
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                              : 'bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                          title={t("Click to toggle staff role")}
                        >
                          {user.is_staff ? t('Staff') : t('User')}
                        </button>
                      </td>
                      <td className={`px-4 py-4 text-slate-500 dark:text-gray-400 text-xs ${isRTL ? 'text-right' : 'text-left'}`}>
                        {user.date_joined ? formatDate(user.date_joined, isRTL) : '—'}
                      </td>
                      <td className={`px-4 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {completionMap[user.id] ? (
                          <div className="flex items-center gap-2 max-w-[130px]">
                            <div className="flex-1 bg-slate-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-[var(--color-primary)] h-1.5 rounded-full transition-all"
                                style={{ width: `${completionMap[user.id].percentage}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                              {isRTL ? `${toPersianDigits(completionMap[user.id].percentage)}٪` : `${completionMap[user.id].percentage}%`}
                            </span>
                          </div>
                        ) : (
                          <div className="h-1.5 w-16 bg-slate-100 dark:bg-gray-800 rounded-full animate-pulse" />
                        )}
                      </td>
                      <td className={`px-4 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/users/${user.id}/profile`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 dark:bg-brand-950/40 dark:text-brand-400 transition-colors"
                          >
                            <UserCircleIcon className="w-3.5 h-3.5" />
                            {t("Profile")}
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenCalendarEvents(user)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 transition-colors cursor-pointer"
                            title={isRTL ? 'رویدادها و قرارهای تقویم' : 'Calendar Events'}
                          >
                            <CalenderIcon className="w-3.5 h-3.5" />
                            {isRTL ? 'رویدادها' : 'Events'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleActive(user)}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                              user.is_active
                                ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400'
                                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400'
                            }`}
                            title={user.is_active ? t('Deactivate user account') : t('Activate user account')}
                          >
                            {user.is_active ? t('Deactivate') : t('Activate')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 dark:border-gray-800 bg-slate-50/60 dark:bg-white/[0.01]">
          <span className="text-xs text-slate-500 dark:text-gray-400">
            {t('Showing')}{' '}
            <span className="font-semibold text-slate-700 dark:text-gray-300 tabular-nums">
              {formatNumber(totalCount === 0 ? 0 : (page - 1) * pageSize + 1, isRTL)}
            </span>{' '}
            {t('to')}{' '}
            <span className="font-semibold text-slate-700 dark:text-gray-300 tabular-nums">
              {formatNumber(Math.min(page * pageSize, totalCount), isRTL)}
            </span>{' '}
            {t('of')}{' '}
            <span className="font-semibold text-slate-700 dark:text-gray-300 tabular-nums">
              {formatNumber(totalCount, isRTL)}
            </span>{' '}
            {t('matching users')}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 disabled:opacity-40 transition-colors cursor-pointer shadow-2xs"
            >
              {t("Previous")}
            </button>

            <span className="text-xs font-semibold text-slate-700 dark:text-gray-300 px-2 tabular-nums">
              {t("Page")} {formatNumber(page, isRTL)} {t("of")} {formatNumber(totalPages, isRTL)}
            </span>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 disabled:opacity-40 transition-colors cursor-pointer shadow-2xs"
            >
              {t("Next")}
            </button>
          </div>
        </div>
      </div>

      {/* User Calendar Events Admin Modal */}
      <UserCalendarEventsModal
        isOpen={isCalendarModalOpen}
        onClose={() => {
          setIsCalendarModalOpen(false);
          setCalendarModalUser(null);
        }}
        user={calendarModalUser}
      />
    </div>
  );
}