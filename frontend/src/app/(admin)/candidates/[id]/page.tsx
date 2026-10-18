'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/services/api/client';
import { toggleBookmark } from '@/services/profileService';
import { useTranslation } from '@/context/LanguageContext';
import { formatHeight, formatWeight, formatDate, formatBoolean, toPersianDigits } from '@/utils/formatters';
import {
  ChevronLeftIcon,
  CheckCircleIcon,
  UserCircleIcon,
} from '@/icons';

type TabKey = 'overview' | 'personal' | 'physical' | 'intellectual' | 'family' | 'financial' | 'marriage' | 'preferred';

export default function PublicCandidateProfilePage() {
  const { t, isRTL } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const candidateId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [user, setUser] = useState<any>(null);
  const [personal, setPersonal] = useState<any>(null);
  const [physical, setPhysical] = useState<any>(null);
  const [birth, setBirth] = useState<any>(null);
  const [family, setFamily] = useState<any>(null);
  const [engagement, setEngagement] = useState<any>(null);
  const [financial, setFinancial] = useState<any>(null);
  const [intellectual, setIntellectual] = useState<any>(null);
  const [prefPersonal, setPrefPersonal] = useState<any>(null);
  const [prefPhysical, setPrefPhysical] = useState<any>(null);
  const [prefIntellectual, setPrefIntellectual] = useState<any>(null);
  const [prefExtra, setPrefExtra] = useState<any>(null);
  const [mother, setMother] = useState<any>(null);
  const [father, setFather] = useState<any>(null);
  const [sisters, setSisters] = useState<any[]>([]);
  const [brothers, setBrothers] = useState<any[]>([]);
  const [grooms, setGrooms] = useState<any[]>([]);
  const [brides, setBrides] = useState<any[]>([]);
  const [childrenList, setChildrenList] = useState<any[]>([]);
  const [prefOriginalities, setPrefOriginalities] = useState<any[]>([]);

  const loadCandidateData = useCallback(async () => {
    if (!candidateId) return;
    setLoading(true);
    setError('');

    try {
      const userData = await apiClient<any>(`/api/users/${candidateId}/`);
      setUser(userData);

      const extractFirst = (res: any) => {
        if (Array.isArray(res)) return res[0] ?? null;
        return res?.results?.[0] ?? null;
      };
      const extractList = (res: any) => {
        if (Array.isArray(res)) return res;
        return res?.results ?? [];
      };

      const [
        persRes, physRes, birthRes, famRes, engRes, finRes, intelRes,
        prefPersRes, prefPhysRes, prefIntelRes, prefExtraRes,
        mothRes, fathRes, sisRes, broRes, groomRes, brideRes, childRes, origRes, bmRes
      ] = await Promise.allSettled([
        apiClient<any>('/api/personal-information/', { params: { user: candidateId } }),
        apiClient<any>('/api/physical-information/', { params: { user: candidateId } }),
        apiClient<any>('/api/birth-certificate-information/', { params: { user: candidateId } }),
        apiClient<any>('/api/family-information/', { params: { user: candidateId } }),
        apiClient<any>('/api/engagement-or-wedding-status/', { params: { user: candidateId } }),
        apiClient<any>('/api/financial-information/', { params: { user: candidateId } }),
        apiClient<any>('/api/intellectual-information/', { params: { user: candidateId } }),
        apiClient<any>('/api/preferred-wife-personal-information/', { params: { user: candidateId } }),
        apiClient<any>('/api/preferred-wife-physical-information/', { params: { user: candidateId } }),
        apiClient<any>('/api/preferred-wife-intellectual-information/', { params: { user: candidateId } }),
        apiClient<any>('/api/preferred-wife-extra-information/', { params: { user: candidateId } }),
        apiClient<any>('/api/mothers/', { params: { user: candidateId } }),
        apiClient<any>('/api/fathers/', { params: { user: candidateId } }),
        apiClient<any>('/api/sisters/', { params: { user: candidateId } }),
        apiClient<any>('/api/brothers/', { params: { user: candidateId } }),
        apiClient<any>('/api/grooms/', { params: { user: candidateId } }),
        apiClient<any>('/api/brides-and-wives/', { params: { user: candidateId } }),
        apiClient<any>('/api/ex-husband-child-status/', { params: { user: candidateId } }),
        apiClient<any>('/api/future-spouse-originalities/', { params: { user: candidateId } }),
        apiClient<any>('/api/bookmarks/'),
      ]);

      if (persRes.status === 'fulfilled') setPersonal(extractFirst(persRes.value));
      if (physRes.status === 'fulfilled') setPhysical(extractFirst(physRes.value));
      if (birthRes.status === 'fulfilled') setBirth(extractFirst(birthRes.value));
      if (famRes.status === 'fulfilled') setFamily(extractFirst(famRes.value));
      if (engRes.status === 'fulfilled') setEngagement(extractFirst(engRes.value));
      if (finRes.status === 'fulfilled') setFinancial(extractFirst(finRes.value));
      if (intelRes.status === 'fulfilled') setIntellectual(extractFirst(intelRes.value));
      if (prefPersRes.status === 'fulfilled') setPrefPersonal(extractFirst(prefPersRes.value));
      if (prefPhysRes.status === 'fulfilled') setPrefPhysical(extractFirst(prefPhysRes.value));
      if (prefIntelRes.status === 'fulfilled') setPrefIntellectual(extractFirst(prefIntelRes.value));
      if (prefExtraRes.status === 'fulfilled') setPrefExtra(extractFirst(prefExtraRes.value));
      if (mothRes.status === 'fulfilled') setMother(extractFirst(mothRes.value));
      if (fathRes.status === 'fulfilled') setFather(extractFirst(fathRes.value));
      if (sisRes.status === 'fulfilled') setSisters(extractList(sisRes.value));
      if (broRes.status === 'fulfilled') setBrothers(extractList(broRes.value));
      if (groomRes.status === 'fulfilled') setGrooms(extractList(groomRes.value));
      if (brideRes.status === 'fulfilled') setBrides(extractList(brideRes.value));
      if (childRes.status === 'fulfilled') setChildrenList(extractList(childRes.value));
      if (origRes.status === 'fulfilled') setPrefOriginalities(extractList(origRes.value));

      if (bmRes.status === 'fulfilled') {
        const bms = extractList(bmRes.value);
        const bookmarked = bms.some((b: any) => 
          String(b.bookmarked_user) === String(candidateId) || 
          String(b.bookmarked_user_id) === String(candidateId) ||
          String(b.candidate_profile?.id) === String(candidateId)
        );
        setIsBookmarked(bookmarked);
      }
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load candidate profile');
    } finally {
      setLoading(false);
    }
  }, [candidateId]);

  useEffect(() => {
    loadCandidateData();
  }, [loadCandidateData]);

  const handleToggleBookmark = async () => {
    const prev = isBookmarked;
    setIsBookmarked(!prev);
    try {
      const res = await toggleBookmark(candidateId);
      setToastMessage(res.is_bookmarked ? 'Candidate added to your bookmarks!' : 'Candidate removed from bookmarks.');
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      setIsBookmarked(prev);
      setError('Failed to update bookmark');
    }
  };

  const computeAge = (birthDateStr?: string) => {
    if (!birthDateStr) return null;
    const bdate = new Date(birthDateStr);
    const today = new Date();
    let a = today.getFullYear() - bdate.getFullYear();
    const m = today.getMonth() - bdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bdate.getDate())) a--;
    return a > 0 ? a : null;
  };

  const age = computeAge(personal?.birth_date || birth?.birth_date);

  const computeVirginity = (genderVal: any): boolean | null => {
    if (!genderVal) return null;
    const rawStr = (Array.isArray(genderVal) ? genderVal.join(' ') : String(genderVal)).toLowerCase();
    const hasVirgin = rawStr.includes('boy') || rawStr.includes('girl') || rawStr.includes('پسر') || rawStr.includes('دختر');
    const hasNonVirgin = rawStr.includes('man') || rawStr.includes('woman') || rawStr.includes('seperated') || rawStr.includes('separated') || rawStr.includes('مرد') || rawStr.includes('زن') || rawStr.includes('جدایی') || rawStr.includes('deceased');
    if (hasVirgin && !hasNonVirgin) return true;
    if (hasNonVirgin) return false;
    return null;
  };

  const isVirgin = computeVirginity(personal?.gender);

  const isFemale = Boolean(
    personal?.gender === 'woman' || personal?.gender === 'female' || personal?.gender === 'girl' ||
    personal?.gender === 'زن' || personal?.gender === 'دختر' || personal?.gender === 'خانم' ||
    (Array.isArray(personal?.gender) && personal?.gender.some((g: string) => ['woman', 'girl', 'female', 'زن', 'دختر'].includes(String(g).toLowerCase())))
  );

  const DetailRow = ({ label, value, badge }: { label: string; value?: any; badge?: boolean }) => {
    let display: React.ReactNode = value;
    const isTech = label.toLowerCase().includes('email') || label.toLowerCase().includes('website') || label.toLowerCase().includes('url');

    if (value === true) display = isRTL ? 'بله' : 'Yes';
    else if (value === false) display = isRTL ? 'خیر' : 'No';
    else if (typeof value === 'number') {
      display = isRTL ? toPersianDigits(value) : String(value);
    } else if (Array.isArray(value)) {
      display = value.length ? (
        <div className={`flex flex-wrap gap-1.5 ${isRTL ? 'justify-start sm:justify-end' : 'justify-start sm:justify-end'}`}>
          {value.map((v, i) => {
            const str = String(v).trim();
            const trans = t(str);
            const formatted = isRTL && !isTech ? toPersianDigits(trans) : trans;
            return (
              <span
                key={i}
                className="inline-flex px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-800 dark:text-gray-200"
              >
                {formatted}
              </span>
            );
          })}
        </div>
      ) : '—';
    } else if (typeof value === 'string' && value.trim()) {
      const trimmed = value.trim();
      if (trimmed.toLowerCase() === 'none') {
        display = isRTL ? 'هیچکدام' : 'None';
      } else if (trimmed.includes(',') && !trimmed.startsWith('{')) {
        const parts = trimmed.split(',').map((p) => p.trim()).filter(Boolean);
        display = parts.map((p) => {
          const trans = t(p);
          return isRTL && !isTech ? toPersianDigits(trans) : trans;
        }).join(isRTL ? '، ' : ', ');
      } else {
        const trans = t(trimmed);
        display = isRTL && !isTech ? toPersianDigits(trans) : trans;
      }
    } else if (value === 0) {
      display = isRTL ? '۰' : '0';
    } else if (!value) {
      display = '—';
    }

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 border-b border-slate-100 dark:border-gray-800/80 last:border-0 gap-1.5">
        <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 shrink-0">{t(label)}</span>
        {badge && typeof display === 'string' && display !== '—' ? (
          <span className="inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] dark:bg-brand-950/40 dark:text-brand-400 w-fit">
            {display}
          </span>
        ) : (
          <span className={`text-xs font-semibold text-slate-900 dark:text-white ${isRTL ? 'sm:text-left' : 'sm:text-right'} break-words max-w-md`}>
            {display}
          </span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-8">
        <div className="h-48 rounded-3xl bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-96 rounded-3xl bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
          <div className="md:col-span-2 h-96 rounded-3xl bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 dark:bg-red-950/30 flex items-center justify-center mx-auto text-2xl font-bold">
          !
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("Candidate Not Found")}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{error || t("This candidate profile is not available or inactive.")}</p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-2xl bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-sm"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          {t("Back to Candidate Search")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fade-in">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-2xl bg-gray-900 text-white shadow-2xl dark:bg-white dark:text-gray-900 transition-all transform animate-slide-up border border-gray-700/50">
          <CheckCircleIcon className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[var(--color-primary)] dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ChevronLeftIcon className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          <span>{t("Back to Candidate Directory")}</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleBookmark}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-2xl transition-all cursor-pointer border ${
              isBookmarked
                ? 'bg-amber-100 text-amber-600 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-700 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:border-amber-400 hover:text-amber-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 shadow-2xs'
            }`}
          >
            <svg className={`w-4 h-4 ${isBookmarked ? 'fill-current text-amber-500' : 'fill-none stroke-current stroke-2'}`} viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span>{isBookmarked ? t("Bookmarked Candidate") : t("Bookmark Candidate")}</span>
          </button>
        </div>
      </div>

      {/* Hero Header Banner */}
      <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden shadow-xs">
        <div className={`h-36 ${isFemale ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600' : 'bg-gradient-to-r from-[var(--color-primary)] via-indigo-600 to-blue-600'} p-6 relative flex items-end justify-between`}>
          <span className="absolute top-4 right-4 px-3 py-1 text-[11px] font-bold rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
            {t("Public Verified Candidate Profile")}
          </span>
        </div>

        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <div className={`w-24 h-24 rounded-3xl border-4 border-white dark:border-gray-900 shadow-xl flex items-center justify-center font-extrabold text-2xl text-white ${
              isFemale ? 'bg-pink-600' : 'bg-[var(--color-primary)]'
            }`}>
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">@{user.username}</h1>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active"></span>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                {age ? `${isRTL ? toPersianDigits(age) : age} ${t("Years")}` : '—'} • {personal?.birth_location ? t(personal.birth_location) : '—'} • {t("Registered Member")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end gap-2 text-xs">
            {isVirgin === true && (
              <span className="px-3 py-1 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 font-semibold border border-teal-200 dark:border-teal-800">
                {t("Virgin / Unmarried")}
              </span>
            )}
            {isVirgin === false && (
              <span className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 font-semibold border border-purple-200 dark:border-purple-800">
                {t("Non-Virgin / Experienced")}
              </span>
            )}
            {personal?.education && (
              <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 font-semibold border border-slate-200/60 dark:border-gray-700">
                🎓 {t(personal.education)}
              </span>
            )}
            {financial?.job && (
              <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 font-semibold border border-slate-200/60 dark:border-gray-700">
                💼 {t(financial.job)}
              </span>
            )}
            {birth?.marriage_experince === 'no' ? (
              <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
                {t("Never Married")}
              </span>
            ) : birth?.marriage_experince === 'yes' ? (
              <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 font-semibold border border-amber-200 dark:border-amber-800">
                {t("Divorced / Has Experience")}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Highlights Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-gray-800 text-center shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400">{t("Height / Weight")}</span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
            {physical?.height ? formatHeight(physical.height, isRTL) : '—'} / {physical?.weight ? formatWeight(physical.weight, isRTL) : '—'}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-gray-800 text-center shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400">{t("Housing Ownership")}</span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
            {financial?.ownership_status ? t(financial.ownership_status) : '—'}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-gray-800 text-center shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400">{t("Monthly Income")}</span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
            {personal?.income ? t(personal.income) : '—'}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-gray-800 text-center shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400">{t("Skin Complexion")}</span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
            {physical?.skin_color ? t(physical.skin_color) : '—'}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-gray-800 text-center shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400">{t("Prayer Commitment")}</span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
            {intellectual?.worship_and_prayer || intellectual?.worship_prayer ? t(intellectual?.worship_and_prayer || intellectual?.worship_prayer) : '—'}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-gray-800 text-center shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400">{t("Society Cover & Hijab")}</span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
            {intellectual?.cover_type_society ? t(intellectual.cover_type_society) : '—'}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80 dark:border-gray-800 scrollbar-none">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'personal', label: 'Personal Information' },
          { key: 'physical', label: 'Physical Information' },
          { key: 'intellectual', label: 'Intellectual & Belief Information' },
          { key: 'family', label: 'Family Information' },
          { key: 'financial', label: 'Financial Information' },
          { key: 'marriage', label: 'Marriage Experience & History' },
          { key: 'preferred', label: 'Preferred Future Spouse' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 text-xs font-semibold rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-slate-200/80 dark:border-gray-700'
            }`}
          >
            {t(tab.label)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-gray-800">
                <span>👤</span> {t("Personal Information")}
              </h3>
              <DetailRow label="Birth Location / City" value={personal?.birth_location} />
              <DetailRow label="Age" value={age ? `${isRTL ? toPersianDigits(age) : age} ${t("Years")}` : '—'} />
              <DetailRow label="Education Degree" value={personal?.education} badge />
              <DetailRow label="Major / Degree Details" value={personal?.degree} />
              <DetailRow label="Sadat Lineage (سید)" value={personal?.sadat} />
              <DetailRow label="Military Status" value={personal?.military_status} />
              <DetailRow label="Insurance Status" value={personal?.have_insurance} />
              <DetailRow label="Leisure & Hobbies" value={personal?.leisure_type} />
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-gray-800">
                <span>🕌</span> {t("Religious & Intellectual Outlook")}
              </h3>
              <DetailRow label="Prayer & Worship" value={intellectual?.worship_prayer || intellectual?.worship_and_prayer} badge />
              <DetailRow label="Fasting (روزه)" value={intellectual?.fasting} />
              <DetailRow label="Society Cover / Hijab" value={intellectual?.cover_type_society} badge />
              <DetailRow label="Velayat Faqih View" value={intellectual?.opinion_velayat_faqih || intellectual?.opinion_about_velayat_faqih} />
              <DetailRow label="Religious Gatherings" value={intellectual?.participating_prayer_quran_meetings || intellectual?.participating_in_religious_meetings} />
              <DetailRow label="Music & Assemblies" value={intellectual?.music} />
              <DetailRow label="Marriage Goals" value={intellectual?.marriage_goals || intellectual?.marriage_goals_purposes} />
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-gray-800">
                <span>💰</span> {t("Financial & Living")}
              </h3>
              <DetailRow label="Career / Job" value={financial?.job} badge />
              <DetailRow label="Housing Ownership" value={financial?.ownership_status} />
              <DetailRow label="Current Residence" value={financial?.current_residence_status} />
              <DetailRow label="Assets & Capital" value={financial?.capital} />
              <DetailRow label="Expected Dowry Types" value={financial?.dowry_type || financial?.future_spouse_dowry_type} />
              <DetailRow label="Dowry Amount" value={financial?.dowry_amount || financial?.future_spose_dowry_amount} />
              <DetailRow label="Jahiziyeh" value={financial?.jahiziyeh || financial?.future_spose_jahiziyeh} />
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-gray-800">
                <span>🎯</span> {t("Preferred Future Spouse")}
              </h3>
              <DetailRow label="Desired Appearance" value={prefIntellectual?.appearance_type} />
              <DetailRow label="Acceptable Age Difference" value={prefIntellectual?.age_difference} />
              <DetailRow label="Prior Marriage Experience" value={prefIntellectual?.marriage_with_someone_with_marriage_experience} />
              <DetailRow label="Education Requirement" value={prefPersonal?.education || prefPersonal?.education_level} />
              <DetailRow label="Spouse Career Preference" value={prefPersonal?.future_spouse_job} />
              <DetailRow label="Location After Marriage" value={prefPersonal?.after_marriage_residence_location} />
              <DetailRow label="Most Important Moral Feature" value={prefIntellectual?.most_important_moral_feature_of_future_spouse || prefIntellectual?.most_important_moral_feature} />
            </div>
          </div>
        )}

        {activeTab === 'personal' && (
          <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-gray-800">
              {t("Personal Information & Lifestyle")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              <DetailRow label="Gender" value={personal?.gender} />
              <DetailRow label="Age" value={age ? `${isRTL ? toPersianDigits(age) : age} ${t("Years")}` : '—'} />
              <DetailRow label="Birth Location / City" value={personal?.birth_location} />
              <DetailRow label="Sadat Lineage (سید)" value={personal?.sadat} />
              <DetailRow label="Education Degree" value={personal?.education} badge />
              <DetailRow label="Major / Degree Details" value={personal?.degree} />
              <DetailRow label="Military Status" value={personal?.military_status} />
              <DetailRow label="Military Status Explanation" value={personal?.military_status_explanation} />
              <DetailRow label="Monthly Income" value={personal?.income} />
              <DetailRow label="Deposit / Savings" value={personal?.deposit} />
              <DetailRow label="Insurance Status" value={personal?.have_insurance} />
              <DetailRow label="Insurance Types" value={personal?.insurance_type} />
              <DetailRow label="Insurance Years" value={personal?.insurance_years} />
              <DetailRow label="Leisure Types" value={personal?.leisure_type} />
              <DetailRow label="Usage Cases (Tobacco/Hookah)" value={personal?.usage_cases} />
              <DetailRow label="Usage Cases Description" value={personal?.usage_case_description} />
              <DetailRow label="Tattoo or Body Art" value={personal?.tatto !== undefined ? personal?.tatto : personal?.tatoo} />
              <DetailRow label="Tattoo Description" value={personal?.tatto_description} />
              <DetailRow label="Conviction or Arrest History" value={personal?.conviction_or_arrest_history} />
              <DetailRow label="Conviction Reason" value={personal?.conviction_reason} />
            </div>
          </div>
        )}

        {activeTab === 'physical' && (
          <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-gray-800">
              {t("Physical & Health Information")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              <DetailRow label="Height" value={physical?.height ? formatHeight(physical.height, isRTL) : '—'} />
              <DetailRow label="Weight" value={physical?.weight ? formatWeight(physical.weight, isRTL) : '—'} />
              <DetailRow label="Skin Color" value={physical?.skin_color} />
              <DetailRow label="Eyes Color" value={physical?.eyes_color} />
              <DetailRow label="Blood Type" value={physical?.blood_type} />
              <DetailRow label="Character & Temperament (طبع و مزاج)" value={physical?.character_and_temperament} badge />
              <DetailRow label="Glasses" value={physical?.glasses} />
              <DetailRow label="Glasses Size" value={physical?.glasses_size} />
              <DetailRow label="Body & Face Appearance" value={physical?.body_and_face} />
              <DetailRow label="Disease / Surgery History" value={physical?.disease_or_surgery_history !== undefined ? physical?.disease_or_surgery_history : physical?.disease_or_surgery} />
              <DetailRow label="Medication / Disease Description" value={physical?.medication_surgery_disease_type} />
            </div>
          </div>
        )}

        {activeTab === 'intellectual' && (
          <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-gray-800">
              {t("Religious, Intellectual & Lifestyle Values")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              <DetailRow label="Prayer & Worship" value={intellectual?.worship_prayer || intellectual?.worship_and_prayer} badge />
              <DetailRow label="Fasting (روزه)" value={intellectual?.fasting} />
              <DetailRow label="Fasting Explanation" value={intellectual?.fasting_explanation} />
              <DetailRow label="Cover Type at Home" value={intellectual?.cover_type_house} />
              <DetailRow label="Cover Type in Society" value={intellectual?.cover_type_society} badge />
              <DetailRow label="Religious Meetings" value={intellectual?.participating_prayer_quran_meetings || intellectual?.participating_in_religious_meetings} />
              <DetailRow label="Music & Assemblies" value={intellectual?.music} />
              <DetailRow label="Dance / Singing Assemblies" value={intellectual?.dance_singing_assemblies} />
              <DetailRow label="Opinion on Innocent Contact (Non-Mahram)" value={intellectual?.opinion_innocent_contact || intellectual?.opinion_about_innocent_contact} />
              <DetailRow label="Cover for Innocent Contact" value={intellectual?.cover_type_innocent_contact} />
              <DetailRow label="Velayat Faqih View" value={intellectual?.opinion_velayat_faqih || intellectual?.opinion_about_velayat_faqih} />
              <DetailRow label="Political Orientation" value={intellectual?.political_orientation} />
              <DetailRow label="Child Quantity Preference" value={intellectual?.opinion_child_quantity || intellectual?.opinion_about_child_quantity} />
              <DetailRow label="Opinion on Woman Working" value={intellectual?.opinion_woman_job || intellectual?.opinion_about_womans_job} />
              <DetailRow label="Opinion on Woman Education" value={intellectual?.opinion_woman_edu || intellectual?.opinion_about_womans_education} />
              <DetailRow label="Positive Traits / Pros" value={intellectual?.pros_of_yourself} />
              <DetailRow label="Weaknesses / Cons" value={intellectual?.cons_of_yourself} />
              <DetailRow label="Friend Connection Quality" value={intellectual?.type_connection_friends || intellectual?.type_of_connection_with_friends} />
              <DetailRow label="Friend Connection Reason" value={intellectual?.friends_connection_reason} />
              <DetailRow label="Contract Ceremony" value={intellectual?.contract_how} />
              <DetailRow label="Wedding Ceremony" value={intellectual?.wedding_how} />
              <DetailRow label="Decision Making in Choosing Spouse" value={intellectual?.decision_making_choosing_spouse} />
              <DetailRow label="Marriage Goals" value={intellectual?.marriage_goals || intellectual?.marriage_goals_purposes} />
            </div>
          </div>
        )}

        {activeTab === 'family' && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-gray-800">
                {t("Family Heritage & Parents")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                <DetailRow label="Father Alive" value={father?.alive} />
                <DetailRow label="Father's Originality / Province" value={father?.originality} badge />
                <DetailRow label="Father's Job" value={father?.job} />
                <DetailRow label="Father's Education" value={father?.education} />
                {father?.death_date && <DetailRow label="Father's Death Date" value={formatDate(father.death_date, isRTL)} />}

                <DetailRow label="Mother Alive" value={mother?.alive} />
                <DetailRow label="Mother's Originality / Province" value={mother?.originality} badge />
                <DetailRow label="Mother's Job" value={mother?.job} />
                <DetailRow label="Mother's Education" value={mother?.education} />
                {mother?.death_date && <DetailRow label="Mother's Death Date" value={formatDate(mother.death_date, isRTL)} />}

                <DetailRow label="Average Family Education" value={family?.average_family_education} />
                <DetailRow label="Average Family Financial Level" value={family?.average_family_finance} />
                <DetailRow label="Family Divorce History" value={family?.family_divorce_history} />
                <DetailRow label="Family Divorce Reason" value={family?.family_divorce_reason} />
                <DetailRow label="Contact with Family" value={family?.contact_with_family} />
                <DetailRow label="Contact with Relatives" value={family?.contact_with_relatives} />
                <DetailRow label="Number of Sisters" value={family?.number_of_sisters ?? sisters.length} />
                <DetailRow label="Number of Brothers" value={family?.number_of_brothers ?? brothers.length} />
              </div>
            </div>

            {/* Sisters & Brothers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sisters.length > 0 && (
                <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-gray-400">
                    {t("Sisters Details")} ({sisters.length})
                  </h4>
                  <div className="space-y-2">
                    {sisters.map((sis, idx) => (
                      <div key={sis.id || idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-gray-800/40 text-xs flex justify-between items-center border border-slate-100 dark:border-gray-800">
                        <span className="text-slate-700 dark:text-gray-300">{t("Sister")} #{idx + 1}: {sis.education ? t(sis.education) : '—'}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{sis.job ? t(sis.job) : '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {brothers.length > 0 && (
                <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-gray-400">
                    {t("Brothers Details")} ({brothers.length})
                  </h4>
                  <div className="space-y-2">
                    {brothers.map((bro, idx) => (
                      <div key={bro.id || idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-gray-800/40 text-xs flex justify-between items-center border border-slate-100 dark:border-gray-800">
                        <span className="text-slate-700 dark:text-gray-300">{t("Brother")} #{idx + 1}: {bro.education ? t(bro.education) : '—'}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{bro.job ? t(bro.job) : '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Grooms & Brides Grid */}
            {(grooms.length > 0 || brides.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {grooms.length > 0 && (
                  <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-gray-400">
                      {t("Grooms & Sisters-in-law Details")} ({grooms.length})
                    </h4>
                    <div className="space-y-2">
                      {grooms.map((g, idx) => (
                        <div key={g.id || idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-gray-800/40 text-xs flex justify-between items-center border border-slate-100 dark:border-gray-800">
                          <span className="text-slate-700 dark:text-gray-300">#{idx + 1} {g.groom_or === 'zan_dadash' ? (isRTL ? 'زن داداش' : 'Sister-in-law') : (isRTL ? 'داماد / شوهر خواهر' : 'Groom / Brother-in-law')}: {g.education ? t(g.education) : '—'}</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{g.job ? t(g.job) : '—'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {brides.length > 0 && (
                  <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-gray-400">
                      {t("Brides & Brothers-in-law Details")} ({brides.length})
                    </h4>
                    <div className="space-y-2">
                      {brides.map((b, idx) => (
                        <div key={b.id || idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-gray-800/40 text-xs flex justify-between items-center border border-slate-100 dark:border-gray-800">
                          <span className="text-slate-700 dark:text-gray-300">#{idx + 1} {b.bride_or === 'shohar_khahar' ? (isRTL ? 'شوهر خواهر' : 'Brother-in-law') : (isRTL ? 'عروس / زن داداش' : 'Bride / Sister-in-law')}: {b.education ? t(b.education) : '—'}</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{b.job ? t(b.job) : '—'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-gray-800">
              {t("Financial & Residence Status")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              <DetailRow label="Occupation / Job" value={financial?.job} badge />
              <DetailRow label="Housing Ownership Status" value={financial?.ownership_status} />
              <DetailRow label="Current Residence Status" value={financial?.current_residence_status} />
              <DetailRow label="Monthly Rent Amount" value={financial?.rent_amount} />
              <DetailRow label="Mortgage Deposit" value={financial?.mortgage_amount} />
              <DetailRow label="Capital Assets" value={financial?.capital} />
              <DetailRow label="Other Capital / Notes" value={financial?.other_capital || financial?.other_captial} />
              <DetailRow label="Location After Marriage" value={financial?.after_marriage_residence_status} />
              <DetailRow label="Ex-Spouse Financial Status" value={financial?.ex_spouse_financial_status} />
              <DetailRow label="Ex-Spouse Financial Pay Status" value={financial?.ex_spouse_financial_pay_status} />
              <DetailRow label="Ex-Spouse Financial Amount" value={financial?.ex_spouse_financial_amount} />
              <DetailRow label="Future Spouse Dowry Types" value={financial?.dowry_type || financial?.future_spouse_dowry_type} />
              <DetailRow label="Dowry Amount" value={financial?.dowry_amount || financial?.future_spose_dowry_amount} />
              <DetailRow label="Jahiziyeh" value={financial?.jahiziyeh || financial?.future_spose_jahiziyeh} />
              <DetailRow label="Jahiziyeh Explanation" value={financial?.jahiziyeh_explantion || financial?.future_spose_jahiziyeh_explanation} />
            </div>
          </div>
        )}

        {activeTab === 'marriage' && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-gray-800">
                {t("Marriage Experience & History")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                <DetailRow label="Prior Marriage Experience" value={birth?.marriage_experince} badge />
                <DetailRow label="Marriage Status" value={birth?.marriage_status} />
                <DetailRow label="Marriage Experience Status" value={engagement?.status} />
                <DetailRow label="Contract Length" value={engagement?.contract_length} />
                <DetailRow label="Living Length" value={engagement?.living_length} />
                {engagement?.divorce_date && <DetailRow label="Divorce Date" value={formatDate(engagement.divorce_date, isRTL)} />}
                {engagement?.death_date && <DetailRow label="Spouse Death Date" value={formatDate(engagement.death_date, isRTL)} />}
                <DetailRow label="Reason for Divorce or Death" value={engagement?.reason_for_divorce_or_death} />
                <DetailRow label="Children" value={birth?.children} />
                <DetailRow label="Children Custody" value={birth?.children_custody} />
              </div>
            </div>

            {/* Children List from Previous Marriage (No birth date shown for privacy) */}
            {childrenList.length > 0 && (
              <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-gray-400">
                  {t("Children from Prior Marriage")} ({childrenList.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {childrenList.map((ch, idx) => (
                    <div key={ch.id || idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-gray-800/40 border border-slate-100 dark:border-gray-800 space-y-1 text-xs">
                      <p className="font-bold text-slate-800 dark:text-gray-200">
                        #{idx + 1} {t("Child")}: {ch.gender ? t(ch.gender) : '—'}
                      </p>
                      <p className="text-slate-500 dark:text-gray-400">
                        {t("Custody")}: {ch.custody ? t(ch.custody) : '—'}
                      </p>
                      {ch.living_location && (
                        <p className="text-slate-500 dark:text-gray-400">
                          {t("Living Location")}: {ch.living_location}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'preferred' && (
          <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-gray-800">
              {t("Preferred Future Spouse Criteria")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              <DetailRow label="Desired Appearance" value={prefIntellectual?.appearance_type} />
              <DetailRow label="Acceptable Age Difference" value={prefIntellectual?.age_difference} />
              <DetailRow label="Family Religious Status Importance" value={prefIntellectual?.future_spouse_family_religious_status_importance} />
              <DetailRow label="Family Financial Status Importance" value={prefIntellectual?.future_spouse_family_financial_status_importance} />
              <DetailRow label="Prior Marriage Experience Acceptance" value={prefIntellectual?.marriage_with_someone_with_marriage_experience} badge />
              <DetailRow label="Marriage Experience Explanation" value={prefIntellectual?.additional_explnation_marriage_with_someone || prefIntellectual?.marriage_with_someone_explanation} />
              <DetailRow label="Most Important Moral Feature" value={prefIntellectual?.most_important_moral_feature_of_future_spouse || prefIntellectual?.most_important_moral_feature} />
              <DetailRow label="Marriage with Disabled Person" value={prefIntellectual?.marriage_with_disabled || prefIntellectual?.marriage_with_disabled_person} />
              <DetailRow label="Marriage with Veteran" value={prefIntellectual?.marriage_with_veteran || prefIntellectual?.marriage_with_veteran_person} />
              <DetailRow label="Disabled / Veteran Explanation" value={prefIntellectual?.marriage_with_veteran_disabled_explanation || prefIntellectual?.marriage_disabled_veteran_explanation} />
              <DetailRow label="Red Flags / Don'ts" value={prefIntellectual?.red_flags} />
              <DetailRow label="Education Expectation" value={prefPersonal?.education || prefPersonal?.education_level} />
              <DetailRow label="Field of Study" value={prefPersonal?.field_of_study} />
              <DetailRow label="Desired Career" value={prefPersonal?.future_spouse_job} />
              <DetailRow label="Current Residence Location Preference" value={prefPersonal?.current_residence_location} />
              <DetailRow label="Location After Marriage" value={prefPersonal?.after_marriage_residence_location} />
              <DetailRow
                label="Preferred Height Range"
                value={
                  prefPhysical?.height_min || prefPhysical?.height_max
                    ? `${prefPhysical.height_min ? formatHeight(prefPhysical.height_min, isRTL) : '—'} ${isRTL ? 'تا' : 'to'} ${prefPhysical.height_max ? formatHeight(prefPhysical.height_max, isRTL) : '—'}`
                    : '—'
                }
              />
              <DetailRow
                label="Preferred Weight Range"
                value={
                  prefPhysical?.weight_min || prefPhysical?.weight_max
                    ? `${prefPhysical.weight_min ? formatWeight(prefPhysical.weight_min, isRTL) : '—'} ${isRTL ? 'تا' : 'to'} ${prefPhysical.weight_max ? formatWeight(prefPhysical.weight_max, isRTL) : '—'}`
                    : '—'
                }
              />
              <DetailRow label="Preferred Skin Color" value={prefPhysical?.skin_color} />
              <DetailRow
                label="Preferred Ethnicities / Originalities"
                value={
                  prefOriginalities.length > 0
                    ? prefOriginalities.map((o) => o.future_spouse_originality || o.future_spouse_ethnicity)
                    : '—'
                }
              />
              <DetailRow label="Additional Criteria / Explanations" value={prefExtra?.additional_explanations} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
