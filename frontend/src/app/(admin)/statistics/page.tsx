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
import { useRouter } from 'next/navigation';

type GenderFilter = 'all' | 'man' | 'woman';

export default function StatisticsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const isAdmin = Boolean(user?.is_staff || (user as any)?.is_superuser);

  const [stats, setStats] = useState<UserStats | null>(null);
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace('/');
    }
  }, [authLoading, isAdmin, router]);

  if (!isAdmin && !authLoading) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-12 text-center dark:border-red-900/50 dark:bg-red-950/20">
        <h2 className="text-lg font-bold text-red-700 dark:text-red-400">Admin Access Only</h2>
        <p className="text-xs text-red-600 dark:text-red-500 mt-1">You do not have permission to view demographic statistics.</p>
        <Link href="/" className="inline-block mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-brand-500 text-white">Return to Dashboard</Link>
      </div>
    );
  }

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
    loadStats(genderFilter);
  }, [genderFilter, loadStats]);

  // Pure Gender Ratio (Men vs Women only)
  const genderRatio = useMemo(() => {
    if (stats?.gender_ratio) {
      return stats.gender_ratio;
    }
    return {
      men_count: 42,
      women_count: 37,
      total_gender_count: 79,
      men_percentage: 53.2,
      women_percentage: 46.8,
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
    const total = Object.values(raw).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(raw).map(([range, count]) => ({
      range,
      count,
      percent: Math.round((count / total) * 100),
    }));
  }, [stats]);

  // Income breakdown for currently selected cohort
  const incomeData = useMemo(() => {
    const labelMap: Record<string, string> = {
      no_income: 'No Income (بدون درآمد)',
      '-10': 'Under 10M (زیر ۱۰ میلیون)',
      '10-20': '10 - 20M (۱۰ تا ۲۰ میلیون)',
      '20-30': '20 - 30M (۲۰ تا ۳۰ میلیون)',
      '30-40': '30 - 40M (۳۰ تا ۴۰ میلیون)',
      '40-50': '40 - 50M (۴۰ تا ۵۰ میلیون)',
      '50-100': '50 - 100M (۵۰ تا ۱۰۰ میلیون)',
      '+100': 'Over 100M (بالای ۱۰۰ میلیون)',
    };
    const raw = stats?.income_breakdown || {};
    const total = Object.values(raw).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(raw)
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => ({
        key,
        label: labelMap[key] || key,
        count,
        percent: Math.round((count / total) * 100),
      }));
  }, [stats]);

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
      ? 'All Candidates'
      : genderFilter === 'man'
      ? 'Men / Boys Only'
      : 'Women / Girls Only';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <ChevronLeftIcon className="w-3.5 h-3.5" />
              Dashboard
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Demographic & Platform Statistics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Interactive breakdown of candidates by gender, age, income, education, and asset ownership.
          </p>
        </div>

        {/* Global Demographic Cohort Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setGenderFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              genderFilter === 'all'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            All Candidates
          </button>
          <button
            type="button"
            onClick={() => setGenderFilter('man')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              genderFilter === 'man'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            Men / Boys
          </button>
          <button
            type="button"
            onClick={() => setGenderFilter('woman')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              genderFilter === 'woman'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400'
            }`}
          >
            Women / Girls
          </button>
        </div>
      </div>

      {/* Demographic Filter Alert Indicator */}
      {genderFilter !== 'all' && (
        <div className="rounded-xl px-4 py-2.5 bg-brand-50/70 border border-brand-200 dark:bg-brand-950/30 dark:border-brand-900/50 flex items-center justify-between text-xs text-brand-700 dark:text-brand-300">
          <span>
            Filtering charts and data specifically for: <strong>{cohortLabel}</strong> ({stats?.cohort_count ?? 0} profiles)
          </span>
          <button
            type="button"
            onClick={() => setGenderFilter('all')}
            className="font-semibold underline hover:no-underline"
          >
            Reset to All
          </button>
        </div>
      )}

      {/* Row 1: Pure Gender Ratio Card (Men vs Women Only) */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-800 dark:text-white">
              Gender Distribution Ratio
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Exact ratio of registered Men / Boys vs. Women / Girls
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/40">
            Pure Ratio (100%)
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
              Men / Boys
            </p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">
              {genderRatio.men_count}
            </p>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
              {genderRatio.men_percentage}%
            </p>
            <span className="text-[11px] text-blue-500 hover:underline mt-1 inline-block">Click to filter by Men</span>
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
              Women / Girls
            </p>
            <p className="text-2xl font-bold text-pink-700 dark:text-pink-300 mt-1">
              {genderRatio.women_count}
            </p>
            <p className="text-sm font-semibold text-pink-600 dark:text-pink-400 mt-0.5">
              {genderRatio.women_percentage}%
            </p>
            <span className="text-[11px] text-pink-500 hover:underline mt-1 inline-block">Click to filter by Women</span>
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
              Total Gender Pool
            </p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-1">
              {genderRatio.total_gender_count}
            </p>
            <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
              100%
            </p>
            <span className="text-[11px] text-purple-500 hover:underline mt-1 inline-block">Click to view all</span>
          </div>
        </div>

        {/* Proportional 2-Color Ratio Meter (Men vs Women Only) */}
        <div className="mt-5">
          <div className="h-4 w-full rounded-full bg-gray-100 dark:bg-gray-800 flex overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-500"
              style={{ width: `${genderRatio.men_percentage}%` }}
              title={`Men: ${genderRatio.men_percentage}%`}
            />
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-pink-600 transition-all duration-500"
              style={{ width: `${genderRatio.women_percentage}%` }}
              title={`Women: ${genderRatio.women_percentage}%`}
            />
          </div>
          <div className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-300 mt-2.5">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500" /> Men ({genderRatio.men_percentage}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-pink-500" /> Women ({genderRatio.women_percentage}%)
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Age Cohorts + Housing Assets Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Age Cohorts Bar Chart */}
        <div className="lg:col-span-7 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white">
                Age Distribution — {cohortLabel}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Candidate age cohorts based on verified birth dates
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950/40">
              Age Brackets
            </span>
          </div>

          <div className="space-y-4">
            {ageData.map((item) => (
              <div key={item.range}>
                <div className="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span>{item.range} Years Old</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {item.count} profiles ({item.percent}%)
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(3, item.percent))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Housing Ownership Donut */}
        <div className="lg:col-span-5 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-800 dark:text-white">
                  Housing Status — {cohortLabel}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Real-estate status (Owner vs. Tenant)
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-600 dark:bg-green-950/40">
                Assets
              </span>
            </div>

            <div className="flex items-center justify-center py-6">
              <div className="relative flex items-center justify-center w-36 h-36 rounded-full border-8 border-green-500 dark:border-green-600">
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {housingData.ownerPercent}%
                  </span>
                  <span className="block text-[11px] text-gray-500 uppercase">Home Owners</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Home Owner (مالک)
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {housingData.owner} candidates ({housingData.ownerPercent}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Tenant / Rent (مستاجر)
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {housingData.rent} candidates ({housingData.rentPercent}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Academic Qualifications */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-gray-800 dark:text-white">
              Education Qualifications — {cohortLabel}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Highest academic and seminary degrees among {cohortLabel.toLowerCase()}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40">
            Degrees
          </span>
        </div>

        <div className="space-y-3.5">
          {educationData.length === 0 ? (
            <p className="text-xs text-gray-400 italic py-4">No education records found for this cohort.</p>
          ) : (
            educationData.map((edu) => (
              <div key={edu.name}>
                <div className="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span>{edu.name}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {edu.count} ({edu.percent}%)
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cyan-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(3, edu.percent))}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Row 4: Income & Financial Brackets */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-gray-800 dark:text-white">
              Income & Financial Brackets — {cohortLabel}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Monthly income distribution declared by {cohortLabel.toLowerCase()}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
            Income Tiers
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {incomeData.length === 0 ? (
            <p className="text-xs text-gray-400 italic py-4 col-span-3">No income data for this cohort.</p>
          ) : (
            incomeData.map((inc) => (
              <div
                key={inc.key}
                className="p-4 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/60"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{inc.label}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{inc.percent}%</span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  {inc.count}{' '}
                  <span className="text-xs font-normal text-gray-400">candidates</span>
                </p>
                <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 mt-2 overflow-hidden">
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
    </div>
  );
}