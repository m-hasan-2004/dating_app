'use client';

import React from 'react';
import Link from 'next/link';
import { LockIcon, PlusIcon } from '@/icons';

interface AccessCodesOverviewProps {
  total: number;
  active: number;
  used: number;
}

export function AccessCodesOverview({ total, active, used }: AccessCodesOverviewProps) {
  const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;
  const usedPercent = total > 0 ? Math.round((used / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50">
              <LockIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white">
                Access Code Utilization
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Invitation codes lifecycle & availability
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-3.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 flex overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${activePercent}%` }}
              title={`Active: ${active} (${activePercent}%)`}
            />
            <div
              className="h-full bg-purple-500 transition-all duration-500"
              style={{ width: `${usedPercent}%` }}
              title={`Used: ${used} (${usedPercent}%)`}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500 inline-block" />
              Active Available ({active})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500 inline-block" />
              Consumed / Used ({used})
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mt-5 text-center">
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400">Total Issued</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{total}</p>
          </div>
          <div className="p-3 rounded-xl bg-green-50/50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30">
            <p className="text-xs text-green-600 dark:text-green-400">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-0.5">{active}</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
            <p className="text-xs text-purple-600 dark:text-purple-400">Used</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-0.5">{used}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <span className="text-xs text-gray-500">Need more invitation codes?</span>
        <Link
          href="/access-codes"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-sm"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Generate Codes
        </Link>
      </div>
    </div>
  );
}

export default AccessCodesOverview;