'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/context/LanguageContext';
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
import { formatHeight, formatWeight, toPersianDigits, toEnglishDigits } from '@/utils/formatters';

const LOCATION_OPTIONS = [
  { value: 'Tehran', labelFa: 'تهران', labelEn: 'Tehran' },
  { value: 'Qom', labelFa: 'قم', labelEn: 'Qom' },
  { value: 'Isfahan', labelFa: 'اصفهان', labelEn: 'Isfahan' },
  { value: 'Mashhad', labelFa: 'مشهد', labelEn: 'Mashhad' },
  { value: 'Karaj', labelFa: 'کرج', labelEn: 'Karaj' },
  { value: 'Shiraz', labelFa: 'شیراز', labelEn: 'Shiraz' },
  { value: 'Tabriz', labelFa: 'تبریز', labelEn: 'Tabriz' },
  { value: 'Hamadan', labelFa: 'همدان', labelEn: 'Hamadan' },
  { value: 'Yazd', labelFa: 'یزد', labelEn: 'Yazd' },
  { value: 'Kerman', labelFa: 'کرمان', labelEn: 'Kerman' },
  { value: 'Gilan', labelFa: 'گیلان / رشت', labelEn: 'Gilan / Rasht' },
  { value: 'Mazandaran', labelFa: 'مازندران / ساری', labelEn: 'Mazandaran / Sari' },
  { value: 'Khuzestan', labelFa: 'خوزستان / اهواز', labelEn: 'Khuzestan / Ahvaz' },
  { value: 'Kermanshah', labelFa: 'کرمانشاه', labelEn: 'Kermanshah' },
  { value: 'Markazi', labelFa: 'مرکزی / اراک', labelEn: 'Markazi / Arak' },
  { value: 'Lorestan', labelFa: 'لرستان / خرم‌آباد', labelEn: 'Lorestan / Khorramabad' },
  { value: 'Golestan', labelFa: 'گلستان / گرگان', labelEn: 'Golestan / Gorgan' },
  { value: 'Zanjan', labelFa: 'زنجان', labelEn: 'Zanjan' },
  { value: 'Qazvin', labelFa: 'قزوین', labelEn: 'Qazvin' },
  { value: 'Ardabil', labelFa: 'اردبیل', labelEn: 'Ardabil' },
  { value: 'Semnan', labelFa: 'سمنان', labelEn: 'Semnan' },
  { value: 'Bushehr', labelFa: 'بوشهر', labelEn: 'Bushehr' },
  { value: 'Hormozgan', labelFa: 'هرمزگان / بندرعباس', labelEn: 'Hormozgan / Bandar Abbas' },
  { value: 'Kurdistan', labelFa: 'کردستان / سنندج', labelEn: 'Kurdistan / Sanandaj' },
  { value: 'Ilam', labelFa: 'ایلام', labelEn: 'Ilam' },
  { value: 'North Khorasan', labelFa: 'خراسان شمالی / بجنورد', labelEn: 'North Khorasan' },
  { value: 'South Khorasan', labelFa: 'خراسان جنوبی / بیرجند', labelEn: 'South Khorasan' },
  { value: 'Chaharmahal and Bakhtiari', labelFa: 'چهارمحال و بختیاری', labelEn: 'Chaharmahal and Bakhtiari' },
  { value: 'Sistan and Baluchestan', labelFa: 'سیستان و بلوچستان / زاهدان', labelEn: 'Sistan and Baluchestan' },
  { value: 'Kohgiluyeh and Boyer-Ahmad', labelFa: 'کهگیلویه و بویراحمد', labelEn: 'Kohgiluyeh and Boyer-Ahmad' },
];

const EDUCATION_OPTIONS = [
  { value: 'Ph.D.', labelFa: 'دکتری', labelEn: 'Ph.D.' },
  { value: "Master's Degree", labelFa: 'کارشناسی ارشد', labelEn: "Master's Degree" },
  { value: "Bachelor's Degree", labelFa: 'کارشناسی', labelEn: "Bachelor's Degree" },
  { value: 'Associate Degree', labelFa: 'کاردانی / فوق دیپلم', labelEn: 'Associate Degree' },
  { value: 'Diploma', labelFa: 'دیپلم', labelEn: 'Diploma' },
  { value: 'Under Diploma', labelFa: 'زیر دیپلم', labelEn: 'Under Diploma' },
  { value: 'Hoze (Islamic Seminary) LVL 4', labelFa: 'سطح ۴ حوزه', labelEn: 'Seminary Lvl 4' },
  { value: 'Hoze (Islamic Seminary) LVL 3', labelFa: 'سطح ۳ حوزه', labelEn: 'Seminary Lvl 3' },
  { value: 'Hoze (Islamic Seminary) LVL 2', labelFa: 'سطح ۲ حوزه', labelEn: 'Seminary Lvl 2' },
  { value: 'Hoze (Islamic Seminary) LVL 1', labelFa: 'سطح ۱ حوزه', labelEn: 'Seminary Lvl 1' },
  { value: 'School & Quranic', labelFa: 'علوم قرآنی', labelEn: 'Quranic School' },
];

const MARITAL_OPTIONS = [
  { value: 'no', labelFa: 'مجرد بدون سابقه', labelEn: 'Never Married' },
  { value: 'yes', labelFa: 'سابقه ازدواج / طلاق', labelEn: 'Divorced / Has Experience' },
  { value: 'engagement_only', labelFa: 'فقط دوران عقد', labelEn: 'Engagement Only' },
];

const INCOME_OPTIONS = [
  { value: 'no_income', labelFa: 'بدون درآمد', labelEn: 'No Income' },
  { value: '-10', labelFa: 'زیر ۱۰ میلیون', labelEn: 'Under 10 Million' },
  { value: '10-20', labelFa: '۱۰ تا ۲۰ میلیون', labelEn: '10M to 20M' },
  { value: '20-30', labelFa: '۲۰ تا ۳۰ میلیون', labelEn: '20M to 30M' },
  { value: '30-40', labelFa: '۳۰ تا ۴۰ میلیون', labelEn: '30M to 40M' },
  { value: '40-50', labelFa: '۴۰ تا ۵۰ میلیون', labelEn: '40M to 50M' },
  { value: '50-100', labelFa: '۵۰ تا ۱۰۰ میلیون', labelEn: '50M to 100M' },
  { value: '+100', labelFa: 'بیش از ۱۰۰ میلیون', labelEn: 'Over 100 Million' },
];

const OWNERSHIP_OPTIONS = [
  { value: 'owner', labelFa: 'دارای مسکن شخصی (مالک)', labelEn: 'Homeowner' },
  { value: 'rent', labelFa: 'مستاجر / اجاره', labelEn: 'Tenant / Rent' },
];

const RESIDENCE_OPTIONS = [
  { value: 'fathers_house', labelFa: 'منزل پدری', labelEn: "Father's House" },
  { value: 'mothers_house', labelFa: 'منزل مادری', labelEn: "Mother's House" },
  { value: 'other', labelFa: 'مستقل / سایر موارد', labelEn: 'Independent / Other' },
];

const CAPITAL_OPTIONS = [
  { value: 'house', labelFa: 'خانه / آپارتمان', labelEn: 'House' },
  { value: 'car', labelFa: 'خودرو', labelEn: 'Car' },
  { value: 'shop', labelFa: 'مغازه', labelEn: 'Shop' },
  { value: 'land', labelFa: 'زمین', labelEn: 'Land' },
  { value: 'gold', labelFa: 'طلا و پس‌انداز', labelEn: 'Gold & Savings' },
  { value: 'garden', labelFa: 'باغ / ویلا', labelEn: 'Garden / Villa' },
  { value: 'company', labelFa: 'شرکت', labelEn: 'Company' },
  { value: 'motorcycle', labelFa: 'موتورسیکلت', labelEn: 'Motorcycle' },
  { value: 'none', labelFa: 'هیچ‌کدام', labelEn: 'None' },
];

const DOWRY_OPTIONS = [
  { value: 'gold', labelFa: 'طلا و سکه', labelEn: 'Gold / Coins' },
  { value: 'money', labelFa: 'وجه نقد', labelEn: 'Cash / Money' },
  { value: 'house', labelFa: 'ملک یا خانه', labelEn: 'Real Estate / House' },
  { value: 'mecca', labelFa: 'سفر حج', labelEn: 'Mecca Pilgrimage' },
  { value: 'iraq', labelFa: 'سفر کربلا', labelEn: 'Karbala Pilgrimage' },
  { value: 'agreement', labelFa: 'توافقی', labelEn: 'Mutual Agreement' },
];

const WORSHIP_OPTIONS = [
  { value: 'fully_obligated', labelFa: 'کاملاً مقید به نماز اول وقت', labelEn: 'Fully Obligated' },
  { value: 'sometimes', labelFa: 'گاهی اوقات', labelEn: 'Sometimes' },
  { value: 'obligated_but_lazy', labelFa: 'مقید اما با تأخیر', labelEn: 'Obligated But Lazy' },
  { value: 'not_obligated', labelFa: 'غیر مقید', labelEn: 'Not Obligated' },
  { value: 'doesnt_matter', labelFa: 'فرقی ندارد', labelEn: "Doesn't Matter" },
];

const FASTING_OPTIONS = [
  { value: 'fully_obligated', labelFa: 'کاملاً مقید به روزه', labelEn: 'Fully Obligated' },
  { value: 'sometimes', labelFa: 'گاهی', labelEn: 'Sometimes' },
  { value: 'sick', labelFa: 'معذوریت پزشکی', labelEn: 'Medical Exemption' },
  { value: 'not_obligated', labelFa: 'غیر مقید', labelEn: 'Not Obligated' },
];

const COVER_OPTIONS = [
  { value: 'always_chador', labelFa: 'همیشه چادری', labelEn: 'Always Chador' },
  { value: 'sometimes_chador', labelFa: 'گاهی چادری', labelEn: 'Sometimes Chador' },
  { value: 'always_coverd_manto', labelFa: 'مانتو پوشیده و محجبه', labelEn: 'Covered Manto' },
  { value: 'sometimes_coverd_manto', labelFa: 'مانتو معمولی', labelEn: 'Sometimes Covered Manto' },
  { value: 'always_free_manto', labelFa: 'مانتو آزاد', labelEn: 'Free Manto' },
];

const VELAYAT_OPTIONS = [
  { value: 'agree', labelFa: 'معتقد و ملتزم', labelEn: 'Agree / Believer' },
  { value: 'no_opinion', labelFa: 'نظری ندارم', labelEn: 'No Opinion' },
];

const SKIN_OPTIONS = [
  { value: 'Very Bright', labelFa: 'خیلی سفید و بور', labelEn: 'Very Bright' },
  { value: 'Bor', labelFa: 'بور', labelEn: 'Bor' },
  { value: 'Fair', labelFa: 'سفید روشن', labelEn: 'Fair' },
  { value: 'White', labelFa: 'سفید', labelEn: 'White' },
  { value: 'Wheat', labelFa: 'گندمی', labelEn: 'Wheat' },
  { value: 'Greenish', labelFa: 'سبزه روشن', labelEn: 'Greenish' },
  { value: 'Olive', labelFa: 'سبزه', labelEn: 'Olive' },
  { value: 'Darken', labelFa: 'تیره', labelEn: 'Darken' },
  { value: 'Black', labelFa: 'سبزه تیره / مشکی', labelEn: 'Black' },
  { value: 'Bright Brown', labelFa: 'قهوه‌ای روشن', labelEn: 'Bright Brown' },
  { value: 'Darken Brown', labelFa: 'قهوه‌ای تیره', labelEn: 'Darken Brown' },
  { value: 'Bright', labelFa: 'روشن', labelEn: 'Bright' },
  { value: 'Yellow', labelFa: 'زرد', labelEn: 'Yellow' },
  { value: 'Whitish White', labelFa: 'سفید مهتابی', labelEn: 'Whitish White' },
  { value: 'Red & White', labelFa: 'سفید و گلگون', labelEn: 'Red & White' },
  { value: 'Bright Greenish', labelFa: 'سبزه خیلی روشن', labelEn: 'Bright Greenish' },
  { value: 'other', labelFa: 'سایر موارد', labelEn: 'Other' },
];

const PREF_EXP_OPTIONS = [
  { value: 'Never', labelFa: 'فقط مجرد بدون سابقه', labelEn: 'Never Married Only' },
  { value: 'Divorced Virgin', labelFa: 'عقد جدا شده', labelEn: 'Divorced Virgin' },
  { value: 'Divorced No Child', labelFa: 'طلاق بدون فرزند', labelEn: 'Divorced Without Children' },
  { value: 'Divorced Have Boy', labelFa: 'طلاق دارای فرزند پسر', labelEn: 'Divorced With Son' },
  { value: 'Divorced Have Girl', labelFa: 'طلاق دارای فرزند دختر', labelEn: 'Divorced With Daughter' },
  { value: 'Spouse Died', labelFa: 'همسر فوت شده', labelEn: 'Spouse Deceased' },
];

const VIRGINITY_OPTIONS = [
  { value: 'virgin', labelFa: 'دوشیزه / باکره (پسر / دختر)', labelEn: 'Virgin (Boy / Girl)' },
  { value: 'not_virgin', labelFa: 'غیر باکره (مرد / زن / جدایی)', labelEn: 'Non-Virgin (Man / Woman / Separated)' },
];

const AGE_PRESETS = [
  { labelFa: '۱۸-۲۵', labelEn: '18-25', min: 18, max: 25 },
  { labelFa: '۲۵-۳۰', labelEn: '25-30', min: 25, max: 30 },
  { labelFa: '۳۰-۳۵', labelEn: '30-35', min: 30, max: 35 },
  { labelFa: '۳۵-۴۰', labelEn: '35-40', min: 35, max: 40 },
  { labelFa: '۴۰-۵۰', labelEn: '40-50', min: 40, max: 50 },
  { labelFa: '+۵۰', labelEn: '50+', min: 50, max: 99 },
];

const HEIGHT_PRESETS = [
  { labelFa: 'زیر ۱۶۰', labelEn: '< 160', min: 0, max: 159 },
  { labelFa: '۱۶۰-۱۷۰', labelEn: '160-170', min: 160, max: 170 },
  { labelFa: '۱۷۰-۱۸۰', labelEn: '170-180', min: 170, max: 180 },
  { labelFa: '۱۸۰-۱۹۰', labelEn: '180-190', min: 180, max: 190 },
  { labelFa: '+۱۹۰', labelEn: '190+', min: 190, max: 220 },
];

const WEIGHT_PRESETS = [
  { labelFa: 'زیر ۵۰', labelEn: '< 50', min: 35, max: 49 },
  { labelFa: '۵۰-۶۰', labelEn: '50-60', min: 50, max: 60 },
  { labelFa: '۶۰-۷۰', labelEn: '60-70', min: 60, max: 70 },
  { labelFa: '۷۰-۸۵', labelEn: '70-85', min: 70, max: 85 },
  { labelFa: '۸۵-۱۰۰', labelEn: '85-100', min: 85, max: 100 },
  { labelFa: '+۱۰۰', labelEn: '100+', min: 100, max: 180 },
];

interface PillOption {
  value: string;
  label?: string;
  labelFa?: string;
  labelEn?: string;
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
  const { isRTL, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  return (
    <div className="border-b border-slate-100 dark:border-gray-800/80 py-3 last:border-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-800 dark:text-white/90 hover:text-[var(--color-primary)] transition-colors py-1 cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <span>{t(title)}</span>
          {selected.length > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[var(--color-primary)] text-white">
              {selected.length}
            </span>
          )}
        </span>
        <span className="text-slate-400">
          {isOpen ? <ChevronUpIcon className="w-3.5 h-3.5" /> : <ChevronDownIcon className="w-3.5 h-3.5" />}
        </span>
      </button>

      {isOpen && (
        <div className="flex flex-wrap gap-1.5 pt-2.5 animate-fade-in">
          {options.map((opt) => {
            const isSelected = selected.includes(opt.value);
            const labelText = isRTL ? (opt.labelFa ?? opt.label ?? opt.value) : (opt.labelEn ?? opt.label ?? opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onToggle(opt.value)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border-[1.5px] transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white border-transparent shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                    : 'bg-white dark:bg-gray-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                {isSelected && <span className="font-bold text-[11px]">✓</span>}
                <span>{labelText}</span>
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
  const { t, isRTL } = useTranslation();
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
  const [selectedVirginity, setSelectedVirginity] = useState<string[]>([]);
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
    count += selectedVirginity.length;
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
    selectedLocations, selectedVirginity, selectedEducations, selectedMaritals, selectedIncomes,
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
    setSelectedVirginity([]);
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

      if (selectedVirginity.length === 1) {
        params.virginity = selectedVirginity[0] as 'virgin' | 'not_virgin';
      }

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
    selectedLocations, selectedVirginity, selectedEducations, selectedMaritals, selectedIncomes,
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
            {t("Candidate Search & Discovery")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
            {isAdmin ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-brand-600 dark:text-brand-400">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                {t("Admin Mode: Full Candidate Directory (All Demographics)")}
              </span>
            ) : data?.target_gender ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {data.target_gender === 'woman'
                  ? (isRTL ? 'در حال نمایش پروفایل‌های بانوان (جنس مخالف)' : 'Showing Women / Girls Profiles (Opposite Gender)')
                  : (isRTL ? 'در حال نمایش پروفایل‌های آقایان (جنس مخالف)' : 'Showing Men / Boys Profiles (Opposite Gender)')}
              </span>
            ) : (
              t("Discover suitable candidates with advanced multi-criteria matching")
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
            {t("Saved Bookmarks")}
          </Link>
        </div>
      </div>

      {/* Main 2-Column Layout (Left: Results, Right: Sticky Filters Sidebar) */}
      <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
        
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
                    {t("All")}
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
                    {t("Men Only")}
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
                    {t("Women Only")}
                  </button>
                </div>
              ) : (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {isRTL ? "پروفایل‌های منطبق با جنسیت مقابل شما" : "Showing profiles matching your opposite gender"}
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
                  <option value="-date_joined">{t("Newest Joined")}</option>
                  <option value="date_joined">{t("Oldest Joined")}</option>
                  <option value="username">{t("Username A-Z")}</option>
                  <option value="-username">{t("Username Z-A")}</option>
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
                    title={t("Grid View")}
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
                    title={t("List View")}
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="lg:hidden px-3 py-1.5 text-xs font-semibold rounded-xl bg-brand-50 text-brand-600 border border-brand-200 dark:bg-brand-950/40 dark:border-brand-800 flex items-center gap-1.5"
                >
                  <span>{t("Filters")}</span>
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-brand-500 text-white text-[10px] flex items-center justify-center font-bold">
                      {isRTL ? toPersianDigits(activeFilterCount) : activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                <span className="text-[11px] font-semibold text-gray-400">{isRTL ? 'فیلترهای فعال:' : 'Active:'} ({isRTL ? toPersianDigits(activeFilterCount) : activeFilterCount})</span>
                {keyword && (
                  <span className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    &quot;{keyword}&quot;
                  </span>
                )}
                {(minAge || maxAge) && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                    <span>
                      {isRTL
                        ? `سن: ${minAge ? toPersianDigits(minAge) : '۱۸'} تا ${maxAge ? toPersianDigits(maxAge) : '۱۰۰'}`
                        : `Age: ${minAge || '18'} - ${maxAge || '100'}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => { setMinAge(''); setMaxAge(''); setPage(1); }}
                      className="hover:text-red-500 font-bold ml-0.5 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                )}
                {(minHeight || maxHeight) && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                    <span>
                      {isRTL
                        ? `قد: ${minHeight ? toPersianDigits(minHeight) : '—'} تا ${maxHeight ? toPersianDigits(maxHeight) : '—'} cm`
                        : `Height: ${minHeight || '—'} - ${maxHeight || '—'} cm`}
                    </span>
                    <button
                      type="button"
                      onClick={() => { setMinHeight(''); setMaxHeight(''); setPage(1); }}
                      className="hover:text-red-500 font-bold ml-0.5 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                )}
                {(minWeight || maxWeight) && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                    <span>
                      {isRTL
                        ? `وزن: ${minWeight ? toPersianDigits(minWeight) : '—'} تا ${maxWeight ? toPersianDigits(maxWeight) : '—'} kg`
                        : `Weight: ${minWeight || '—'} - ${maxWeight || '—'} kg`}
                    </span>
                    <button
                      type="button"
                      onClick={() => { setMinWeight(''); setMaxWeight(''); setPage(1); }}
                      className="hover:text-red-500 font-bold ml-0.5 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedLocations.map((loc) => (
                  <span key={loc} className="px-2 py-0.5 rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                    {t(loc)}
                  </span>
                ))}
                {selectedVirginity.map((v) => (
                  <span key={v} className="px-2 py-0.5 rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 font-semibold">
                    {v === 'virgin' ? (isRTL ? 'دوشیزه / باکره' : 'Virgin') : (isRTL ? 'غیر باکره' : 'Non-Virgin')}
                  </span>
                ))}
                {selectedEducations.map((edu) => (
                  <span key={edu} className="px-2 py-0.5 rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                    {t(edu)}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-red-500 hover:text-red-700 text-[11px] font-semibold underline ml-1 cursor-pointer"
                >
                  {isRTL ? "پاک کردن همه" : "Clear all"}
                </button>
              </div>
            )}
          </div>

          {/* Results Count Strip */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
            <span>
              {t("Found")}{' '}
              <strong className="text-gray-900 dark:text-white font-bold">{data?.count ?? 0}</strong> {t("candidates")}
            </span>
            {loading && <span className="text-brand-500 font-medium animate-pulse">{t("Loading...")}</span>}
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
                              <span>{cand.age ? `${isRTL ? toPersianDigits(cand.age) : cand.age} ${t("Years")}` : '—'}</span>
                              <span>•</span>
                              <span className="truncate max-w-[90px]">{t(loc)}</span>
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
                          title={isBookmarked ? t("Remove Bookmark") : t("Bookmark Candidate")}
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
                          <span className="truncate font-medium">{t(edu)}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                          <span className="text-gray-400">💼</span>
                          <span className="truncate font-medium">{cand.job ? t(cand.job) : '—'}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                          <span className="text-gray-400">📏</span>
                          <span>
                            {cand.height ? formatHeight(cand.height, isRTL) : '—'} / {cand.weight ? formatWeight(cand.weight, isRTL) : '—'}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {cand.is_virgin === true && (
                            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400">
                              {t("Virgin / Unmarried")}
                            </span>
                          )}
                          {cand.is_virgin === false && (
                            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400">
                              {t("Non-Virgin / Experienced")}
                            </span>
                          )}
                          {mar === 'no' && (
                            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                              {t("Never Married")}
                            </span>
                          )}
                          {mar === 'yes' && (
                            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                              {t("Divorced")}
                            </span>
                          )}
                          {cand.ownership_status === 'owner' && (
                            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400">
                              {t("Homeowner")}
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/candidates/${cand.id}`}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-2xl bg-gray-50 text-gray-700 hover:bg-brand-500 hover:text-white dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-brand-500 dark:hover:text-white transition-all shadow-2xs"
                      >
                        <UserCircleIcon className="w-4 h-4" />
                        <span>{t("View Profile")}</span>
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
                          title={t("Save")}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <span>{t("Save")}</span>
                            <TableSortIndicator active={tableSortCol === 'save'} direction={tableSortDir} />
                          </div>
                        </th>
                        <th
                          className="px-4 py-3 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                          onClick={() => handleTableSort('candidate')}
                          title={t("Candidate")}
                        >
                          <div className="flex items-center gap-1.5">
                            <span>{t("Candidate")}</span>
                            <TableSortIndicator active={tableSortCol === 'candidate'} direction={tableSortDir} />
                          </div>
                        </th>
                        <th
                          className="px-3 py-3 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                          onClick={() => handleTableSort('age_city')}
                          title={t("Age / City")}
                        >
                          <div className="flex items-center gap-1.5">
                            <span>{t("Age / City")}</span>
                            <TableSortIndicator active={tableSortCol === 'age_city'} direction={tableSortDir} />
                          </div>
                        </th>
                        <th
                          className="px-3 py-3 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                          onClick={() => handleTableSort('education')}
                          title={t("Education")}
                        >
                          <div className="flex items-center gap-1.5">
                            <span>{t("Education")}</span>
                            <TableSortIndicator active={tableSortCol === 'education'} direction={tableSortDir} />
                          </div>
                        </th>
                        <th
                          className="px-3 py-3 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                          onClick={() => handleTableSort('job')}
                          title={t("Job")}
                        >
                          <div className="flex items-center gap-1.5">
                            <span>{t("Job")}</span>
                            <TableSortIndicator active={tableSortCol === 'job'} direction={tableSortDir} />
                          </div>
                        </th>
                        <th
                          className="px-3 py-3 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                          onClick={() => handleTableSort('height_weight')}
                          title={t("Height / Weight")}
                        >
                          <div className="flex items-center gap-1.5">
                            <span>{t("Height / Weight")}</span>
                            <TableSortIndicator active={tableSortCol === 'height_weight'} direction={tableSortDir} />
                          </div>
                        </th>
                        <th className="px-3 py-3 text-right">{t("Action")}</th>
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
                                {cand.is_virgin === true && (
                                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                                    {isRTL ? 'دوشیزه' : 'Virgin'}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-3.5 text-xs text-gray-600 dark:text-gray-300">
                              {cand.age ? `${isRTL ? toPersianDigits(cand.age) : cand.age} ${t("Years")}` : '—'} • {t(loc)}
                            </td>
                            <td className="px-3 py-3.5 text-xs text-gray-600 dark:text-gray-300 truncate max-w-[120px]">
                              {t(edu)}
                            </td>
                            <td className="px-3 py-3.5 text-xs text-gray-600 dark:text-gray-300 truncate max-w-[100px]">
                              {cand.job ? t(cand.job) : '—'}
                            </td>
                            <td className="px-3 py-3.5 text-xs text-gray-600 dark:text-gray-300">
                              {cand.height ? formatHeight(cand.height, isRTL) : '—'} / {cand.weight ? formatWeight(cand.weight, isRTL) : '—'}
                            </td>
                            <td className="px-3 py-3.5 text-right">
                              <Link
                                href={`/candidates/${cand.id}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 dark:bg-brand-950/40 dark:text-brand-400 transition-colors"
                              >
                                {t("View")}
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
                {t("No candidates matched your search criteria")}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4">
                {t("Try expanding your selected filters in the right sidebar or clear all filters.")}
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-colors cursor-pointer"
              >
                {t("Clear All Search Filters")}
              </button>
            </div>
          )}

          {/* Pagination */}
          {data && data.total_pages > 1 && (
            <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02]">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {t("Page")} <strong className="text-gray-800 dark:text-white">{isRTL ? toPersianDigits(data.page) : data.page}</strong> {t("of")} <strong className="text-gray-800 dark:text-white">{isRTL ? toPersianDigits(data.total_pages) : data.total_pages}</strong>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={data.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 text-xs font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
                >
                  {t("Prev")}
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
                      {isRTL ? toPersianDigits(pNum) : pNum}
                    </button>
                  );
                })}
                <button
                  type="button"
                  disabled={data.page >= data.total_pages}
                  onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                  className="px-3 py-1 text-xs font-medium rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
                >
                  {t("Next")}
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
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                  {isRTL ? "معیارهای فیلتر" : "Filter Criteria"}
                </h2>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {isRTL ? toPersianDigits(activeFilterCount) : activeFilterCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
              >
                {isRTL ? "پاک کردن همه" : "Reset All"}
              </button>
            </div>

            {/* Keyword Search inside Right Sidebar */}
            <div className="relative">
              <input
                type="text"
                placeholder={isRTL ? "جستجوی نام کاربری، مدرک، شغل..." : "Search username, degree, job..."}
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
            <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-1.5 space-y-1 divide-y divide-gray-100 dark:divide-gray-800/60 text-xs custom-scrollbar">
              {/* Age Range */}
              <div className="py-3 space-y-2">
                <span className="font-bold text-gray-800 dark:text-gray-200 text-xs">
                  {isRTL ? "محدوده سنی (سال)" : "Age Range (Years)"}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={isRTL ? "حداقل" : "Min"}
                    value={isRTL ? toPersianDigits(minAge) : minAge}
                    onChange={(e) => {
                      const engVal = toEnglishDigits(e.target.value).replace(/\D/g, '');
                      setMinAge(engVal);
                      setPage(1);
                    }}
                    className={`w-full px-2.5 py-1 text-xs border rounded-lg bg-white dark:bg-gray-800 dark:text-white transition-all ${
                      (minAge && Number(minAge) < 18)
                        ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20 text-red-900 dark:text-red-200'
                        : minAge ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)] font-bold bg-[var(--color-primary)]/10 text-slate-900 dark:text-white' : 'border-slate-300 dark:border-gray-700'
                    }`}
                  />
                  <span className="text-slate-400 font-bold">-</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={isRTL ? "حداکثر" : "Max"}
                    value={isRTL ? toPersianDigits(maxAge) : maxAge}
                    onChange={(e) => {
                      const engVal = toEnglishDigits(e.target.value).replace(/\D/g, '');
                      setMaxAge(engVal);
                      setPage(1);
                    }}
                    className={`w-full px-2.5 py-1 text-xs border rounded-lg bg-white dark:bg-gray-800 dark:text-white transition-all ${
                      (maxAge && Number(maxAge) < 18)
                        ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20 text-red-900 dark:text-red-200'
                        : maxAge ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)] font-bold bg-[var(--color-primary)]/10 text-slate-900 dark:text-white' : 'border-slate-300 dark:border-gray-700'
                    }`}
                  />
                </div>
                {((minAge && Number(minAge) < 18) || (maxAge && Number(maxAge) < 18)) && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                    <span>⚠</span>
                    <span>{isRTL ? "حداقل سن مجاز برای جستجو ۱۸ سال می‌باشد." : "Minimum allowed age is 18 years."}</span>
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {AGE_PRESETS.map((preset) => {
                    const isPresetActive = minAge === String(preset.min) && maxAge === String(preset.max);
                    return (
                      <button
                        key={preset.labelEn}
                        type="button"
                        onClick={() => {
                          if (isPresetActive) {
                            setMinAge('');
                            setMaxAge('');
                          } else {
                            setMinAge(String(preset.min));
                            setMaxAge(String(preset.max));
                          }
                          setPage(1);
                        }}
                        className={`px-2.5 py-1 text-xs rounded-xl border-[1.5px] transition-all cursor-pointer font-semibold ${
                          isPresetActive
                            ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white border-transparent shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                            : 'bg-white dark:bg-gray-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0'
                        }`}
                      >
                        {isRTL ? preset.labelFa : preset.labelEn}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Height Range */}
              <div className="py-3 space-y-2">
                <span className="font-bold text-slate-800 dark:text-gray-200 text-xs">
                  {isRTL ? "محدوده قد (سانتی‌متر)" : "Height Range (cm)"}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={isRTL ? "حداقل قد" : "Min cm"}
                    value={isRTL ? toPersianDigits(minHeight) : minHeight}
                    onChange={(e) => {
                      const engVal = toEnglishDigits(e.target.value).replace(/\D/g, '');
                      setMinHeight(engVal);
                      setPage(1);
                    }}
                    className={`w-full px-2.5 py-1 text-xs border rounded-lg bg-white dark:bg-gray-800 dark:text-white transition-all ${
                      minHeight ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)] font-bold bg-[var(--color-primary)]/10 text-slate-900 dark:text-white' : 'border-slate-300 dark:border-gray-700'
                    }`}
                  />
                  <span className="text-slate-400 font-bold">-</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={isRTL ? "حداکثر قد" : "Max cm"}
                    value={isRTL ? toPersianDigits(maxHeight) : maxHeight}
                    onChange={(e) => {
                      const engVal = toEnglishDigits(e.target.value).replace(/\D/g, '');
                      setMaxHeight(engVal);
                      setPage(1);
                    }}
                    className={`w-full px-2.5 py-1 text-xs border rounded-lg bg-white dark:bg-gray-800 dark:text-white transition-all ${
                      maxHeight ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)] font-bold bg-[var(--color-primary)]/10 text-slate-900 dark:text-white' : 'border-slate-300 dark:border-gray-700'
                    }`}
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {HEIGHT_PRESETS.map((preset) => {
                    const isPresetActive = minHeight === String(preset.min) && maxHeight === String(preset.max);
                    return (
                      <button
                        key={preset.labelEn}
                        type="button"
                        onClick={() => {
                          if (isPresetActive) {
                            setMinHeight('');
                            setMaxHeight('');
                          } else {
                            setMinHeight(String(preset.min));
                            setMaxHeight(String(preset.max));
                          }
                          setPage(1);
                        }}
                        className={`px-2.5 py-1 text-xs rounded-xl border-[1.5px] transition-all cursor-pointer font-semibold ${
                          isPresetActive
                            ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white border-transparent shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                            : 'bg-white dark:bg-gray-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0'
                        }`}
                      >
                        {isRTL ? preset.labelFa : preset.labelEn}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Weight Range */}
              <div className="py-3 space-y-2">
                <span className="font-bold text-slate-800 dark:text-gray-200 text-xs">
                  {isRTL ? "محدوده وزن (کیلوگرم)" : "Weight Range (kg)"}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={isRTL ? "حداقل وزن" : "Min kg"}
                    value={isRTL ? toPersianDigits(minWeight) : minWeight}
                    onChange={(e) => {
                      const engVal = toEnglishDigits(e.target.value).replace(/\D/g, '');
                      setMinWeight(engVal);
                      setPage(1);
                    }}
                    className={`w-full px-2.5 py-1 text-xs border rounded-lg bg-white dark:bg-gray-800 dark:text-white transition-all ${
                      minWeight ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)] font-bold bg-[var(--color-primary)]/10 text-slate-900 dark:text-white' : 'border-slate-300 dark:border-gray-700'
                    }`}
                  />
                  <span className="text-slate-400 font-bold">-</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={isRTL ? "حداکثر وزن" : "Max kg"}
                    value={isRTL ? toPersianDigits(maxWeight) : maxWeight}
                    onChange={(e) => {
                      const engVal = toEnglishDigits(e.target.value).replace(/\D/g, '');
                      setMaxWeight(engVal);
                      setPage(1);
                    }}
                    className={`w-full px-2.5 py-1 text-xs border rounded-lg bg-white dark:bg-gray-800 dark:text-white transition-all ${
                      maxWeight ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)] font-bold bg-[var(--color-primary)]/10 text-slate-900 dark:text-white' : 'border-slate-300 dark:border-gray-700'
                    }`}
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {WEIGHT_PRESETS.map((preset) => {
                    const isPresetActive = minWeight === String(preset.min) && maxWeight === String(preset.max);
                    return (
                      <button
                        key={preset.labelEn}
                        type="button"
                        onClick={() => {
                          if (isPresetActive) {
                            setMinWeight('');
                            setMaxWeight('');
                          } else {
                            setMinWeight(String(preset.min));
                            setMaxWeight(String(preset.max));
                          }
                          setPage(1);
                        }}
                        className={`px-2.5 py-1 text-xs rounded-xl border-[1.5px] transition-all cursor-pointer font-semibold ${
                          isPresetActive
                            ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white border-transparent shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                            : 'bg-white dark:bg-gray-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0'
                        }`}
                      >
                        {isRTL ? preset.labelFa : preset.labelEn}
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* Career Title */}
              <div className="py-3 space-y-2">
                <span className="font-bold text-gray-800 dark:text-gray-200 text-xs">
                  {isRTL ? "شغل و حرفه" : "Career / Profession"}
                </span>
                <input
                  type="text"
                  placeholder={isRTL ? "مثلاً معلم، مهندس، کارمند..." : "e.g. Teacher, Engineer..."}
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
                title="Virginity Status"
                options={VIRGINITY_OPTIONS}
                selected={selectedVirginity}
                onToggle={(val) => toggleArrayItem(selectedVirginity, setSelectedVirginity, val)}
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
