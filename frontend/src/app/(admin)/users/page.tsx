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
} from '@/icons';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

export default function UsersListPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const isAdmin = Boolean(user?.is_staff || (user as any)?.is_superuser);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace('/');
    }
  }, [authLoading, isAdmin, router]);

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
        params.search = searchQuery.trim();
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
      if (Array.isArray(res)) {
        setUsers(res);
        setTotalCount(res.length);
      } else {
        setUsers(res.results ?? []);
        setTotalCount(res.count ?? 0);
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery, statusFilter, roleFilter]);

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
      alert('Please select at least 1 user from the list.');
      return;
    }

    const actionLabels: Record<string, string> = {
      enable: 'Enable',
      disable: 'Disable',
      make_staff: 'Change to Admin/Staff',
      make_normal: 'Change to Normal User',
    };

    if (
      !confirm(
        `Are you sure you want to perform "${actionLabels[action]}" on ${selectedUserIds.length} selected user(s)?`
      )
    ) {
      return;
    }

    setBatchActionLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const res = await executeBatchUserAction(action, selectedUserIds);
      setSuccessMessage(`Successfully applied action "${actionLabels[action]}" to ${res.affected} user(s).`);
      setSelectedUserIds([]);
      setSelectedBatchAction('');
      await Promise.all([loadUsers(), loadStats()]);
    } catch (e: any) {
      setError(e?.message ?? `Failed to perform batch action`);
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
      setSuccessMessage(`User @${user.username} ${newStatus ? 'activated' : 'deactivated'} successfully.`);
      setTimeout(() => setSuccessMessage(''), 3000);
      await Promise.all([loadUsers(), loadStats()]);
    } catch (e: any) {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, is_active: user.is_active } : u)));
      setError(e?.message ?? 'Failed to update user status');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleToggleStaff = async (user: User) => {
    const newStaff = !user.is_staff;
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, is_staff: newStaff } : u)));
    try {
      await updateUser(user.id, { is_staff: newStaff });
      setSuccessMessage(`User @${user.username} role updated to ${newStaff ? 'Staff' : 'User'}.`);
      setTimeout(() => setSuccessMessage(''), 3000);
      await Promise.all([loadUsers(), loadStats()]);
    } catch (e: any) {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, is_staff: user.is_staff } : u)));
      setError(e?.message ?? 'Failed to update user role');
      setTimeout(() => setError(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View, search, batch manage, and edit dating app user profiles and access roles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/access-codes"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 transition-colors shadow-sm"
          >
            <LockIcon className="w-4 h-4 text-brand-500" />
            Access Codes
          </Link>
        </div>
      </div>

      {/* System-wide True Overview Stats (Database-wide) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Users</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {stats ? stats.total_users : totalCount}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4">
          <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">Active Users</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {stats ? stats.active_users : '—'}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4">
          <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wider">Inactive Users</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
            {stats ? stats.inactive_users : '—'}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Staff / Admins</p>
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
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4 space-y-4">
        {/* Row 1: Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="relative flex-1 max-w-lg">
            <input
              type="text"
              placeholder="Search username, email, phone, middle man code..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-3 pr-4 py-2 text-sm border border-gray-300 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
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
              className="px-3 py-2 text-sm border border-gray-300 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            {/* Role filter */}
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value as any);
                setPage(1);
              }}
              className="px-3 py-2 text-sm border border-gray-300 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Roles</option>
              <option value="staff">Staff / Admin</option>
              <option value="user">Regular User</option>
            </select>

            {/* Page Size Selector */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
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
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          {/* Selection helpers (1 to N) */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-gray-600 dark:text-gray-300">Select:</span>
            <button
              type="button"
              onClick={handleSelectAllOnPage}
              className="px-2.5 py-1 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 transition-colors"
            >
              {isAllOnPageSelected ? 'Deselect All' : `All on Page (${users.length})`}
            </button>
            <button
              type="button"
              onClick={handleSelectActiveOnPage}
              className="px-2.5 py-1 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 transition-colors"
            >
              Active on Page
            </button>
            <button
              type="button"
              onClick={handleSelectInactiveOnPage}
              className="px-2.5 py-1 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 transition-colors"
            >
              Inactive on Page
            </button>
            {selectedUserIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedUserIds([])}
                className="text-red-500 hover:underline px-1"
              >
                Clear ({selectedUserIds.length})
              </button>
            )}
          </div>

          {/* Batch Actions Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
              Actions ({selectedUserIds.length} selected):
            </span>
            <select
              value={selectedBatchAction}
              onChange={(e) => {
                const action = e.target.value as any;
                setSelectedBatchAction(action);
                if (action) {
                  runBatchAction(action);
                }
              }}
              disabled={selectedUserIds.length === 0 || batchActionLoading}
              className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
            >
              <option value="">Choose an action...</option>
              <option value="enable">Enable Selected</option>
              <option value="disable">Disable Selected</option>
              <option value="make_staff">Change Role: Staff / Admin</option>
              <option value="make_normal">Change Role: Normal User</option>
            </select>

            <button
              type="button"
              onClick={() => runBatchAction('enable')}
              disabled={selectedUserIds.length === 0 || batchActionLoading}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors disabled:opacity-40"
            >
              Enable
            </button>
            <button
              type="button"
              onClick={() => runBatchAction('disable')}
              disabled={selectedUserIds.length === 0 || batchActionLoading}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors disabled:opacity-40"
            >
              Disable
            </button>
            <button
              type="button"
              onClick={() => runBatchAction('make_staff')}
              disabled={selectedUserIds.length === 0 || batchActionLoading}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-40"
            >
              Set Staff
            </button>
            <button
              type="button"
              onClick={() => runBatchAction('make_normal')}
              disabled={selectedUserIds.length === 0 || batchActionLoading}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-colors disabled:opacity-40"
            >
              Set Normal
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="w-12 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={isAllOnPageSelected}
                    onChange={handleSelectAllOnPage}
                    className="w-4 h-4 rounded text-brand-500 border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-brand-500"
                    title="Select all on this page"
                  />
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">User</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Phone</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Joined</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                    <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                    Loading matching users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400 italic">
                    No users found matching your search or filters.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isSelected = selectedUserIds.includes(user.id);
                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-gray-50/80 dark:hover:bg-white/[0.02] transition-colors ${
                        isSelected ? 'bg-brand-50/40 dark:bg-brand-950/20' : ''
                      }`}
                    >
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(user.id)}
                          className="w-4 h-4 rounded text-brand-500 border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-brand-500"
                        />
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs uppercase">
                            {user.username.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{user.username}</p>
                            {user.middle_man_code && (
                              <p className="text-xs text-gray-400">Ref: {user.middle_man_code}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600 dark:text-gray-400">{user.email || '—'}</td>
                      <td className="px-4 py-4 text-gray-600 dark:text-gray-400">{user.phone_number ?? '—'}</td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(user)}
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80 ${
                            user.is_active
                              ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                          }`}
                          title="Click to toggle status"
                        >
                          {user.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStaff(user)}
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80 ${
                            user.is_staff
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                          title="Click to toggle staff role"
                        >
                          {user.is_staff ? 'Staff' : 'User'}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-gray-500 dark:text-gray-400 text-xs">
                        {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/users/${user.id}/profile`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/40 dark:text-brand-400 dark:hover:bg-brand-950/60 transition-colors"
                          >
                            <UserCircleIcon className="w-3.5 h-3.5" />
                            Profile
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleToggleActive(user)}
                            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                              user.is_active
                                ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:hover:bg-amber-950/60'
                                : 'text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-950/40 dark:text-green-400 dark:hover:bg-green-950/60'
                            }`}
                            title={user.is_active ? 'Deactivate user account' : 'Activate user account'}
                          >
                            {user.is_active ? 'Deactivate' : 'Activate'}
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.01]">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Showing{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {totalCount === 0 ? 0 : (page - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {Math.min(page * pageSize, totalCount)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-300">{totalCount}</span> matching users
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 disabled:opacity-40 transition-colors"
            >
              Previous
            </button>

            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 px-2">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}