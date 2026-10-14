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
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-950/50">
            <GroupIcon className="h-6 w-6" />
          </div>
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
            {t("Platform Coverage")}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {t("Total Registered Users")}
          </p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {isRTL ? toPersianDigits(totalUsers) : totalUsers}
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {isRTL ? toPersianDigits(activeUsers) : activeUsers} {t("active")} ({isRTL ? toPersianDigits(activePercent) : activePercent}%)
          </p>
        </div>
      </div>

      {/* Active Profiles */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-950/50">
            <CheckCircleIcon className="h-6 w-6" />
          </div>
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
            {isRTL ? toPersianDigits(activePercent) : activePercent}% {t("Active Rate")}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {t("Active Profiles")}
          </p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {isRTL ? toPersianDigits(activeUsers) : activeUsers}
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {isRTL ? toPersianDigits(totalUsers - activeUsers) : totalUsers - activeUsers} {t("inactive or pending")}
          </p>
        </div>
      </div>

      {/* Staff & Mediators */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50">
            <UserCircleIcon className="h-6 w-6" />
          </div>
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
            {t("Admin Team")}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {t("Staff & Mediators")}
          </p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {isRTL ? toPersianDigits(staffUsers) : staffUsers}
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t("Administrative accounts")}
          </p>
        </div>
      </div>

      {/* Access Codes */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50">
            <LockIcon className="h-6 w-6" />
          </div>
          <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-950/40 dark:text-purple-400">
            {isRTL ? toPersianDigits(usedCodesPercent) : usedCodesPercent}% {t("Used")}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {t("Access Codes Issued")}
          </p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {isRTL ? toPersianDigits(totalCodes) : totalCodes}
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {isRTL ? toPersianDigits(usedCodes) : usedCodes} {t("used")}, {isRTL ? toPersianDigits(activeCodes) : activeCodes} {t("available")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminMetrics;