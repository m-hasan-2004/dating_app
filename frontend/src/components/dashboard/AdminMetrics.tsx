'use client';

import React from 'react';
import { GroupIcon, LockIcon, UserCircleIcon, CheckCircleIcon } from '@/icons';
import { useTranslation } from '@/context/LanguageContext';
import { toPersianDigits } from '@/utils/formatters';

interface AdminMetricsProps {
  totalUsers: number;
  activeUsers: number;
  staffUsers: number;
  totalCodes: number;
  usedCodes: number;
  activeCodes: number;
}

export function AdminMetrics({
  totalUsers,
  activeUsers,
  staffUsers,
  totalCodes,
  usedCodes,
  activeCodes,
}: AdminMetricsProps) {
  const { t, isRTL } = useTranslation();
  const activePercent = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
  const usedCodesPercent = totalCodes > 0 ? Math.round((usedCodes / totalCodes) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Total Users */}
      <div className="relative overflow-hidden rounded-2xl border-[1.5px] border-slate-300 bg-white p-5 dark:border-slate-700/80 dark:bg-white/[0.03] shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-[var(--color-primary)] transition-all duration-200 cursor-pointer before:absolute before:top-0 before:inset-x-0 before:h-1 before:bg-gradient-to-r before:from-[var(--color-primary)] before:to-[var(--color-accent)]">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)]/15 to-[var(--color-accent)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/25 dark:bg-brand-950/50">
            <GroupIcon className="h-6 w-6" />
          </div>
          <span className="inline-flex items-center rounded-full bg-[var(--color-primary)]/10 px-2.5 py-1 text-xs font-bold text-[var(--color-primary)] border border-[var(--color-primary)]/20 dark:bg-brand-950/40 dark:text-[var(--color-primary)]">
            {t("Platform Coverage")}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
            {t("Total Registered Users")}
          </p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {isRTL ? toPersianDigits(totalUsers) : totalUsers}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">
            {isRTL ? toPersianDigits(activeUsers) : activeUsers} {t("active")} ({isRTL ? toPersianDigits(activePercent) : activePercent}%)
          </p>
        </div>
      </div>

      {/* Active Profiles */}
      <div className="relative overflow-hidden rounded-2xl border-[1.5px] border-slate-300 bg-white p-5 dark:border-slate-700/80 dark:bg-white/[0.03] shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-[var(--color-primary)] transition-all duration-200 cursor-pointer before:absolute before:top-0 before:inset-x-0 before:h-1 before:bg-[var(--color-primary)]">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/25 dark:bg-brand-950/50">
            <CheckCircleIcon className="h-6 w-6" />
          </div>
          <span className="inline-flex items-center rounded-full bg-[var(--color-primary)]/10 px-2.5 py-1 text-xs font-bold text-[var(--color-primary)] border border-[var(--color-primary)]/20 dark:bg-brand-950/40 dark:text-[var(--color-primary)]">
            {isRTL ? toPersianDigits(activePercent) : activePercent}% {t("Active Rate")}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
            {t("Active Profiles")}
          </p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {isRTL ? toPersianDigits(activeUsers) : activeUsers}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">
            {isRTL ? toPersianDigits(totalUsers - activeUsers) : totalUsers - activeUsers} {t("inactive or pending")}
          </p>
        </div>
      </div>

      {/* Staff & Mediators */}
      <div className="relative overflow-hidden rounded-2xl border-[1.5px] border-slate-300 bg-white p-5 dark:border-slate-700/80 dark:bg-white/[0.03] shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-[var(--color-accent)] transition-all duration-200 cursor-pointer before:absolute before:top-0 before:inset-x-0 before:h-1 before:bg-[var(--color-accent)]">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/25 dark:bg-purple-950/50">
            <UserCircleIcon className="h-6 w-6" />
          </div>
          <span className="inline-flex items-center rounded-full bg-[var(--color-accent)]/10 px-2.5 py-1 text-xs font-bold text-[var(--color-accent)] border border-[var(--color-accent)]/20 dark:bg-purple-950/40 dark:text-[var(--color-accent)]">
            {t("Admin Team")}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
            {t("Staff & Mediators")}
          </p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {isRTL ? toPersianDigits(staffUsers) : staffUsers}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">
            {t("Administrative accounts")}
          </p>
        </div>
      </div>

      {/* Access Codes */}
      <div className="relative overflow-hidden rounded-2xl border-[1.5px] border-slate-300 bg-white p-5 dark:border-slate-700/80 dark:bg-white/[0.03] shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-[var(--color-accent)] transition-all duration-200 cursor-pointer before:absolute before:top-0 before:inset-x-0 before:h-1 before:bg-gradient-to-r before:from-[var(--color-accent)] before:to-[var(--color-primary)]">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent)]/15 to-[var(--color-primary)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/25 dark:bg-purple-950/50">
            <LockIcon className="h-6 w-6" />
          </div>
          <span className="inline-flex items-center rounded-full bg-[var(--color-accent)]/10 px-2.5 py-1 text-xs font-bold text-[var(--color-accent)] border border-[var(--color-accent)]/20 dark:bg-purple-950/40 dark:text-[var(--color-accent)]">
            {isRTL ? toPersianDigits(usedCodesPercent) : usedCodesPercent}% {t("Used")}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
            {t("Access Codes Issued")}
          </p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {isRTL ? toPersianDigits(totalCodes) : totalCodes}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">
            {isRTL ? toPersianDigits(usedCodes) : usedCodes} {t("used")}, {isRTL ? toPersianDigits(activeCodes) : activeCodes} {t("available")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminMetrics;