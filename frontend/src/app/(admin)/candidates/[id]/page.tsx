'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/services/api/client';
import { toggleBookmark } from '@/services/profileService';
import {
  ChevronLeftIcon,
  CheckCircleIcon,
  UserCircleIcon,
} from '@/icons';

export default function PublicCandidateProfilePage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'personal' | 'physical' | 'intellectual' | 'family' | 'financial' | 'preferred'>('overview');
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
        mothRes, fathRes, sisRes, broRes, bmRes
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
  const isFemale = personal?.gender === 'woman' || personal?.gender === 'female' || personal?.gender === 'girl';

  const DetailRow = ({ label, value, badge }: { label: string; value?: any; badge?: boolean }) => {
    let display = value;
    if (value === true) display = 'Yes (بله)';
    else if (value === false) display = 'No (خیر)';
    else if (Array.isArray(value)) display = value.length ? value.join(', ') : '—';
    else if (!value) display = '—';

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-800/80 last:border-0 gap-1">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
        {badge && display !== '—' ? (
          <span className="inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 w-fit">
            {display}
          </span>
        ) : (
          <span className="text-xs font-semibold text-gray-900 dark:text-white sm:text-right break-words max-w-md">
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
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Candidate Not Found</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{error || 'This candidate profile is not available or inactive.'}</p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-2xl bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow-sm"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Back to Candidate Search
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-brand-500 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          <span>Back to Candidate Directory</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleBookmark}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-2xl transition-all cursor-pointer border ${
              isBookmarked
                ? 'bg-amber-100 text-amber-600 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-700 shadow-xs'
                : 'bg-white text-gray-700 border-gray-200 hover:border-amber-400 hover:text-amber-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
            }`}
          >
            <svg className={`w-4 h-4 ${isBookmarked ? 'fill-current text-amber-500' : 'fill-none stroke-current stroke-2'}`} viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span>{isBookmarked ? 'Bookmarked Candidate' : 'Bookmark Candidate'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header Banner */}
      <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden shadow-sm">
        <div className={`h-36 ${isFemale ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600' : 'bg-gradient-to-r from-brand-500 via-indigo-600 to-blue-600'} p-6 relative flex items-end justify-between`}>
          <span className="absolute top-4 right-4 px-3 py-1 text-[11px] font-bold rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
            Public Verified Candidate Profile
          </span>
        </div>

        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <div className={`w-24 h-24 rounded-3xl border-4 border-white dark:border-gray-900 shadow-xl flex items-center justify-center font-extrabold text-2xl text-white ${
              isFemale ? 'bg-pink-600' : 'bg-brand-600'
            }`}>
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">@{user.username}</h1>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active"></span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {age ? `${age} years old` : 'Age: —'} • {personal?.birth_location || 'Location: —'} • Registered Member
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end gap-2 text-xs">
            {personal?.education && (
              <span className="px-3 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">
                🎓 {personal.education}
              </span>
            )}
            {financial?.job && (
              <span className="px-3 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">
                💼 {financial.job}
              </span>
            )}
            {birth?.marriage_experince === 'no' ? (
              <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold">
                Never Married
              </span>
            ) : birth?.marriage_experince === 'yes' ? (
              <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 font-semibold">
                Divorced / Has Experience
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Highlights Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-gray-800 text-center">
          <span className="text-[11px] font-medium text-gray-400">Height / Weight</span>
          <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
            {physical?.height ? `${physical.height} cm` : '—'} / {physical?.weight ? `${physical.weight} kg` : '—'}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-gray-800 text-center">
          <span className="text-[11px] font-medium text-gray-400">Housing</span>
          <p className="text-sm font-bold text-gray-900 dark:text-white mt-1 capitalize">
            {financial?.ownership_status || '—'}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-gray-800 text-center">
          <span className="text-[11px] font-medium text-gray-400">Monthly Income</span>
          <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
            {personal?.income || '—'}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-gray-800 text-center">
          <span className="text-[11px] font-medium text-gray-400">Skin Complexion</span>
          <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
            {physical?.skin_color || '—'}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-gray-800 text-center">
          <span className="text-[11px] font-medium text-gray-400">Prayer Status</span>
          <p className="text-sm font-bold text-gray-900 dark:text-white mt-1 capitalize">
            {intellectual?.worship_and_prayer || intellectual?.worship_prayer || '—'}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-gray-800 text-center">
          <span className="text-[11px] font-medium text-gray-400">Society Cover</span>
          <p className="text-sm font-bold text-gray-900 dark:text-white mt-1 capitalize">
            {intellectual?.cover_type_society || '—'}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 dark:border-gray-800 scrollbar-none">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'personal', label: 'Personal & Lifestyle' },
          { key: 'physical', label: 'Physical & Health' },
          { key: 'intellectual', label: 'Religious & Beliefs' },
          { key: 'family', label: 'Family Heritage' },
          { key: 'financial', label: 'Housing & Financial' },
          { key: 'preferred', label: 'Spouse Criteria' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 text-xs font-semibold rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'bg-brand-500 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                <span>👤</span> Personal & Identity
              </h3>
              <DetailRow label="Birth Location / City" value={personal?.birth_location} />
              <DetailRow label="Age" value={age ? `${age} years old` : '—'} />
              <DetailRow label="Education Degree" value={personal?.education} badge />
              <DetailRow label="Major / Degree Details" value={personal?.degree} />
              <DetailRow label="Sadat Lineage (سید)" value={personal?.sadat} />
              <DetailRow label="Military Status" value={personal?.military_status} />
              <DetailRow label="Insurance Status" value={personal?.have_insurance} />
              <DetailRow label="Leisure & Hobbies" value={personal?.leisure_type} />
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                <span>🕌</span> Religious & Intellectual Outlook
              </h3>
              <DetailRow label="Prayer & Worship" value={intellectual?.worship_and_prayer || intellectual?.worship_prayer} badge />
              <DetailRow label="Fasting (روزه)" value={intellectual?.fasting} />
              <DetailRow label="Society Cover / Hijab" value={intellectual?.cover_type_society} badge />
              <DetailRow label="Velayat Faqih View" value={intellectual?.opinion_velayat_faqih || intellectual?.opinion_about_velayat_faqih} />
              <DetailRow label="Religious Gatherings" value={intellectual?.participating_in_religious_meetings || intellectual?.participating_prayer_quran_meetings} />
              <DetailRow label="Music & Assemblies" value={intellectual?.music} />
              <DetailRow label="Marriage Goals" value={intellectual?.marriage_goals_purposes} />
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                <span>💰</span> Financial & Living
              </h3>
              <DetailRow label="Career / Job" value={financial?.job} badge />
              <DetailRow label="Housing Ownership" value={financial?.ownership_status} />
              <DetailRow label="Current Residence" value={financial?.current_residence_status} />
              <DetailRow label="Assets & Capital" value={financial?.capital} />
              <DetailRow label="Expected Dowry Types" value={financial?.future_spouse_dowry_type} />
              <DetailRow label="Dowry Amount" value={financial?.future_spose_dowry_amount} />
              <DetailRow label="Jahiziyeh" value={financial?.future_spose_jahiziyeh} />
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                <span>🎯</span> Desired Future Spouse Criteria
              </h3>
              <DetailRow label="Desired Appearance" value={prefIntellectual?.appearance_type} />
              <DetailRow label="Acceptable Age Difference" value={prefIntellectual?.age_difference} />
              <DetailRow label="Prior Marriage Experience" value={prefIntellectual?.marriage_with_someone_with_marriage_experience} />
              <DetailRow label="Education Requirement" value={prefPersonal?.education_level} />
              <DetailRow label="Spouse Career Preference" value={prefPersonal?.future_spouse_job} />
              <DetailRow label="Location After Marriage" value={prefPersonal?.after_marriage_residence_location} />
              <DetailRow label="Most Important Moral Feature" value={prefIntellectual?.most_important_moral_feature || prefIntellectual?.most_important_moral_feature_of_future_spouse} />
            </div>
          </div>
        )}

        {activeTab === 'personal' && (
          <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-800">
              Personal Information & Lifestyle
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              <DetailRow label="Gender" value={personal?.gender} />
              <DetailRow label="Birth Location" value={personal?.birth_location} />
              <DetailRow label="Sadat Lineage" value={personal?.sadat} />
              <DetailRow label="Education" value={personal?.education} badge />
              <DetailRow label="Field / Degree" value={personal?.degree} />
              <DetailRow label="Military Status" value={personal?.military_status} />
              <DetailRow label="Military Status Explanation" value={personal?.military_status_explanation} />
              <DetailRow label="Monthly Income" value={personal?.income} />
              <DetailRow label="Deposit / Savings" value={personal?.deposit} />
              <DetailRow label="Insurance" value={personal?.have_insurance} />
              <DetailRow label="Insurance Types" value={personal?.insurance_type} />
              <DetailRow label="Leisure Types" value={personal?.leisure_type} />
              <DetailRow label="Usage Cases (Tobacco/Hookah)" value={personal?.usage_cases} />
              <DetailRow label="Tattoo" value={personal?.tatto} />
            </div>
          </div>
        )}

        {activeTab === 'physical' && (
          <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-800">
              Physical & Health Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              <DetailRow label="Height" value={physical?.height ? `${physical.height} cm` : '—'} />
              <DetailRow label="Weight" value={physical?.weight ? `${physical.weight} kg` : '—'} />
              <DetailRow label="Skin Color" value={physical?.skin_color} />
              <DetailRow label="Eyes Color" value={physical?.eyes_color} />
              <DetailRow label="Blood Type" value={physical?.blood_type} />
              <DetailRow label="Character & Temperament (طبع و مزاج)" value={physical?.character_and_temperament} badge />
              <DetailRow label="Glasses" value={physical?.glasses} />
              <DetailRow label="Body & Face Appearance" value={physical?.body_and_face} />
              <DetailRow label="Disease / Surgery History" value={physical?.disease_or_surgery_history} />
              <DetailRow label="Medication / Disease Description" value={physical?.medication_surgery_disease_type} />
            </div>
          </div>
        )}

        {activeTab === 'intellectual' && (
          <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-800">
              Religious, Intellectual & Lifestyle Values
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              <DetailRow label="Prayer & Worship" value={intellectual?.worship_and_prayer || intellectual?.worship_prayer} badge />
              <DetailRow label="Fasting (روزه)" value={intellectual?.fasting} />
              <DetailRow label="Cover Type at Home" value={intellectual?.cover_type_house} />
              <DetailRow label="Cover Type in Society" value={intellectual?.cover_type_society} badge />
              <DetailRow label="Religious Meetings" value={intellectual?.participating_in_religious_meetings || intellectual?.participating_prayer_quran_meetings} />
              <DetailRow label="Music assemblies" value={intellectual?.music} />
              <DetailRow label="Dance / Singing Assemblies" value={intellectual?.dance_singing_assemblies} />
              <DetailRow label="Velayat Faqih View" value={intellectual?.opinion_velayat_faqih || intellectual?.opinion_about_velayat_faqih} />
              <DetailRow label="Political Orientation" value={intellectual?.political_orientation} />
              <DetailRow label="Desired Number of Children" value={intellectual?.opinion_child_quantity || intellectual?.opinion_about_child_quantity} />
              <DetailRow label="Opinion on Woman Working" value={intellectual?.opinion_about_womans_job} />
              <DetailRow label="Opinion on Woman Education" value={intellectual?.opinion_about_womans_education} />
              <DetailRow label="Pros of Yourself" value={intellectual?.pros_of_yourself} />
              <DetailRow label="Cons of Yourself" value={intellectual?.cons_of_yourself} />
            </div>
          </div>
        )}

        {activeTab === 'family' && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-800">
                Family Heritage & Parents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                <DetailRow label="Father's Originality / Province" value={father?.originality} badge />
                <DetailRow label="Father's Job" value={father?.job} />
                <DetailRow label="Father's Education" value={father?.education} />
                <DetailRow label="Father Alive" value={father?.alive} />
                <DetailRow label="Mother's Originality / Province" value={mother?.originality} badge />
                <DetailRow label="Mother's Job" value={mother?.job} />
                <DetailRow label="Mother's Education" value={mother?.education} />
                <DetailRow label="Mother Alive" value={mother?.alive} />
                <DetailRow label="Average Family Education" value={family?.average_family_education} />
                <DetailRow label="Average Family Financial Level" value={family?.average_family_finance} />
                <DetailRow label="Family Divorce History" value={family?.family_divorce_history} />
                <DetailRow label="Number of Sisters" value={family?.number_of_sisters ?? sisters.length} />
                <DetailRow label="Number of Brothers" value={family?.number_of_brothers ?? brothers.length} />
              </div>
            </div>

            {(sisters.length > 0 || brothers.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sisters.length > 0 && (
                  <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-sm space-y-3">
                    <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Sisters ({sisters.length})</h4>
                    <div className="space-y-2">
                      {sisters.map((sis, idx) => (
                        <div key={sis.id || idx} className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 text-xs flex justify-between">
                          <span>Sister #{idx + 1}: {sis.education || '—'}</span>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">{sis.job || '—'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {brothers.length > 0 && (
                  <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-sm space-y-3">
                    <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Brothers ({brothers.length})</h4>
                    <div className="space-y-2">
                      {brothers.map((bro, idx) => (
                        <div key={bro.id || idx} className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 text-xs flex justify-between">
                          <span>Brother #{idx + 1}: {bro.education || '—'}</span>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">{bro.job || '—'}</span>
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
          <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-800">
              Financial & Residence Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              <DetailRow label="Occupation / Job" value={financial?.job} badge />
              <DetailRow label="Housing Ownership Status" value={financial?.ownership_status} />
              <DetailRow label="Current Residence Status" value={financial?.current_residence_status} />
              <DetailRow label="Monthly Rent Amount" value={financial?.rent_amount} />
              <DetailRow label="Mortgage Deposit" value={financial?.mortgage_amount} />
              <DetailRow label="Capital & Assets" value={financial?.capital} />
              <DetailRow label="Other Capital / Notes" value={financial?.other_capital} />
              <DetailRow label="Residence After Marriage" value={financial?.after_marriage_residence_status} />
              <DetailRow label="Future Spouse Dowry Types" value={financial?.future_spouse_dowry_type} />
              <DetailRow label="Dowry Amount" value={financial?.future_spose_dowry_amount} />
              <DetailRow label="Jahiziyeh Expectation" value={financial?.future_spose_jahiziyeh} />
            </div>
          </div>
        )}

        {activeTab === 'preferred' && (
          <div className="rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-800">
              Preferred Future Spouse Criteria
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              <DetailRow label="Desired Appearance" value={prefIntellectual?.appearance_type} />
              <DetailRow label="Acceptable Age Difference" value={prefIntellectual?.age_difference} />
              <DetailRow label="Family Religious Status Importance" value={prefIntellectual?.future_spouse_family_religious_status_importance} />
              <DetailRow label="Family Financial Status Importance" value={prefIntellectual?.future_spouse_family_financial_status_importance} />
              <DetailRow label="Prior Marriage Experience Acceptance" value={prefIntellectual?.marriage_with_someone_with_marriage_experience} badge />
              <DetailRow label="Most Important Moral Feature" value={prefIntellectual?.most_important_moral_feature || prefIntellectual?.most_important_moral_feature_of_future_spouse} />
              <DetailRow label="Marriage with Disabled / Veteran" value={prefIntellectual?.marriage_with_disabled || prefIntellectual?.marriage_with_disabled_person} />
              <DetailRow label="Red Flags" value={prefIntellectual?.red_flags} />
              <DetailRow label="Education Expectation" value={prefPersonal?.education_level} />
              <DetailRow label="Desired Career" value={prefPersonal?.future_spouse_job} />
              <DetailRow label="Location After Marriage" value={prefPersonal?.after_marriage_residence_location} />
              <DetailRow label="Preferred Height Range" value={prefPhysical?.height_min || prefPhysical?.height_max ? `${prefPhysical.height_min ?? '—'} to ${prefPhysical.height_max ?? '—'} cm` : '—'} />
              <DetailRow label="Preferred Weight Range" value={prefPhysical?.weight_min || prefPhysical?.weight_max ? `${prefPhysical.weight_min ?? '—'} to ${prefPhysical.weight_max ?? '—'} kg` : '—'} />
              <DetailRow label="Preferred Skin Color" value={prefPhysical?.skin_color} />
              <DetailRow label="Additional Criteria / Explanations" value={prefExtra?.additional_explanations} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
