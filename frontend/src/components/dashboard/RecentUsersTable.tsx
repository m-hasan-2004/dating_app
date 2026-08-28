'use client';

import React from 'react';
import Link from 'next/link';
import type { User } from '@/services/profileService';
import { UserCircleIcon, ArrowRightIcon } from '@/icons';

interface RecentUsersTableProps {
  users: User[];
  loading?: boolean;
}

export function RecentUsersTable({ users, loading }: RecentUsersTableProps) {
  const displayUsers = users.slice(0, 6);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h3 className="text-base font-bold text-gray-800 dark:text-white">
            Recently Registered Candidates
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Latest profiles signed up via invitation codes
          </p>
        </div>
        <Link
          href="/users"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors"
        >
          View All Users
          <ArrowRightIcon className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50/70 dark:bg-gray-800/40 text-xs font-semibold text-gray-500 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Joined</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  Loading recent users...
                </td>
              </tr>
            ) : displayUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400 italic">
                  No registered users yet.
                </td>
              </tr>
            ) : (
              displayUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3.5 font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs uppercase">
                        {u.username.slice(0, 2)}
                      </div>
                      <span className="font-semibold">{u.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-gray-600 dark:text-gray-400 text-xs">{u.email || '—'}</td>
                  <td className="px-6 py-3.5 text-gray-600 dark:text-gray-400 text-xs">{u.phone_number ?? '—'}</td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        u.is_active
                          ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                      }`}
                    >
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-gray-400 text-xs">
                    {u.date_joined ? new Date(u.date_joined).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <Link
                      href={`/users/${u.id}/profile`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/40 dark:text-brand-400 dark:hover:bg-brand-950/60 transition-colors"
                    >
                      <UserCircleIcon className="w-3.5 h-3.5" />
                      Profile
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentUsersTable;