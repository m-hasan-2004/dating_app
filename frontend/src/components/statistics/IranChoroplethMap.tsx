'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { toPersianDigits } from '@/utils/formatters';

export interface ProvinceMapItem {
  id: string;
  nameFa: string;
  nameEn: string;
  aliases: string[];
  // SVG coordinates / approximate polygon or center
  x: number;
  y: number;
  width?: number;
  height?: number;
  d: string;
}

// Full 31 Provinces of Iran with geographical SVG boundary paths (viewBox: 0 0 1000 900)
export const IRAN_PROVINCES: ProvinceMapItem[] = [
  {
    id: 'ardabil',
    nameFa: 'اردبیل',
    nameEn: 'Ardabil',
    aliases: ['اردبیل', 'ardabil', 'ardebil'],
    x: 290,
    y: 110,
    d: 'M 270,75 L 305,80 L 320,115 L 310,165 L 285,170 L 265,140 L 260,100 Z',
  },
  {
    id: 'east_azerbaijan',
    nameFa: 'آذربایجان شرقی',
    nameEn: 'East Azerbaijan',
    aliases: ['آذربایجان شرقی', 'تبریز', 'east azerbaijan', 'tabriz'],
    x: 215,
    y: 115,
    d: 'M 200,60 L 260,70 L 265,130 L 250,175 L 210,185 L 185,150 L 175,90 Z',
  },
  {
    id: 'west_azerbaijan',
    nameFa: 'آذربایجان غربی',
    nameEn: 'West Azerbaijan',
    aliases: ['آذربایجان غربی', 'ارومیه', 'west azerbaijan', 'urmia'],
    x: 135,
    y: 120,
    d: 'M 140,40 L 175,70 L 180,140 L 195,190 L 170,250 L 135,245 L 120,170 L 125,90 Z',
  },
  {
    id: 'zanjan',
    nameFa: 'زنجان',
    nameEn: 'Zanjan',
    aliases: ['زنجان', 'zanjan'],
    x: 275,
    y: 205,
    d: 'M 255,175 L 300,165 L 315,195 L 305,245 L 265,245 L 245,210 Z',
  },
  {
    id: 'gilan',
    nameFa: 'گیلان',
    nameEn: 'Gilan',
    aliases: ['گیلان', 'رشت', 'gilan', 'rasht'],
    x: 340,
    y: 160,
    d: 'M 315,120 L 365,130 L 390,175 L 360,195 L 320,185 L 305,150 Z',
  },
  {
    id: 'mazandaran',
    nameFa: 'مازندران',
    nameEn: 'Mazandaran',
    aliases: ['مازندران', 'ساری', 'بابل', 'mazandaran', 'sari'],
    x: 435,
    y: 205,
    d: 'M 390,175 L 485,185 L 515,220 L 465,235 L 405,225 L 375,200 Z',
  },
  {
    id: 'golestan',
    nameFa: 'گلستان',
    nameEn: 'Golestan',
    aliases: ['گلستان', 'گرگان', 'golestan', 'gorgan'],
    x: 540,
    y: 185,
    d: 'M 495,175 L 575,170 L 595,210 L 555,235 L 505,225 Z',
  },
  {
    id: 'north_khorasan',
    nameFa: 'خراسان شمالی',
    nameEn: 'North Khorasan',
    aliases: ['خراسان شمالی', 'بجنورد', 'north khorasan', 'bojnourd'],
    x: 650,
    y: 195,
    d: 'M 595,170 L 685,160 L 705,210 L 675,245 L 610,235 L 590,205 Z',
  },
  {
    id: 'razavi_khorasan',
    nameFa: 'خراسان رضوی',
    nameEn: 'Razavi Khorasan',
    aliases: ['خراسان رضوی', 'مشهد', 'razavi khorasan', 'mashhad', 'khorasan'],
    x: 745,
    y: 290,
    d: 'M 685,190 L 795,215 L 835,310 L 800,410 L 725,415 L 700,325 L 675,255 Z',
  },
  {
    id: 'south_khorasan',
    nameFa: 'خراسان جنوبی',
    nameEn: 'South Khorasan',
    aliases: ['خراسان جنوبی', 'بیرجند', 'south khorasan', 'birjand'],
    x: 755,
    y: 475,
    d: 'M 725,415 L 805,410 L 845,510 L 795,600 L 710,580 L 690,480 Z',
  },
  {
    id: 'semnan',
    nameFa: 'سمنان',
    nameEn: 'Semnan',
    aliases: ['سمنان', 'شاهرود', 'semnan', 'shahroud'],
    x: 535,
    y: 285,
    d: 'M 465,235 L 565,230 L 665,245 L 675,340 L 575,385 L 475,330 L 455,270 Z',
  },
  {
    id: 'tehran',
    nameFa: 'تهران',
    nameEn: 'Tehran',
    aliases: ['تهران', 'tehran'],
    x: 415,
    y: 260,
    d: 'M 390,230 L 445,230 L 460,270 L 425,295 L 385,280 L 380,250 Z',
  },
  {
    id: 'alborz',
    nameFa: 'البرز',
    nameEn: 'Alborz',
    aliases: ['البرز', 'کرج', 'alborz', 'karaj'],
    x: 365,
    y: 245,
    d: 'M 350,225 L 385,225 L 385,260 L 350,265 Z',
  },
  {
    id: 'qazvin',
    nameFa: 'قزوین',
    nameEn: 'Qazvin',
    aliases: ['قزوین', 'qazvin'],
    x: 325,
    y: 240,
    d: 'M 305,215 L 350,220 L 355,270 L 310,270 Z',
  },
  {
    id: 'qom',
    nameFa: 'قم',
    nameEn: 'Qom',
    aliases: ['قم', 'qom'],
    x: 410,
    y: 330,
    d: 'M 385,295 L 435,290 L 450,345 L 400,365 L 380,335 Z',
  },
  {
    id: 'markazi',
    nameFa: 'مرکزی',
    nameEn: 'Markazi',
    aliases: ['مرکزی', 'اراک', 'ساوه', 'markazi', 'arak'],
    x: 335,
    y: 340,
    d: 'M 305,285 L 380,285 L 385,360 L 340,395 L 295,355 Z',
  },
  {
    id: 'hamadan',
    nameFa: 'همدان',
    nameEn: 'Hamadan',
    aliases: ['همدان', 'hamadan', 'hamedan'],
    x: 265,
    y: 305,
    d: 'M 245,265 L 295,260 L 305,335 L 255,345 L 235,305 Z',
  },
  {
    id: 'kurdistan',
    nameFa: 'کردستان',
    nameEn: 'Kurdistan',
    aliases: ['کردستان', 'سنندج', 'kurdistan', 'sanandaj'],
    x: 195,
    y: 260,
    d: 'M 165,220 L 235,210 L 245,285 L 195,305 L 160,270 Z',
  },
  {
    id: 'kermanshah',
    nameFa: 'کرمانشاه',
    nameEn: 'Kermanshah',
    aliases: ['کرمانشاه', 'kermanshah'],
    x: 185,
    y: 345,
    d: 'M 155,295 L 225,290 L 235,370 L 180,395 L 140,360 Z',
  },
  {
    id: 'ilam',
    nameFa: 'ایلام',
    nameEn: 'Ilam',
    aliases: ['ایلام', 'ilam'],
    x: 165,
    y: 430,
    d: 'M 135,375 L 195,380 L 205,475 L 165,495 L 125,435 Z',
  },
  {
    id: 'lorestan',
    nameFa: 'لرستان',
    nameEn: 'Lorestan',
    aliases: ['لرستان', 'خرم آباد', 'خرم‌آباد', 'بروجرد', 'lorestan', 'khorramabad'],
    x: 260,
    y: 400,
    d: 'M 215,355 L 290,350 L 300,435 L 235,465 L 205,420 Z',
  },
  {
    id: 'isfahan',
    nameFa: 'اصفهان',
    nameEn: 'Isfahan',
    aliases: ['اصفهان', 'کاشان', 'نجف آباد', 'isfahan', 'esfahan', 'kashan'],
    x: 430,
    y: 440,
    d: 'M 375,365 L 485,345 L 535,445 L 495,540 L 415,545 L 360,490 L 355,420 Z',
  },
  {
    id: 'chaharmahal',
    nameFa: 'چهارمحال و بختیاری',
    nameEn: 'Chaharmahal and Bakhtiari',
    aliases: ['چهارمحال و بختیاری', 'شهرکرد', 'chaharmahal', 'chahar mahal', 'shahrekord'],
    x: 340,
    y: 495,
    d: 'M 315,465 L 360,460 L 365,530 L 320,535 Z',
  },
  {
    id: 'kohgiluyeh',
    nameFa: 'کهگیلویه و بویراحمد',
    nameEn: 'Kohgiluyeh and Boyer-Ahmad',
    aliases: ['کهگیلویه و بویراحمد', 'یاسوج', 'kohgiluyeh', 'yasuj'],
    x: 375,
    y: 575,
    d: 'M 345,535 L 405,535 L 405,620 L 355,615 Z',
  },
  {
    id: 'khuzestan',
    nameFa: 'خوزستان',
    nameEn: 'Khuzestan',
    aliases: ['خوزستان', 'اهواز', 'دزفول', 'آبادان', 'khuzestan', 'ahvaz'],
    x: 260,
    y: 535,
    d: 'M 195,475 L 310,455 L 345,550 L 330,640 L 255,645 L 180,560 Z',
  },
  {
    id: 'bushehr',
    nameFa: 'بوشهر',
    nameEn: 'Bushehr',
    aliases: ['بوشهر', 'bushehr', 'boushehr'],
    x: 370,
    y: 690,
    d: 'M 325,620 L 375,615 L 435,745 L 400,795 L 340,735 Z',
  },
  {
    id: 'fars',
    nameFa: 'فارس',
    nameEn: 'Fars',
    aliases: ['فارس', 'شیراز', 'fars', 'shiraz'],
    x: 485,
    y: 630,
    d: 'M 415,545 L 525,540 L 565,655 L 505,755 L 425,740 L 395,645 Z',
  },
  {
    id: 'yazd',
    nameFa: 'یزد',
    nameEn: 'Yazd',
    aliases: ['یزد', 'میبد', 'اردکان', 'yazd'],
    x: 585,
    y: 475,
    d: 'M 515,385 L 655,395 L 685,495 L 615,570 L 525,540 Z',
  },
  {
    id: 'kerman',
    nameFa: 'کرمان',
    nameEn: 'Kerman',
    aliases: ['کرمان', 'رفسنجان', 'سیرجان', 'kerman'],
    x: 695,
    y: 635,
    d: 'M 605,565 L 755,545 L 815,675 L 735,775 L 625,750 L 585,650 Z',
  },
  {
    id: 'hormozgan',
    nameFa: 'هرمزگان',
    nameEn: 'Hormozgan',
    aliases: ['هرمزگان', 'بندرعباس', 'کیش', 'قشم', 'hormozgan', 'bandar abbas'],
    x: 605,
    y: 810,
    d: 'M 435,755 L 585,745 L 725,775 L 745,845 L 595,875 L 475,815 Z',
  },
  {
    id: 'sistan_baluchestan',
    nameFa: 'سیستان و بلوچستان',
    nameEn: 'Sistan and Baluchestan',
    aliases: ['سیستان و بلوچستان', 'زاهدان', 'چابهار', 'sistan and baluchestan', 'zahedan', 'chabahar'],
    x: 875,
    y: 685,
    d: 'M 795,525 L 885,505 L 945,615 L 955,835 L 845,860 L 765,770 L 805,650 Z',
  },
];

interface IranChoroplethMapProps {
  locationBreakdown: Record<string, number>;
  totalCandidates: number;
}

export default function IranChoroplethMap({
  locationBreakdown,
  totalCandidates,
}: IranChoroplethMapProps) {
  const { t, isRTL } = useTranslation();
  const [hoveredProvince, setHoveredProvince] = useState<ProvinceMapItem | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Calculate count for each province by matching locationBreakdown keys
  const provinceStats = React.useMemo(() => {
    const rawBreakdown = locationBreakdown || {};
    const total = totalCandidates > 0 ? totalCandidates : (Object.values(rawBreakdown).reduce((a, b) => a + b, 0) || 1);

    const mapped = IRAN_PROVINCES.map((prov) => {
      let count = 0;
      Object.entries(rawBreakdown).forEach(([key, val]) => {
        const cleanKey = key.toLowerCase().trim();
        const matches = prov.aliases.some((alias) => {
          const cleanAlias = alias.toLowerCase().trim();
          return cleanKey.includes(cleanAlias) || cleanAlias.includes(cleanKey);
        });
        if (matches) {
          count += val;
        }
      });
      const percent = total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0;
      return {
        ...prov,
        count,
        percent,
      };
    });

    const maxCount = Math.max(...mapped.map((p) => p.count), 1);
    const sorted = [...mapped].sort((a, b) => b.count - a.count);
    const top5 = sorted.slice(0, 5);

    return {
      list: mapped,
      maxCount,
      top5,
      total,
    };
  }, [locationBreakdown, totalCandidates]);

  // Color intensity scale based on candidate share
  const getProvinceFill = (count: number) => {
    if (count === 0) return 'rgba(226, 232, 240, 0.55)'; // light slate
    const ratio = count / provinceStats.maxCount;
    if (ratio < 0.15) return '#93c5fd'; // blue-300
    if (ratio < 0.35) return '#60a5fa'; // blue-400
    if (ratio < 0.65) return '#3b82f6'; // blue-500
    if (ratio < 0.85) return '#2563eb'; // blue-600
    return '#1d4ed8'; // blue-700
  };

  const activeHoverData = hoveredProvince
    ? provinceStats.list.find((p) => p.id === hoveredProvince.id)
    : null;

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-gray-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-lg">🗺️</span>
            {isRTL ? "توزیع کاندیداها و اعضا بر اساس استان‌های کشور" : "Candidate Distribution by Iran Provinces"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
            {isRTL
              ? "نقشه تعاملی توزیع اعضا در ۳۱ استان ایران همراه با نمایش درصد و تعداد در حالت هاور"
              : "Interactive choropleth map of Iran's 31 provinces showing member volume and percentages."}
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 self-start sm:self-auto border border-blue-200 dark:border-blue-800">
          {isRTL ? `${toPersianDigits(31)} استان کشور` : "31 Provinces of Iran"}
        </span>
      </div>

      {/* Map Graphic Container */}
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50/70 to-blue-50/30 dark:from-gray-900/40 dark:to-blue-950/10 border border-slate-200/60 dark:border-gray-800 p-2 sm:p-6 flex items-center justify-center min-h-[420px]"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        }}
      >
        <svg
          viewBox="100 20 880 870"
          className="w-full h-auto max-h-[520px] select-none filter drop-shadow-sm"
        >
          {/* Subtle Caspian Sea Outline in North */}
          <path
            d="M 280,35 Q 380,105 580,95 L 590,140 L 270,80 Z"
            fill="rgba(56, 189, 248, 0.12)"
            stroke="rgba(56, 189, 248, 0.25)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* Persian Gulf & Sea of Oman in South */}
          <path
            d="M 330,640 Q 420,770 590,830 Q 750,860 880,880 L 890,920 L 300,920 Z"
            fill="rgba(56, 189, 248, 0.1)"
            stroke="rgba(56, 189, 248, 0.2)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* Province Polygons */}
          {provinceStats.list.map((prov) => {
            const isHovered = hoveredProvince?.id === prov.id;
            const fill = getProvinceFill(prov.count);

            return (
              <g
                key={prov.id}
                onMouseEnter={() => setHoveredProvince(prov)}
                onMouseLeave={() => setHoveredProvince(null)}
                className="cursor-pointer transition-all duration-200"
              >
                <path
                  d={prov.d}
                  fill={isHovered ? '#f59e0b' : fill}
                  stroke={isHovered ? '#b45309' : '#ffffff'}
                  strokeWidth={isHovered ? '2.5' : '1.2'}
                  strokeLinejoin="round"
                  className="transition-colors duration-200 hover:brightness-110"
                />

                {/* Province Center Pin & Label */}
                <circle
                  cx={prov.x}
                  cy={prov.y}
                  r={isHovered ? '5' : '3.5'}
                  fill={isHovered ? '#ffffff' : prov.count > 0 ? '#1e3a8a' : '#64748b'}
                  stroke={isHovered ? '#b45309' : '#ffffff'}
                  strokeWidth="1.2"
                />

                <text
                  x={prov.x}
                  y={prov.y + 14}
                  textAnchor="middle"
                  className={`text-[10px] font-bold pointer-events-none transition-all ${
                    isHovered
                      ? 'fill-amber-900 dark:fill-amber-200 font-extrabold text-[12px]'
                      : prov.count > 0
                      ? 'fill-slate-900 dark:fill-white'
                      : 'fill-slate-500 dark:fill-slate-400'
                  }`}
                  style={{
                    textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 0 4px rgba(255,255,255,0.6)',
                  }}
                >
                  {isRTL ? prov.nameFa : prov.nameEn}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {activeHoverData && (
          <div
            className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2.5 rounded-2xl bg-slate-900/95 text-white shadow-xl backdrop-blur-md border border-slate-700/80 text-xs transition-transform duration-75"
            style={{
              left: `${Math.min(Math.max(mousePos.x, 80), 750)}px`,
              top: `${Math.max(mousePos.y - 12, 10)}px`,
            }}
          >
            <div className="font-bold text-sm text-amber-300 pb-1 mb-1 border-b border-slate-700 flex items-center justify-between gap-3">
              <span>{isRTL ? activeHoverData.nameFa : activeHoverData.nameEn}</span>
              <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-md bg-amber-400/20 text-amber-300">
                {isRTL ? toPersianDigits(activeHoverData.percent) : activeHoverData.percent}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 text-slate-300">
              <span>{isRTL ? "تعداد متقاضیان:" : "Candidate Count:"}</span>
              <span className="font-bold text-white">
                {isRTL ? toPersianDigits(activeHoverData.count) : activeHoverData.count} {isRTL ? "نفر" : "people"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Top 5 Highest Share Provinces Widget */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <span>🏆</span>
            {isRTL ? "۵ استان با بیشترین درصد و تراکم متقاضیان" : "Top 5 Provinces with Highest Candidate Share"}
          </h4>
          <span className="text-[11px] text-slate-400">
            {isRTL ? "محاسبه بر اساس کل کاندیداهای فعال" : "Calculated from all active candidates"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {provinceStats.top5.map((prov, index) => {
            const rankGradients = [
              'from-amber-500/15 to-amber-500/5 border-amber-300 dark:border-amber-700/70',
              'from-blue-500/15 to-blue-500/5 border-blue-300 dark:border-blue-700/70',
              'from-emerald-500/15 to-emerald-500/5 border-emerald-300 dark:border-emerald-700/70',
              'from-purple-500/15 to-purple-500/5 border-purple-300 dark:border-purple-700/70',
              'from-slate-500/15 to-slate-500/5 border-slate-300 dark:border-slate-700/70',
            ];
            const rankBadges = [
              'bg-amber-500 text-white',
              'bg-blue-500 text-white',
              'bg-emerald-500 text-white',
              'bg-purple-500 text-white',
              'bg-slate-500 text-white',
            ];

            return (
              <div
                key={prov.id}
                className={`p-4 rounded-2xl bg-gradient-to-b ${rankGradients[index] || rankGradients[4]} border shadow-2xs hover:scale-[1.02] transition-transform duration-200 cursor-pointer`}
                onMouseEnter={() => setHoveredProvince(prov)}
                onMouseLeave={() => setHoveredProvince(null)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${rankBadges[index]}`}>
                    {isRTL ? toPersianDigits(index + 1) : `#${index + 1}`}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white">
                    {isRTL ? toPersianDigits(prov.percent) : prov.percent}%
                  </span>
                </div>

                <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {isRTL ? prov.nameFa : prov.nameEn}
                </h5>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isRTL ? toPersianDigits(prov.count) : prov.count} {isRTL ? "کاندیدا" : "candidates"}
                </p>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-gray-700 mt-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(8, prov.percent))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
