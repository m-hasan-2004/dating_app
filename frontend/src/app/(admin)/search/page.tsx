'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import {
  searchCandidates,
  toggleBookmark,
  type CandidateProfile,
  type CandidateSearchParams,
  type CandidateSearchResponse,
} from '@/services/profileService';
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UserCircleIcon,
  CheckCircleIcon,
  GridIcon,
  ListIcon,
} from '@/icons';

const LOCATION_OPTIONS = [
  { value: 'Tehran', label: 'Tehran (تهران)' },
  { value: 'Qom', label: 'Qom (قم)' },
  { value: 'Isfahan', label: 'Isfahan (اصفهان)' },
  { value: 'Mashhad', label: 'Mashhad (مشهد)' },
  { value: 'Karaj', label: 'Karaj (کرج)' },
  { value: 'Shiraz', label: 'Shiraz (شیراز)' },
  { value: 'Tabriz', label: 'Tabriz (تبریز)' },
  { value: 'Hamadan', label: 'Hamadan (همدان)' },
  { value: 'Yazd', label: 'Yazd (یزد)' },
  { value: 'Kerman', label: 'Kerman (کرمان)' },
  { value: 'Gilan', label: 'Gilan (گیلان / رشت)' },
  { value: 'Mazandaran', label: 'Mazandaran (مازندران / ساری)' },
  { value: 'Khuzestan', label: 'Khuzestan (خوزستان / اهواز)' },
  { value: 'Kermanshah', label: 'Kermanshah (کرمانشاه)' },
  { value: 'Markazi', label: 'Markazi (مرکزی / اراک)' },
  { value: 'Lorestan', label: 'Lorestan (لرستان / خرم‌آباد)' },
  { value: 'Golestan', label: 'Golestan (گلستان / گرگان)' },
  { value: 'Zanjan', label: 'Zanjan (زنجان)' },
  { value: 'Qazvin', label: 'Qazvin (قزوین)' },
  { value: 'Ardabil', label: 'Ardabil (اردبیل)' },
  { value: 'Semnan', label: 'Semnan (سمنان)' },
  { value: 'Bushehr', label: 'Bushehr (بوشهر)' },
  { value: 'Hormozgan', label: 'Hormozgan (هرمزگان / بندرعباس)' },
  { value: 'Kurdistan', label: 'Kurdistan (کردستان / سنندج)' },
  { value: 'Ilam', label: 'Ilam (ایلام)' },
  { value: 'North Khorasan', label: 'North Khorasan (خراسان شمالی / بجنورد)' },
  { value: 'South Khorasan', label: 'South Khorasan (خراسان جنوبی / بیرجند)' },
  { value: 'Chaharmahal and Bakhtiari', label: 'Chaharmahal (چهارمحال و بختیاری)' },
  { value: 'Sistan and Baluchestan', label: 'Sistan (سیستان و بلوچستان / زاهدان)' },
  { value: 'Kohgiluyeh and Boyer-Ahmad', label: 'Kohgiluyeh (کهگیلویه و بویراحمد)' },
];

const EDUCATION_OPTIONS = [
  { value: 'Ph.D.', label: 'Ph.D. (دکتری)' },
  { value: "Master's Degree", label: "Master's Degree (کارشناسی ارشد)" },
  { value: "Bachelor's Degree", label: "Bachelor's Degree (کارشناسی)" },
  { value: 'Associate Degree', label: 'Associate Degree (کاردانی / فوق دیپلم)' },
  { value: 'Diploma', label: 'Diploma (دیپلم)' },
  { value: 'Under Diploma', label: 'Under Diploma (زیر دیپلم)' },
  { value: 'Hoze (Islamic Seminary) LVL 4', label: 'Seminary Lvl 4 (سطح ۴ حوزه)' },
  { value: 'Hoze (Islamic Seminary) LVL 3', label: 'Seminary Lvl 3 (سطح ۳ حوزه)' },
  { value: 'Hoze (Islamic Seminary) LVL 2', label: 'Seminary Lvl 2 (سطح ۲ حوزه)' },
  { value: 'Hoze (Islamic Seminary) LVL 1', label: 'Seminary Lvl 1 (سطح ۱ حوزه)' },
  { value: 'School & Quranic', label: 'Quranic School (علوم قرآنی)' },
];

const MARITAL_OPTIONS = [
  { value: 'no', label: 'Never Married (مجرد بدون سابقه)' },
  { value: 'yes', label: 'Divorced / Has Experience (سابقه ازدواج / طلاق)' },
  { value: 'engagement_only', label: 'Engagement Only (فقط دوران عقد)' },
];

const INCOME_OPTIONS = [
  { value: 'no_income', label: 'No Income (بدون درآمد)' },
  { value: '-10', label: 'Under 10 Million (زیر ۱۰ میلیون)' },
  { value: '10-20', label: '10M to 20M (۱۰ تا ۲۰ میلیون)' },
  { value: '20-30', label: '20M to 30M (۲۰ تا ۳۰ میلیون)' },
  { value: '30-40', label: '30M to 40M (۳۰ تا ۴۰ میلیون)' },
  { value: '40-50', label: '40M to 50M (۴۰ تا ۵۰ میلیون)' },
  { value: '50-100', label: '50M to 100M (۵۰ تا ۱۰۰ میلیون)' },
  { value: '+100', label: 'Over 100 Million (بیش از ۱۰۰ میلیون)' },
];

const OWNERSHIP_OPTIONS = [
  { value: 'owner', label: 'Homeowner (مالک)' },
  { value: 'rent', label: 'Tenant / Rent (مستأجر)' },
];

const RESIDENCE_OPTIONS = [
  { value: 'fathers_house', label: "Father's House (منزل پدری)" },
  { value: 'mothers_house', label: "Mother's House (منزل مادری)" },
  { value: 'other', label: 'Independent / Other (مستقل / سایر)' },
];

const CAPITAL_OPTIONS = [
  { value: 'house', label: 'House (خانه / آپارتمان)' },
  { value: 'car', label: 'Car (خودرو)' },
  { value: 'shop', label: 'Commercial Shop (مغازه)' },
  { value: 'land', label: 'Land (زمین)' },
  { value: 'gold', label: 'Gold & Savings (طلا / پس‌انداز)' },
  { value: 'garden', label: 'Garden / Villa (باغ / ویلا)' },
  { value: 'company', label: 'Company / Business (شرکت)' },
  { value: 'motorcycle', label: 'Motorcycle (موتورسیکلت)' },
  { value: 'none', label: 'None (ندارم)' },
];

const DOWRY_OPTIONS = [
  { value: 'gold', label: 'Gold / Coins (طلا و سکه)' },
  { value: 'money', label: 'Cash / Money (وجه نقد)' },
  { value: 'house', label: 'Real Estate / House (ملک یا خانه)' },
  { value: 'mecca', label: 'Mecca Pilgrimage (سفر حج)' },
  { value: 'iraq', label: 'Karbala Pilgrimage (سفر کربلا)' },
  { value: 'agreement', label: 'Mutual Agreement (توافقی)' },
];

const WORSHIP_OPTIONS = [
  { value: 'fully_obligated', label: 'Fully Obligated (کاملاً مقید به نماز اول وقت)' },
  { value: 'sometimes', label: 'Sometimes (گاهی اوقات)' },
  { value: 'obligated_but_lazy', label: 'Obligated But Lazy (مقید اما با تأخیر)' },
  { value: 'not_obligated', label: 'Not Obligated (غیر مقید)' },
  { value: 'doesnt_matter', label: "Doesn't Matter (فرقی ندارد)" },
];

const FASTING_OPTIONS = [
  { value: 'fully_obligated', label: 'Fully Obligated (کاملاً مقید به روزه)' },
  { value: 'sometimes', label: 'Sometimes (گاهی)' },
  { value: 'sick', label: 'Medical Exemption (معذوریت پزشکی)' },
  { value: 'not_obligated', label: 'Not Obligated (غیر مقید)' },
];

const COVER_OPTIONS = [
  { value: 'always_chador', label: 'Always Chador (همیشه چادری)' },
  { value: 'sometimes_chador', label: 'Sometimes Chador (گاهی چادری)' },
  { value: 'always_coverd_manto', label: 'Covered Manto (مانتو پوشیده و محجبه)' },
  { value: 'sometimes_coverd_manto', label: 'Sometimes Covered Manto (مانتو معمولی)' },
  { value: 'always_free_manto', label: 'Free Manto (مانتو آزاد)' },
];

const VELAYAT_OPTIONS = [
  { value: 'agree', label: 'Agree / Believer (معتقد و ملتزم)' },
  { value: 'no_opinion', label: 'No Opinion (نظری ندارم)' },
];

const SKIN_OPTIONS = [
  { value: 'White', label: 'White / Very Bright (سفید / بسیار روشن)' },
  { value: 'Fair', label: 'Fair / Bright (روشن / گندمی روشن)' },
  { value: 'Wheat', label: 'Wheat (گندمی)' },
  { value: 'Olive', label: 'Olive / Greenish (سبزه)' },
  { value: 'Darken', label: 'Dark / Brown (سبزه تیره / گندمی تیره)' },
];

const PREF_EXP_OPTIONS = [
  { value: 'Never', label: 'Never Married Only (فقط مجرد بدون سابقه)' },
  { value: 'Divorced Virgin', label: 'Divorced Virgin (عقد جدا شده)' },
  { value: 'Divorced No Child', label: 'Divorced Without Children (طلاق بدون فرزند)' },
  { value: 'Divorced Have Boy', label: 'Divorced With Son (طلاق دارای فرزند پسر)' },
  { value: 'Divorced Have Girl', label: 'Divorced With Daughter (طلاق دارای فرزند دختر)' },
  { value: 'Spouse Died', label: 'Spouse Deceased (همسر فوت شده)' },
];

const AGE_PRESETS = [
  { label: '18-25', min: 18, max: 25 },
  { label: '25-30', min: 25, max: 30 },
  { label: '30-35', min: 30, max: 35 },
  { label: '35-40', min: 35, max: 40 },
  { label: '40-50', min: 40, max: 50 },
  { label: '50+', min: 50, max: 99 },
];

interface PillOption {
  value: string;
  label: string;
}

function FilterPillGroup({
  title,
  options,
  selected,
  onToggle,
  defaultExpanded = false,
}: {
  title: string;
  options: PillOption[];
  selected: string[];
  onToggle: (value: string) => void;
  defaultExpanded?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  return (
    <div className="border-b border-gray-100 dark:border-gray-800/80 py-3 last:border-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left text-xs font-bold text-gray-800 dark:text-white/90 hover:text-brand-500 transition-colors py-1 cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <span>{title}</span>
          {selected.length > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-brand-500 text-white">
              {selected.length}
            </span>
          )}
        </span>
        <span className="text-gray-400">
          {isOpen ? <ChevronUpIcon className="w-3.5 h-3.5" /> : <ChevronDownIcon className="w-3.5 h-3.5" />}
        </span>
      </button>

      {isOpen && (
        <div className="flex flex-wrap gap-1.5 pt-2.5 animate-fade-in">
          {options.map((opt) => {
            const isSelected = selected.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onToggle(opt.value)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-brand-500 text-white border-brand-500 shadow-xs'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-brand-300 dark:bg-white/[0.04] dark:border-gray-700/60 dark:text-gray-300 dark:hover:bg-white/[0.08]'
                }`}
              >
                {isSelected && <span className="font-bold text-[10px]">✓</span>}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TableSortIndicator({
  active,
  direction,
}: {
  active: boolean;
  direction: 'asc' | 'desc' | null;
}) {
  if (!active || !direction) {
    return (
      <span className="inline-flex flex-col text-[8px] text-gray-400 opacity-40 group-hover:opacity-100 leading-none">
        ▲▼
      </span>
    );
  }
  return (
    <span className="inline-flex text-[10px] text-brand-500 font-extrabold leading-none">
      {direction === 'asc' ? '▲' : '▼'}
    </span>
  );
}

type SortColumn = 'save' | 'candidate' | 'age_city' | 'education' | 'job' | 'height_weight' | null;
type SortDirection = 'asc' | 'desc' | null;

export default function CandidateSearchPage() {
  const { user } = useAuth();
  const isAdmin = Boolean(user?.is_staff || (user as any)?.is_superuser);

  const [genderFilter, setGenderFilter] = useState<'all' | 'man' | 'woman'>('all');
  const [keyword, setKeyword] = useState('');
  const [ordering, setOrdering] = useState('-date_joined');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);

  // Column table sorting
  const [tableSortCol, setTableSortCol] = useState<SortColumn>(null);
  const [tableSortDir, setTableSortDir] = useState<SortDirection>(null);

  const handleTableSort = (col: SortColumn) => {
    if (tableSortCol === col) {
      if (tableSortDir === 'asc') {
        setTableSortDir('desc');
      } else if (tableSortDir === 'desc') {
        setTableSortCol(null);
        setTableSortDir(null);
      } else {
        setTableSortDir('asc');
      }
    } else {
      setTableSortCol(col);
      setTableSortDir('asc');
    }
  };

  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [minHeight, setMinHeight] = useState('');
  const [maxHeight, setMaxHeight] = useState('');
  const [minWeight, setMinWeight] = useState('');
  const [maxWeight, setMaxWeight] = useState('');
  const [job, setJob] = useState('');

  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedEducations, setSelectedEducations] = useState<string[]>([]);
  const [selectedMaritals, setSelectedMaritals] = useState<string[]>([]);
  const [selectedIncomes, setSelectedIncomes] = useState<string[]>([]);
  const [selectedOwnerships, setSelectedOwnerships] = useState<string[]>([]);
  const [selectedResidences, setSelectedResidences] = useState<string[]>([]);
  const [selectedCapitals, setSelectedCapitals] = useState<string[]>([]);
  const [selectedDowries, setSelectedDowries] = useState<string[]>([]);
  const [selectedWorships, setSelectedWorships] = useState<string[]>([]);
  const [selectedFastings, setSelectedFastings] = useState<string[]>([]);
  const [selectedCovers, setSelectedCovers] = useState<string[]>([]);
  const [selectedVelayats, setSelectedVelayats] = useState<string[]>([]);
  const [selectedSkins, setSelectedSkins] = useState<string[]>([]);
  const [selectedPrefExps, setSelectedPrefExps] = useState<string[]>([]);

  const [data, setData] = useState<CandidateSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const displayedCandidates = useMemo(() => {
    if (!data?.results) return [];
    if (!tableSortCol || !tableSortDir) return data.results;

    return [...data.results].sort((a, b) => {
      let valA: any = '';
      let valB: any = '';

      if (tableSortCol === 'save') {
        valA = Boolean(a.is_bookmarked ?? a.isBookmarked) ? 1 : 0;
        valB = Boolean(b.is_bookmarked ?? b.isBookmarked) ? 1 : 0;
      } else if (tableSortCol === 'candidate') {
        valA = (a.username || '').toLowerCase();
        valB = (b.username || '').toLowerCase();
      } else if (tableSortCol === 'age_city') {
        valA = (a.age ?? 0) * 1000 + (a.birth_location || a.province || '').localeCompare('');
        valB = (b.age ?? 0) * 1000 + (b.birth_location || b.province || '').localeCompare('');
      } else if (tableSortCol === 'education') {
        valA = (a.education || a.educationLevel || a.degree || '').toLowerCase();
        valB = (b.education || b.educationLevel || b.degree || '').toLowerCase();
      } else if (tableSortCol === 'job') {
        valA = (a.job || '').toLowerCase();
        valB = (b.job || '').toLowerCase();
      } else if (tableSortCol === 'height_weight') {
        valA = (a.height || 0) * 1000 + (a.weight || 0);
        valB = (b.height || 0) * 1000 + (b.weight || 0);
      }

      if (valA < valB) return tableSortDir === 'asc' ? -1 : 1;
      if (valA > valB) return tableSortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data?.results, tableSortCol, tableSortDir]);

  const toggleArrayItem = (arr: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
    setPage(1);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (keyword.trim()) count++;
    if (minAge || maxAge) count++;
    if (minHeight || maxHeight) count++;
    if (minWeight || maxWeight) count++;
    if (job.trim()) count++;
    count += selectedLocations.length;
    count += selectedEducations.length;
    count += selectedMaritals.length;
    count += selectedIncomes.length;
    count += selectedOwnerships.length;
    count += selectedResidences.length;
    count += selectedCapitals.length;
    count += selectedDowries.length;
    count += selectedWorships.length;
    count += selectedFastings.length;
    count += selectedCovers.length;
    count += selectedVelayats.length;
    count += selectedSkins.length;
    count += selectedPrefExps.length;
    return count;
  }, [
    keyword, minAge, maxAge, minHeight, maxHeight, minWeight, maxWeight, job,
    selectedLocations, selectedEducations, selectedMaritals, selectedIncomes,
    selectedOwnerships, selectedResidences, selectedCapitals, selectedDowries,
    selectedWorships, selectedFastings, selectedCovers, selectedVelayats,
    selectedSkins, selectedPrefExps
  ]);

  const handleResetFilters = () => {
    setKeyword('');
    setMinAge('');
    setMaxAge('');
    setMinHeight('');
    setMaxHeight('');
    setMinWeight('');
    setMaxWeight('');
    setJob('');
    setSelectedLocations([]);
    setSelectedEducations([]);
    setSelectedMaritals([]);
    setSelectedIncomes([]);
    setSelectedOwnerships([]);
    setSelectedResidences([]);
    setSelectedCapitals([]);
    setSelectedDowries([]);
    setSelectedWorships([]);
    setSelectedFastings([]);
    setSelectedCovers([]);
    setSelectedVelayats([]);
    setSelectedSkins([]);
    setSelectedPrefExps([]);
    setPage(1);
  };

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: CandidateSearchParams = {
        page,
        page_size: pageSize,
        ordering,
      };

      if (keyword.trim()) params.keyword = keyword.trim();
      if (isAdmin && genderFilter !== 'all') params.gender = genderFilter;

      if (minAge) params.minAge = Number(minAge);
      if (maxAge) params.maxAge = Number(maxAge);
      if (minHeight) params.minHeight = Number(minHeight);
      if (maxHeight) params.maxHeight = Number(maxHeight);
      if (minWeight) params.minWeight = Number(minWeight);
      if (maxWeight) params.maxWeight = Number(maxWeight);
      if (job.trim()) params.job = job.trim();

      if (selectedLocations.length > 0) params.province = selectedLocations.join(',');
      if (selectedEducations.length > 0) params.educationLevel = selectedEducations.join(',');
      if (selectedMaritals.length > 0) params.maritalExperience = selectedMaritals.join(',');
      if (selectedIncomes.length > 0) params.incomeTier = selectedIncomes.join(',');
      if (selectedOwnerships.length > 0) params.housingOwnership = selectedOwnerships.join(',');
      if (selectedResidences.length > 0) params.residenceStatus = selectedResidences.join(',');
      if (selectedCapitals.length > 0) params.capital = selectedCapitals.join(',');
      if (selectedDowries.length > 0) params.dowry_type = selectedDowries.join(',');
      if (selectedWorships.length > 0) params.worship = selectedWorships.join(',');
      if (selectedFastings.length > 0) params.fasting = selectedFastings.join(',');
      if (selectedCovers.length > 0) params.societyCover = selectedCovers.join(',');
      if (selectedVelayats.length > 0) params.velayatFaqih = selectedVelayats.join(',');
      if (selectedSkins.length > 0) params.skinColor = selectedSkins.join(',');
      if (selectedPrefExps.length > 0) params.marriage_with_someone_with_marriage_experience = selectedPrefExps.join(',');

      const res = await searchCandidates(params);
      setData(res);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load candidates');
    } finally {
      setLoading(false);
    }
  }, [
    page, pageSize, ordering, keyword, isAdmin, genderFilter,
    minAge, maxAge, minHeight, maxHeight, minWeight, maxWeight, job,
    selectedLocations, selectedEducations, selectedMaritals, selectedIncomes,
    selectedOwnerships, selectedResidences, selectedCapitals, selectedDowries,
    selectedWorships, selectedFastings, selectedCovers, selectedVelayats,
    selectedSkins, selectedPrefExps,
  ]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleToggleBookmark = async (candidate: CandidateProfile) => {
    if (!data) return;
    const isCurrentlyBookmarked = Boolean(candidate.is_bookmarked ?? candidate.isBookmarked);
    const newStatus = !isCurrentlyBookmarked;

    setData({
      ...data,
      results: data.results.map((c) =>
        c.id === candidate.id ? { ...c, is_bookmarked: newStatus, isBookmarked: newStatus } : c
      ),
    });

    try {
      await toggleBookmark(candidate.id);
      setToastMessage(newStatus ? `@${candidate.username} saved to bookmarks!` : `@${candidate.username} removed.`);
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      setData({
        ...data,
        results: data.results.map((c) =>
          c.id === candidate.id ? { ...c, is_bookmarked: isCurrentlyBookmarked, isBookmarked: isCurrentlyBookmarked } : c
        ),
      });
      setError('Failed to update bookmark');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-2xl bg-gray-900 text-white shadow-2xl dark:bg-white dark:text-gray-900 transition-all transform animate-slide-up border border-gray-700/50">
          <CheckCircleIcon className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-brand-500/10 via-brand-500/5 to-transparent border border-brand-500/20 dark:border-brand-500/10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Candidate Search & Discovery
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
            {isAdmin ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-brand-600 dark:text-brand-400">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                Admin Mode: Full Candidate Directory (All Demographics)
              </span>
            ) : data?.target_gender ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Matching Mode: Showing {data.target_gender === 'woman' ? 'Women / Girls' : 'Men / Boys'} Profiles (Opposite Gender)
              </span>
            ) : (
              'Discover suitable candidates with advanced multi-criteria matching'
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/profile/bookmarks"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition-all shadow-xs"
          >
            <svg className="w-4 h-4 fill-current text-amber-500" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            Saved Bookmarks
          </Link>
        </div>
      </div>

      {/* Main 2-Column Layout (Left: Results, Right: Sticky Filters Sidebar) */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        
        {/* Left Column: Search Bar, Admin Tabs, Results, Grid/List */}
        <div className="flex-1 min-w-0 space-y-5 w-full">
          {/* Top Controls Row */}
          <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {isAdmin ? (
                <div className="flex items-center gap-1 p-1 rounded-2xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/60 w-fit">
                  <button
                    type="button"
                    onClick={() => { setGenderFilter('all'); setPage(1); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      genderFilter === 'all'
                        ? 'bg-brand-500 text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => { setGenderFilter('man'); setPage(1); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      genderFilter === 'man'
                        ? 'bg-brand-500 text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                    }`}
                  >
                    Men Only
                  </button>
                  <button
                    type="button"
                    onClick={() => { setGenderFilter('woman'); setPage(1); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      genderFilter === 'woman'
                        ? 'bg-brand-500 text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                    }`}
                  >
                    Women Only
                  </button>
                </div>
              ) : (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Showing profiles matching your opposite gender
                </div>
              )}

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <select
                  value={ordering}
                  onChange={(e) => {
                    setOrdering(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-1 focus:ring-brand-500"
                >
                  <option value="-date_joined">Newest Joined</option>
                  <option value="date_joined">Oldest Joined</option>
                  <option value="username">Username (A-Z)</option>
                  <option value="-username">Username (Z-A)</option>
                </select>

                <div className="flex items-center rounded-xl border border-gray-300 dark:border-gray-700 p-0.5 bg-gray-50 dark:bg-gray-800">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-700 text-brand-600 dark:text-brand-400 shadow-xs'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                    }`}
                    title="Grid View"
                  >
                    <GridIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-gray-700 text-brand-600 dark:text-brand-400 shadow-xs'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                    }`}
                    title="List View"
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="lg:hidden px-3 py-1.5 text-xs font-semibold rounded-xl bg-brand-50 text-brand-600 border border-brand-200 dark:bg-brand-950/40 dark:border-brand-800 flex items-center gap-1.5"
                >
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-brand-500 text-white text-[10px] flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                <span className="text-[11px] font-semibold text-gray-400">Active ({activeFilterCount}):</span>
                {keyword && (
                  <span className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    &quot;{keyword}&quot;
                  </span>
                )}
                {selectedLocations.map((loc) => (
                  <span key={loc} className="px-2 py-0.5 rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                    {loc}
                  </span>
                ))}
                {selectedEducations.map((edu) => (
                  <span key={edu} className="px-2 py-0.5 rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                    {edu}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-red-500 hover:text-red-700 text-[11px] font-semibold underline ml-1 cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Results Count Strip */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
            <span>
              Found <strong className="text-gray-900 dark:text-white font-bold">{data?.count ?? 0}</strong> candidates
            </span>
            {loading && <span className="text-brand-500 font-medium animate-pulse">Updating candidate cards...</span>}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Candidate Grid or List */}
          {loading && !data ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 rounded-3xl bg-gray-100 dark:bg-gray-800/40 animate-pulse border border-gray-200 dark:border-gray-800"></div>
              ))}
            </div>
          ) : displayedCandidates.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {displayedCandidates.map((cand) => {
                  const isBookmarked = Boolean(cand.is_bookmarked ?? cand.isBookmarked);
                  const isFemale = cand.gender === 'woman' || cand.gender === 'female';
                  const loc = cand.birth_location || cand.province || '—';
                  const edu = cand.education || cand.educationLevel || cand.degree || '—';
                  const mar = cand.marriage_experience || cand.maritalExperience;

                  return (
                    <div
                      key={cand.id}
                      className="group relative rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 shadow-sm hover:shadow-xl hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md transition-transform group-hover:scale-105 ${
                              isFemale
                                ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-pink-500/20'
                                : 'bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-brand-500/20'
                            }`}
                          >
                            {cand.username.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-brand-500 transition-colors">
                              @{cand.username}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              <span>{cand.age ? `${cand.age} yrs` : 'Age: —'}</span>
                              <span>•</span>
                              <span className="truncate max-w-[90px]">{loc}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleBookmark(cand)}
                          className={`p-2 rounded-xl transition-all cursor-pointer ${
                            isBookmarked
                              ? 'bg-amber-100 text-amber-500 dark:bg-amber-950/40 dark:text-amber-400 scale-110 shadow-xs'
                              : 'text-gray-400 hover:bg-gray-100 hover:text-amber-500 dark:hover:bg-gray-800'
                          }`}
                          title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Candidate'}
                        >
                          <svg
                            className={`w-4 h-4 ${isBookmarked ? 'fill-current text-amber-500' : 'fill-none stroke-current stroke-2'}`}
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        </button>
                      </div>

                      <div className="my-4 space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                          <span className="text-gray-400">🎓</span>
                          <span className="truncate font-medium">{edu}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                          <span className="text-gray-400">💼</span>
                          <span className="truncate font-medium">{cand.job || 'Career: —'}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                          <span className="text-gray-400">📏</span>
                          <span>
                            {cand.height ? `${cand.height} cm` : '—'} / {cand.weight ? `${cand.weight} kg` : '—'}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {mar === 'no' && (
                            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                              Never Married
                            </span>
                          )}
                          {mar === 'yes' && (
                            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                              Divorced
                            </span>
                          )}
                          {cand.ownership_status === 'owner' && (
                            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400">
                              Homeowner
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/candidates/${cand.id}`}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-2xl bg-gray-50 text-gray-700 hover:bg-brand-500 hover:text-white dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-brand-500 dark:hover:text-white transition-all shadow-2xs"
                      >
                        <UserCircleIcon className="w-4 h-4" />
                        <span>View Profile</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-400">
                      <tr>
                        <th
                          className="w-12 px-3 py-3 text-center cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                          onClick={() => handleTableSort('save')}
                          title="Sort by Saved Bookmark"
                        >
                          <div className="flex items-center justify-center gap-1">
                            <span>Save</span>
                            <TableSortIndicator active={tableSortCol === 'save'} direction={tableSortDir} />
                          </div>
                        </th>
                        <th
                          className="px-4 py-3 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                          onClick={() => handleTableSort('candidate')}
                          title="Sort by Candidate Name"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Candidate</span>
                            <TableSortIndicator active={tableSortCol === 'candidate'} direction={tableSortDir} />
                          </div>
                        </th>
                        <th
                          className="px-3 py-3 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                          onClick={() => handleTableSort('age_city')}
                          title="Sort by Age / City"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Age / City</span>
                            <TableSortIndicator active={tableSortCol === 'age_city'} direction={tableSortDir} />
                          </div>
                        </th>
                        <th
                          className="px-3 py-3 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                          onClick={() => handleTableSort('education')}
                          title="Sort by Education Level"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Education</span>
                            <TableSortIndicator active={tableSortCol === 'education'} direction={tableSortDir} />
                          </div>
                        </th>
                        <th
                          className="px-3 py-3 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                          onClick={() => handleTableSort('job')}
                          title="Sort by Profession / Job"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Job</span>
                            <TableSortIndicator active={tableSortCol === 'job'} direction={tableSortDir} />
                          </div>
                        </th>
                        <th
                          className="px-3 py-3 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                          onClick={() => handleTableSort('height_weight')}
                          title="Sort by Height & Weight"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Height / Weight</span>
                            <TableSortIndicator active={tableSortCol === 'height_weight'} direction={tableSortDir} />
                          </div>
                        </th>
                        <th className="px-3 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {displayedCandidates.map((cand) => {
                        const isBookmarked = Boolean(cand.is_bookmarked ?? cand.isBookmarked);
                        const isFemale = cand.gender === 'woman' || cand.gender === 'female';
                        const loc = cand.birth_location || cand.province || '—';
                        const edu = cand.education || cand.educationLevel || cand.degree || '—';

                        return (
                          <tr key={cand.id} className="hover:bg-gray-50/70 dark:hover:bg-white/[0.02] transition-colors">
                            <td className="px-3 py-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleBookmark(cand)}
                                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                                  isBookmarked ? 'text-amber-500' : 'text-gray-300 hover:text-amber-500 dark:text-gray-600'
                                }`}
                              >
                                <svg
                                  className={`w-4 h-4 ${isBookmarked ? 'fill-current text-amber-500' : 'fill-none stroke-current stroke-2'}`}
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              </button>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white ${
                                  isFemale ? 'bg-pink-500' : 'bg-brand-500'
                                }`}>
                                  {cand.username.slice(0, 2).toUpperCase()}
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white text-xs">
                                  @{cand.username}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-3.5 text-xs text-gray-600 dark:text-gray-300">
                              {cand.age ? `${cand.age} yrs` : '—'} • {loc}
                            </td>
                            <td className="px-3 py-3.5 text-xs text-gray-600 dark:text-gray-300 truncate max-w-[120px]">
                              {edu}
                            </td>
                            <td className="px-3 py-3.5 text-xs text-gray-600 dark:text-gray-300 truncate max-w-[100px]">
                              {cand.job || '—'}
                            </td>
                            <td className="px-3 py-3.5 text-xs text-gray-600 dark:text-gray-300">
                              {cand.height ? `${cand.height} cm` : '—'} / {cand.weight ? `${cand.weight} kg` : '—'}
                            </td>
                            <td className="px-3 py-3.5 text-right">
                              <Link
                                href={`/candidates/${cand.id}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 dark:bg-brand-950/40 dark:text-brand-400 transition-colors"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white dark:border-gray-800 dark:bg-white/[0.01] p-12 text-center">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                No candidates matched your search criteria
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4">
                Try expanding your selected filters in the right sidebar or clear all filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-colors cursor-pointer"
              >
                Clear All Search Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {data && data.total_pages > 1 && (
            <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02]">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Page <strong className="text-gray-800 dark:text-white">{data.page}</strong> of <strong className="text-gray-800 dark:text-white">{data.total_pages}</strong>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={data.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 text-xs font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
                >
                  Prev
                </button>
                {Array.from({ length: Math.min(5, data.total_pages) }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => setPage(pNum)}
                      className={`w-7 h-7 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                        data.page === pNum
                          ? 'bg-brand-500 text-white shadow-xs'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
                <button
                  type="button"
                  disabled={data.page >= data.total_pages}
                  onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                  className="px-3 py-1 text-xs font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Pane Sidebar: Filters Drawer */}
        <aside className={`w-full lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-20 space-y-4 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Filter Criteria</h2>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Keyword Search inside Right Sidebar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search username, degree, job..."
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
                className="w-full pl-8 pr-3 py-2 text-xs border border-gray-300 rounded-xl dark:border-gray-700 dark:bg-gray-800/80 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 1114 0z" />
              </svg>
            </div>

            {/* Scrollable Filters Container */}
            <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-1 space-y-1 divide-y divide-gray-100 dark:divide-gray-800/60 text-xs">
              {/* Age Range */}
              <div className="py-3 space-y-2">
                <span className="font-bold text-gray-800 dark:text-gray-200 text-xs">Age Range (Years)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="18"
                    max="100"
                    placeholder="Min"
                    value={minAge}
                    onChange={(e) => { setMinAge(e.target.value); setPage(1); }}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <span className="text-gray-400 font-bold">-</span>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    placeholder="Max"
                    value={maxAge}
                    onChange={(e) => { setMaxAge(e.target.value); setPage(1); }}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {AGE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setMinAge(String(preset.min));
                        setMaxAge(String(preset.max));
                        setPage(1);
                      }}
                      className="px-2 py-0.5 text-[10px] rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-brand-50 hover:text-brand-600 transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Height & Weight */}
              <div className="py-3 space-y-2">
                <span className="font-bold text-gray-800 dark:text-gray-200 text-xs">Height & Weight (cm / kg)</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min cm"
                    value={minHeight}
                    onChange={(e) => { setMinHeight(e.target.value); setPage(1); }}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max cm"
                    value={maxHeight}
                    onChange={(e) => { setMaxHeight(e.target.value); setPage(1); }}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Min kg"
                    value={minWeight}
                    onChange={(e) => { setMinWeight(e.target.value); setPage(1); }}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max kg"
                    value={maxWeight}
                    onChange={(e) => { setMaxWeight(e.target.value); setPage(1); }}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Career Title */}
              <div className="py-3 space-y-2">
                <span className="font-bold text-gray-800 dark:text-gray-200 text-xs">Career / Profession</span>
                <input
                  type="text"
                  placeholder="e.g. Teacher, Engineer..."
                  value={job}
                  onChange={(e) => { setJob(e.target.value); setPage(1); }}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Multiselect Groups */}
              <FilterPillGroup
                title="Province / Location"
                options={LOCATION_OPTIONS}
                selected={selectedLocations}
                onToggle={(val) => toggleArrayItem(selectedLocations, setSelectedLocations, val)}
                defaultExpanded={true}
              />

              <FilterPillGroup
                title="Education Level"
                options={EDUCATION_OPTIONS}
                selected={selectedEducations}
                onToggle={(val) => toggleArrayItem(selectedEducations, setSelectedEducations, val)}
                defaultExpanded={true}
              />

              <FilterPillGroup
                title="Marital History"
                options={MARITAL_OPTIONS}
                selected={selectedMaritals}
                onToggle={(val) => toggleArrayItem(selectedMaritals, setSelectedMaritals, val)}
                defaultExpanded={true}
              />

              <FilterPillGroup
                title="Monthly Income"
                options={INCOME_OPTIONS}
                selected={selectedIncomes}
                onToggle={(val) => toggleArrayItem(selectedIncomes, setSelectedIncomes, val)}
              />

              <FilterPillGroup
                title="Housing Ownership"
                options={OWNERSHIP_OPTIONS}
                selected={selectedOwnerships}
                onToggle={(val) => toggleArrayItem(selectedOwnerships, setSelectedOwnerships, val)}
              />

              <FilterPillGroup
                title="Current Residence"
                options={RESIDENCE_OPTIONS}
                selected={selectedResidences}
                onToggle={(val) => toggleArrayItem(selectedResidences, setSelectedResidences, val)}
              />

              <FilterPillGroup
                title="Assets & Capital"
                options={CAPITAL_OPTIONS}
                selected={selectedCapitals}
                onToggle={(val) => toggleArrayItem(selectedCapitals, setSelectedCapitals, val)}
              />

              <FilterPillGroup
                title="Preferred Dowry"
                options={DOWRY_OPTIONS}
                selected={selectedDowries}
                onToggle={(val) => toggleArrayItem(selectedDowries, setSelectedDowries, val)}
              />

              <FilterPillGroup
                title="Prayer Commitment"
                options={WORSHIP_OPTIONS}
                selected={selectedWorships}
                onToggle={(val) => toggleArrayItem(selectedWorships, setSelectedWorships, val)}
              />

              <FilterPillGroup
                title="Fasting Commitment"
                options={FASTING_OPTIONS}
                selected={selectedFastings}
                onToggle={(val) => toggleArrayItem(selectedFastings, setSelectedFastings, val)}
              />

              <FilterPillGroup
                title="Society Cover & Hijab"
                options={COVER_OPTIONS}
                selected={selectedCovers}
                onToggle={(val) => toggleArrayItem(selectedCovers, setSelectedCovers, val)}
              />

              <FilterPillGroup
                title="Velayat Faqih"
                options={VELAYAT_OPTIONS}
                selected={selectedVelayats}
                onToggle={(val) => toggleArrayItem(selectedVelayats, setSelectedVelayats, val)}
              />

              <FilterPillGroup
                title="Skin Complexion"
                options={SKIN_OPTIONS}
                selected={selectedSkins}
                onToggle={(val) => toggleArrayItem(selectedSkins, setSelectedSkins, val)}
              />

              <FilterPillGroup
                title="Prior Marriage Acceptance"
                options={PREF_EXP_OPTIONS}
                selected={selectedPrefExps}
                onToggle={(val) => toggleArrayItem(selectedPrefExps, setSelectedPrefExps, val)}
              />
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
