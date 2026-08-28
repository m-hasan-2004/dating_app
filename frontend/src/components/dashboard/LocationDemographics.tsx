'use client';

import React, { useMemo } from 'react';

interface LocationDemographicsProps {
  locationBreakdown?: Record<string, number>;
}

const DEFAULT_LOCATIONS = [
  { name: 'Tehran (تهران)', count: 32, percentage: 38 },
  { name: 'Qom (قم)', count: 21, percentage: 25 },
  { name: 'Isfahan (اصفهان)', count: 12, percentage: 14 },
  { name: 'Fars / Shiraz (فارس)', count: 8, percentage: 9 },
  { name: 'Razavi Khorasan (خراسان رضوی)', count: 7, percentage: 8 },
  { name: 'Other Provinces (سایر استان‌ها)', count: 5, percentage: 6 },
];

export function LocationDemographics({ locationBreakdown }: LocationDemographicsProps) {
  const locations = useMemo(() => {
    if (!locationBreakdown || Object.keys(locationBreakdown).length === 0) {
      return DEFAULT_LOCATIONS;
    }
    const entries = Object.entries(locationBreakdown);
    const total = entries.reduce((acc, [, c]) => acc + c, 0);
    if (total === 0) return DEFAULT_LOCATIONS;

    return entries
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / total) * 100),
      }));
  }, [locationBreakdown]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-800 dark:text-white">
            Candidate Demographics by Location
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Regional distribution across provinces
          </p>
        </div>
        <span className="text-xs font-semibold text-brand-500 bg-brand-50 dark:bg-brand-950/40 px-2.5 py-1 rounded-full">
          Regional Stats
        </span>
      </div>

      <div className="space-y-3.5 mt-5">
        {locations.map((loc) => (
          <div key={loc.name}>
            <div className="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              <span>{loc.name}</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {loc.count} candidates ({loc.percentage}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(5, loc.percentage))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LocationDemographics;