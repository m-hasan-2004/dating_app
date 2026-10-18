'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import type { UserStats } from '@/services/profileService';
import { fetchUserStats } from '@/services/profileService';
import Link from 'next/link';
import {
  GroupIcon,
  PieChartIcon,
  UserCircleIcon,
  CheckCircleIcon,
  LockIcon,
  ChevronLeftIcon,
} from '@/icons';

import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { toPersianDigits } from '@/utils/formatters';
import IranChoroplethMap from '@/components/statistics/IranChoroplethMap';

type GenderFilter = 'all' | 'man' | 'woman';

export default function StatisticsPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const isAdmin = Boolean(user?.is_staff || (user as any)?.is_superuser);

  const [stats, setStats] = useState<UserStats | null>(null);
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace('/dashboard');
    }
  }, [authLoading, isAdmin, router]);

  const loadStats = useCallback(async (selectedGender: GenderFilter) => {
    setLoading(true);
    try {
      const params = selectedGender !== 'all' ? { gender: selectedGender } : undefined;
      const res = await fetchUserStats(params);
      setStats(res);
    } catch (e) {
      console.error('Failed to load full statistics', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadStats(genderFilter);
    }
  }, [genderFilter, loadStats, isAdmin]);

  // Pure Gender Ratio (Men vs Women only)
  const genderRatio = useMemo(() => {
    if (stats?.gender_ratio) {
      return stats.gender_ratio;
    }
    return {
      men_count: 0,
      women_count: 0,
      total_gender_count: 0,
      men_percentage: 0,
      women_percentage: 0,
    };
  }, [stats]);

  // Education breakdown for currently selected cohort
  const educationData = useMemo(() => {
    const raw = stats?.education_breakdown || {};
    const total = Object.values(raw).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(raw)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({
        name,
        count,
        percent: Math.round((count / total) * 100),
      }));
  }, [stats]);

  // Age breakdown for currently selected cohort
  const ageData = useMemo(() => {
    const raw = stats?.age_breakdown || {
      'Under 22': 0,
      '22 - 26': 0,
      '27 - 32': 0,
      '33 - 38': 0,
      '39 - 45': 0,
      '45+': 0,
    };
    const ageLabelFa: Record<string, string> = {
      'Under 22': 'زیر ۲۲',
      '22 - 26': '۲۲ تا ۲۶',
      '27 - 32': '۲۷ تا ۳۲',
      '33 - 38': '۳۳ تا ۳۸',
      '39 - 45': '۳۹ تا ۴۵',
      '45+': 'بیش از ۴۵',
    };
    const ageLabelEn: Record<string, string> = {
      'Under 22': 'Under 22',
      '22 - 26': '22 - 26',
      '27 - 32': '27 - 32',
      '33 - 38': '33 - 38',
      '39 - 45': '39 - 45',
      '45+': '45+',
    };
    const total = Object.values(raw).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(raw).map(([range, count]) => ({
      range,
      localizedRange: isRTL ? (ageLabelFa[range] || range) : (ageLabelEn[range] || range),
      count,
      percent: Math.round((count / total) * 100),
    }));
  }, [stats, isRTL]);

  // Income breakdown for currently selected cohort (guarantees all tiers including +100)
  const incomeData = useMemo(() => {
    const ALL_INCOME_KEYS = ['no_income', '-10', '10-20', '20-30', '30-40', '40-50', '50-100', '+100'];
    const labelMapFa: Record<string, string> = {
      no_income: 'بدون درآمد',
      '-10': 'زیر ۱۰ میلیون تومان',
      '10-20': '۱۰ تا ۲۰ میلیون تومان',
      '20-30': '۲۰ تا ۳۰ میلیون تومان',
      '30-40': '۳۰ تا ۴۰ میلیون تومان',
      '40-50': '۴۰ تا ۵۰ میلیون تومان',
      '50-100': '۵۰ تا ۱۰۰ میلیون تومان',
      '+100': 'بیش از ۱۰۰ میلیون تومان',
    };
    const labelMapEn: Record<string, string> = {
      no_income: 'No Income',
      '-10': 'Under 10M',
      '10-20': '10 - 20M',
      '20-30': '20 - 30M',
      '30-40': '30 - 40M',
      '40-50': '40 - 50M',
      '50-100': '50 - 100M',
      '+100': 'Over 100M',
    };
    const raw = stats?.income_breakdown || {};
    const countsMap: Record<string, number> = {};
    ALL_INCOME_KEYS.forEach((k) => {
      countsMap[k] = raw[k] || 0;
    });
    Object.keys(raw).forEach((k) => {
      if (countsMap[k] === undefined) countsMap[k] = raw[k];
    });

    const total = Object.values(countsMap).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(countsMap)
      .map(([key, count]) => ({
        key,
        label: isRTL ? (labelMapFa[key] || key) : (labelMapEn[key] || key),
        count,
        percent: Math.round((count / total) * 100),
      }));
  }, [stats, isRTL]);

  // Housing breakdown for currently selected cohort
  const housingData = useMemo(() => {
    const raw = stats?.housing_breakdown || { owner: 0, rent: 0 };
    const owner = raw.owner || 0;
    const rent = raw.rent || 0;
    const total = owner + rent || 1;
    return {
      owner,
      rent,
      ownerPercent: Math.round((owner / total) * 100),
      rentPercent: Math.round((rent / total) * 100),
    };
  }, [stats]);

  const cohortLabel =
    genderFilter === 'all'
      ? t('All Candidates')
      : genderFilter === 'man'
      ? t('Men / Boys Only')
      : t('Women / Girls Only');

  if (!isAdmin && !authLoading) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-12 text-center dark:border-red-900/50 dark:bg-red-950/20">
        <h2 className="text-lg font-bold text-red-700 dark:text-red-400">{t("Admin Access Only")}</h2>
        <p className="text-xs text-red-600 dark:text-red-500 mt-1">{t("You do not have permission to view demographic statistics.")}</p>
        <Link href="/dashboard" className="inline-block mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-brand-500 text-white">{t("Return to Dashboard")}</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <ChevronLeftIcon className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
              {t("Dashboard")}
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t("Demographic & Platform Statistics")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("Interactive breakdown of candidates by gender, age, income, education, and asset ownership.")}
          </p>
        </div>

        {/* Global Demographic Cohort Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setGenderFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              genderFilter === 'all'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {t("All Candidates")}
          </button>
          <button
            type="button"
            onClick={() => setGenderFilter('man')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              genderFilter === 'man'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            {t("Men / Boys")}
          </button>
          <button
            type="button"
            onClick={() => setGenderFilter('woman')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              genderFilter === 'woman'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400'
            }`}
          >
            {t("Women / Girls")}
          </button>
        </div>
      </div>

      {/* Demographic Filter Alert Indicator */}
      {genderFilter !== 'all' && (
        <div className="rounded-xl px-4 py-2.5 bg-brand-50/70 border border-brand-200 dark:bg-brand-950/30 dark:border-brand-900/50 flex items-center justify-between text-xs text-brand-700 dark:text-brand-300">
          <span>
            {t("Filtering charts and data specifically for:")} <strong>{cohortLabel}</strong> ({isRTL ? toPersianDigits(stats?.cohort_count ?? 0) : (stats?.cohort_count ?? 0)} {t("profiles")})
          </span>
          <button
            type="button"
            onClick={() => setGenderFilter('all')}
            className="font-semibold underline hover:no-underline cursor-pointer"
          >
            {t("Reset to All")}
          </button>
        </div>
      )}

      {/* Row 1: Pure Gender Ratio Card (Men vs Women Only) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t("Gender Distribution Ratio")}
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              {t("Exact ratio of registered Men / Boys vs. Women / Girls")}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] dark:bg-brand-950/40">
            {t("Pure Ratio")} (100%)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
          {/* Men Card */}
          <div
            onClick={() => setGenderFilter('man')}
            className={`p-4 rounded-xl border text-center cursor-pointer transition-all ${
              genderFilter === 'man'
                ? 'bg-blue-50/90 dark:bg-blue-950/50 border-blue-400 dark:border-blue-600 ring-2 ring-blue-500/20'
                : 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/40 hover:bg-blue-50 dark:hover:bg-blue-950/40'
            }`}
          >
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {t("Men / Boys")}
            </p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">
              {genderRatio.men_count}
            </p>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
              {genderRatio.men_percentage}%
            </p>
            <span className="text-[11px] text-blue-500 hover:underline mt-1 inline-block">{t("Click to filter by Men")}</span>
          </div>

          {/* Women Card */}
          <div
            onClick={() => setGenderFilter('woman')}
            className={`p-4 rounded-xl border text-center cursor-pointer transition-all ${
              genderFilter === 'woman'
                ? 'bg-pink-50/90 dark:bg-pink-950/50 border-pink-400 dark:border-pink-600 ring-2 ring-pink-500/20'
                : 'bg-pink-50/40 dark:bg-pink-950/20 border-pink-100 dark:border-pink-900/40 hover:bg-pink-50 dark:hover:bg-pink-950/40'
            }`}
          >
            <p className="text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
              {t("Women / Girls")}
            </p>
            <p className="text-2xl font-bold text-pink-700 dark:text-pink-300 mt-1">
              {genderRatio.women_count}
            </p>
            <p className="text-sm font-semibold text-pink-600 dark:text-pink-400 mt-0.5">
              {genderRatio.women_percentage}%
            </p>
            <span className="text-[11px] text-pink-500 hover:underline mt-1 inline-block">{t("Click to filter by Women")}</span>
          </div>

          {/* Total Ratio Pool */}
          <div
            onClick={() => setGenderFilter('all')}
            className={`p-4 rounded-xl border text-center cursor-pointer transition-all ${
              genderFilter === 'all'
                ? 'bg-purple-50/90 dark:bg-purple-950/50 border-purple-400 dark:border-purple-600 ring-2 ring-purple-500/20'
                : 'bg-purple-50/40 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/40 hover:bg-purple-50 dark:hover:bg-purple-950/40'
            }`}
          >
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              {t("Total Gender Pool")}
            </p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-1">
              {genderRatio.total_gender_count}
            </p>
            <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
              100%
            </p>
            <span className="text-[11px] text-purple-500 hover:underline mt-1 inline-block">{t("Click to view all")}</span>
          </div>
        </div>

        {/* Proportional 2-Color Ratio Meter (Men vs Women Only) */}
        <div className="mt-5">
          <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-gray-800 flex overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-500"
              style={{ width: `${genderRatio.men_percentage}%` }}
              title={`${t("Men")}: ${genderRatio.men_percentage}%`}
            />
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500"
              style={{ width: `${genderRatio.women_percentage}%` }}
              title={`${t("Women")}: ${genderRatio.women_percentage}%`}
            />
          </div>
          <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-gray-300 mt-2.5">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500" /> {t("Men / Boys")} ({genderRatio.men_percentage}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500" /> {t("Women / Girls")} ({genderRatio.women_percentage}%)
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Age Cohorts + Housing Assets Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Age Cohorts Bar Chart */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t("Age Distribution")} — {cohortLabel}
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                {t("Candidate age cohorts based on verified birth dates")}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] dark:bg-brand-950/40">
              {t("Age Brackets")}
            </span>
          </div>

          <div className="space-y-4">
            {ageData.map((item) => (
              <div key={item.range}>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-gray-300 mb-1">
                  <span>{item.localizedRange} {t("Years Old")}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {isRTL ? toPersianDigits(item.count) : item.count} {t("profiles")} ({isRTL ? toPersianDigits(item.percent) : item.percent}%)
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(3, item.percent))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Housing Ownership Donut */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs flex flex-col justify-between">

          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-800 dark:text-white">
                  {t("Housing Status")} — {cohortLabel}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("Real-estate status (Owner vs. Tenant)")}
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-600 dark:bg-green-950/40">
                {t("Assets & Capital")}
              </span>
            </div>

            <div className="flex items-center justify-center py-6">
              <div className="relative flex items-center justify-center w-36 h-36 rounded-full border-8 border-green-500 dark:border-green-600">
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {housingData.ownerPercent}%
                  </span>
                  <span className="block text-[11px] text-gray-500 uppercase">{t("Homeowner")}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> {t("Homeowner")}
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {housingData.owner} {t("candidates")} ({housingData.ownerPercent}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> {t("Tenant / Rent")}
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {housingData.rent} {t("candidates")} ({housingData.rentPercent}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Academic Qualifications */}
      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t("Education Qualifications")} — {cohortLabel}
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              {t("Highest academic and seminary degrees among all candidates")}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40">
            {t("Education Level")}
          </span>
        </div>

        <div className="space-y-3.5">
          {educationData.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4">{t("No education records found for this cohort.")}</p>
          ) : (
            educationData.map((edu) => (
              <div key={edu.name}>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-gray-300 mb-1">
                  <span>{t(edu.name)}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {edu.count} ({edu.percent}%)
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(3, edu.percent))}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Row 4: Income & Financial Brackets */}
      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t("Income & Financial Brackets")} — {cohortLabel}
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              {t("Monthly income distribution declared by all candidates")}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
            {t("Monthly Income")}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {incomeData.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4 col-span-3">{t("No income data for this cohort.")}</p>
          ) : (
            incomeData.map((inc) => (
              <div
                key={inc.key}
                className="p-4 rounded-xl bg-slate-50/80 dark:bg-gray-800/40 border border-slate-200/80 dark:border-gray-800/60 shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700 dark:text-gray-300">{inc.label}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {isRTL ? toPersianDigits(inc.percent) : inc.percent}%
                  </span>
                </div>
                <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {isRTL ? toPersianDigits(inc.count) : inc.count}{' '}
                  <span className="text-xs font-normal text-slate-400">{t("candidates")}</span>
                </p>
                <div className="h-1.5 w-full rounded-full bg-slate-200/80 dark:bg-gray-700 mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${Math.min(100, Math.max(4, inc.percent))}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Row 5: Province Distribution Map (Iran Choropleth Map & Top 5) */}
      <IranChoroplethMap
        locationBreakdown={stats?.location_breakdown || {}}
        totalCandidates={stats?.cohort_count || stats?.total_users || 0}
      />

    </div>
  );
}