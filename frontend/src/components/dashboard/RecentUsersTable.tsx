'use client';

import React from 'react';
import Link from 'next/link';
import type { User } from '@/services/profileService';
import { UserCircleIcon, ArrowRightIcon } from '@/icons';
import { useTranslation } from '@/context/LanguageContext';
import { formatDate, formatIranianPhoneNumber } from '@/utils/formatters';

interface RecentUsersTableProps {
  users: User[];
  loading?: boolean;
}

export function RecentUsersTable({ users, loading }: RecentUsersTableProps) {
  const { t, isRTL } = useTranslation();
  const displayUsers = users.slice(0, 6);

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden shadow-soft hover:shadow-soft-hover transition-shadow">
      <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-gray-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t("Recently Registered Candidates")}
          </h3>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {t("Latest profiles signed up via invitation codes")}
          </p>
        </div>
        <Link
          href="/users"
          className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] hover:underline transition-colors"
        >
          {t("View All Users")}
          <ArrowRightIcon className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/80 dark:bg-gray-800/40 text-xs font-bold text-slate-700 dark:text-slate-300">
            <tr>
              <th className={`px-6 py-3.5 ${isRTL ? 'text-right' : 'text-left'}`}>{t("User")}</th>
              <th className={`px-6 py-3.5 ${isRTL ? 'text-right' : 'text-left'}`}>{t("Phone")}</th>
              <th className={`px-6 py-3.5 ${isRTL ? 'text-right' : 'text-left'}`}>{t("Status")}</th>
              <th className={`px-6 py-3.5 ${isRTL ? 'text-right' : 'text-left'}`}>{t("Joined")}</th>
              <th className={`px-6 py-3.5 ${isRTL ? 'text-left' : 'text-right'}`}>{t("Action")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-medium">
                  {t("Loading recent users...")}
                </td>
              </tr>
            ) : displayUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic font-medium">
                  {t("No registered users yet.")}
                </td>
              </tr>
            ) : (
              displayUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3.5 font-medium text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] dark:bg-brand-950/60 flex items-center justify-center font-bold text-xs uppercase">
                        {u.username.slice(0, 2)}
                      </div>
                      <span className="font-semibold">{u.username}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-3.5 text-slate-700 dark:text-slate-300 text-xs font-mono font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                    {formatIranianPhoneNumber(u.phone_number)}
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        u.is_active
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                      }`}
                    >
                      {u.is_active ? t('Active') : t('Inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300 text-xs font-medium">
                    {u.date_joined ? formatDate(u.date_joined, isRTL) : '—'}
                  </td>
                  <td className={`px-6 py-3.5 ${isRTL ? 'text-left' : 'text-right'}`}>
                    <Link
                      href={`/users/${u.id}/profile`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 dark:bg-brand-950/40 dark:text-brand-400 transition-colors"
                    >
                      <UserCircleIcon className="w-3.5 h-3.5" />
                      {t("Profile")}
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