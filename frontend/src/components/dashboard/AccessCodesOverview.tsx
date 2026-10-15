'use client';

import React from 'react';
import Link from 'next/link';
import { LockIcon, PlusIcon } from '@/icons';
import { useTranslation } from '@/context/LanguageContext';
import { toPersianDigits } from '@/utils/formatters';

interface AccessCodesOverviewProps {
  total: number;
  active: number;
  used: number;
}

export function AccessCodesOverview({ total, active, used }: AccessCodesOverviewProps) {
  const { t, isRTL } = useTranslation();
  const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;
  const usedPercent = total > 0 ? Math.round((used / total) * 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border-[1.5px] border-slate-300 bg-white dark:border-slate-700/80 dark:bg-white/[0.03] p-6 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between before:absolute before:top-0 before:inset-x-0 before:h-1 before:bg-gradient-to-r before:from-[var(--color-primary)] before:to-[var(--color-accent)]">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/25 dark:bg-brand-950/50">
              <LockIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t("Access Code Utilization")}
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                {t("Invitation codes lifecycle & availability")}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-3.5 w-full rounded-full bg-slate-100 dark:bg-gray-800 flex overflow-hidden border border-slate-200 dark:border-gray-700">
            <div
              className="h-full bg-[var(--color-primary)] transition-all duration-500"
              style={{ width: `${activePercent}%` }}
              title={`${t("Active")}: ${active} (${activePercent}%)`}
            />
            <div
              className="h-full bg-[var(--color-accent)] transition-all duration-500"
              style={{ width: `${usedPercent}%` }}
              title={`${t("Used")}: ${used} (${usedPercent}%)`}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-gray-400 mt-2 font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)] inline-block shadow-xs" />
              {t("Active Available")} ({isRTL ? toPersianDigits(active) : active})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)] inline-block shadow-xs" />
              {t("Consumed / Used")} ({isRTL ? toPersianDigits(used) : used})
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mt-5 text-center">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 dark:bg-brand-950/20 border-[1.5px] border-[var(--color-primary)]/30 dark:border-[var(--color-primary)]/40 shadow-2xs">
            <p className="text-xs font-bold text-[var(--color-primary)]">{t("Total Issued")}</p>
            <p className="text-lg font-bold text-[var(--color-primary)] mt-0.5">{isRTL ? toPersianDigits(total) : total}</p>
          </div>
          <div className="p-3 rounded-xl bg-[var(--color-primary)]/10 dark:bg-brand-950/20 border-[1.5px] border-[var(--color-primary)]/30 dark:border-[var(--color-primary)]/40 shadow-2xs">
            <p className="text-xs font-bold text-[var(--color-primary)]">{t("Active")}</p>
            <p className="text-lg font-bold text-[var(--color-primary)] mt-0.5">{isRTL ? toPersianDigits(active) : active}</p>
          </div>
          <div className="p-3 rounded-xl bg-[var(--color-accent)]/10 dark:bg-purple-950/20 border-[1.5px] border-[var(--color-accent)]/30 dark:border-[var(--color-accent)]/40 shadow-2xs">
            <p className="text-xs font-bold text-[var(--color-accent)]">{t("Used")}</p>
            <p className="text-lg font-bold text-[var(--color-accent)] mt-0.5">{isRTL ? toPersianDigits(used) : used}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-gray-800 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-gray-400">{t("Need more invitation codes?")}</span>
        <Link
          href="/access-codes"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white hover:brightness-105 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          {t("Generate Access Code")}
        </Link>
      </div>
    </div>
  );
}

export default AccessCodesOverview;