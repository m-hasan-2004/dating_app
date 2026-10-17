'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/context/LanguageContext';
import { formatDate, formatIranianPhoneNumber, toPersianDigits } from '@/utils/formatters';
import {
  getUser,
  fetchPersonalInformation,
  fetchPhysicalInformation,
  fetchIdentityInformation,
  fetchBirthCertificateInformation,
  fetchFamilyInformation,
  fetchEngagementOrWeddingStatus,
  fetchMothers,
  fetchFathers,
  fetchFinancialInformation,
  fetchIntellectualInformation,
  fetchPreferredWifeIntellectualInformation,
  fetchPreferredWifePersonalInformation,
  fetchPreferredWifePhysicalInformation,
  fetchPreferredWifeExtraInformation,
  fetchSubjectDetails,
  updateUser,
  extractFirst,
  type User,
  type PersonalInformation,
  type PhysicalInformation,
  type IdentityInformation,
  type BirthCertificateInformation,
  type FamilyInformation,
  type EngagementOrWeddingStatus,
  type Mother,
  type Father,
  type FinancialInformation,
  type IntellectualInformation,
  type PreferredWifeIntellectualInformation,
  type PreferredWifePersonalInformation,
  type PreferredWifePhysicalInformation,
  type PreferredWifeExtraInformation,
  type SubjectDetails,
} from '@/services/profileService';
import {
  fetchSisters,
  fetchBrothers,
  fetchGrooms,
  fetchBrideOrWives,
  fetchExHusbandChildStatuses,
  fetchFutureSpouseOriginalities,
  fetchIntroducedSubjectsInformation,
  type Sister,
  type Brother,
  type Groom,
  type BrideOrWife,
  type ExHusbandChildStatus,
  type FutureSposeOriginality,
  type IntroducedSubjectsInformation,
} from '@/services/profileMultiService';
import { PersonalsInformationSection } from '@/components/profile/sections/PersonalSections';
import { IdentityInformationSection, BirthCertificateSection } from '@/components/profile/sections/IdentitySections';
import {
  PhysicalInformationSection,
  FamilyInformationSection,
  EngagementStatusSection,
} from '@/components/profile/sections/PhysicalFamilySections';
import {
  ExHusbandChildStatusSection,
  SistersSection,
  BrothersSection,
  GroomsSection,
  BridesWivesSection,
} from '@/components/profile/sections/ChildrenRelativesSections';
import { MotherSection, FatherSection } from '@/components/profile/sections/ParentsSections';
import {
  FinancialInformationSection,
  IntellectualInformationSection,
} from '@/components/profile/sections/FinancialIntellectualSections';
import {
  FutureSpouseOriginalitiesSection,
  PreferredWifeIntellectualSection,
  PreferredWifePersonalSection,
  PreferredWifePhysicalSection,
  PreferredWifeExtraSection,
} from '@/components/profile/sections/PreferredWifeSections';
import {
  IntroducedSubjectsSection,
  SubjectDetailsSection,
} from '@/components/profile/sections/SubjectSections';
import { ChevronDownIcon, ChevronUpIcon, PencilIcon } from '@/icons';
import { Modal } from '@/components/ui/modal';
import { formatApiError, bottomErrorMessage } from '@/utils/errorFormatter';

interface ProfileData {
  user: User | null;
  personalInfo: PersonalInformation | null;
  physicalInfo: PhysicalInformation | null;
  identityInfo: IdentityInformation | null;
  birthCertInfo: BirthCertificateInformation | null;
  familyInfo: FamilyInformation | null;
  engagementStatus: EngagementOrWeddingStatus | null;
  mother: Mother | null;
  father: Father | null;
  financialInfo: FinancialInformation | null;
  intellectualInfo: IntellectualInformation | null;
  prefWifeIntellectual: PreferredWifeIntellectualInformation | null;
  prefWifePersonal: PreferredWifePersonalInformation | null;
  prefWifePhysical: PreferredWifePhysicalInformation | null;
  prefWifeExtra: PreferredWifeExtraInformation | null;
  subjectDetails: SubjectDetails | null;
  sisters: Sister[];
  brothers: Brother[];
  grooms: Groom[];
  bridesWives: BrideOrWife[];
  exHusbandChildren: ExHusbandChildStatus[];
  futureSpouseOriginalities: FutureSposeOriginality[];
  introducedSubjects: IntroducedSubjectsInformation[];
}

const SECTION_KEYS = [
  'personalInfo',
  'identityInfo',
  'birthCertInfo',
  'physicalInfo',
  'familyInfo',
  'engagementStatus',
  'exHusbandChildren',
  'sisters',
  'brothers',
  'grooms',
  'bridesWives',
  'mother',
  'father',
  'financialInfo',
  'intellectualInfo',
  'prefWifeIntellectual',
  'futureSpouseOriginalities',
  'prefWifePersonal',
  'prefWifePhysical',
  'prefWifeExtra',
  'introducedSubjects',
  'subjectDetails',
] as const;

async function safeFirst<T>(fn: () => Promise<any>): Promise<T | null> {
  try { const r = await fn(); return extractFirst<T>(r) ?? null; } catch { return null; }
}
async function safeList<T>(fn: () => Promise<any>): Promise<T[]> {
  try { const r = await fn(); return Array.isArray(r) ? r : (r?.results ?? []); } catch { return []; }
}

export function FullProfileView({
  userId,
  backUrl,
  hideAdminSections,
}: {
  userId?: string;
  backUrl?: string;
  hideAdminSections?: boolean;
}) {
  const { user: authUser } = useAuth();
  const { t, isRTL } = useTranslation();

  const [data, setData] = useState<ProfileData>({
    user: null, personalInfo: null, physicalInfo: null, identityInfo: null,
    birthCertInfo: null, familyInfo: null, engagementStatus: null, mother: null,
    father: null, financialInfo: null, intellectualInfo: null, prefWifeIntellectual: null,
    prefWifePersonal: null, prefWifePhysical: null, prefWifeExtra: null,
    subjectDetails: null, sisters: [], brothers: [], grooms: [], bridesWives: [],
    exHusbandChildren: [], futureSpouseOriginalities: [], introducedSubjects: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    SECTION_KEYS.forEach((k) => {
      init[k] = true;
    });
    return init;
  });

  const shouldHideAdminSections = hideAdminSections !== undefined ? hideAdminSections : !userId;

  const visibleSectionKeys = useMemo(() => {
    return SECTION_KEYS.filter((k) => {
      if (shouldHideAdminSections && (k === 'introducedSubjects' || k === 'subjectDetails')) {
        return false;
      }
      return true;
    });
  }, [shouldHideAdminSections]);

  const allCollapsed = visibleSectionKeys.every((k) => !!collapsedSections[k]);

  // Change account info modal state (Email, Phone, Middle Man Code, Password)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountForm, setAccountForm] = useState({
    email: '',
    phone_number: '',
    middle_man_code: '',
    password: '',
    confirmPassword: '',
  });
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountError, setAccountError] = useState('');
  const [accountFieldErrors, setAccountFieldErrors] = useState<Record<string, string>>({});
  const [accountSuccess, setAccountSuccess] = useState('');

  const handleAccountFieldChange = (field: string, value: string) => {
    setAccountForm((prev) => ({ ...prev, [field]: value }));
    setAccountFieldErrors((prev) => {
      if (!prev[field] && !(field === 'password' && prev.new_password) && !(field === 'confirmPassword' && (prev.password2 || prev.confirm_password))) {
        return prev;
      }
      const next = { ...prev };
      delete next[field];
      if (field === 'password') delete next.new_password;
      if (field === 'confirmPassword') {
        delete next.password2;
        delete next.confirm_password;
      }
      return next;
    });
    if (accountError) {
      setAccountError('');
    }
  };

  const closeAccountModal = () => {
    setIsAccountModalOpen(false);
    setAccountFieldErrors({});
    setAccountError('');
    setAccountSuccess('');
  };

  const openAccountModal = () => {
    setAccountForm({
      email: displayUser?.email || '',
      phone_number: displayUser?.phone_number || '',
      middle_man_code: displayUser?.middle_man_code || '',
      password: '',
      confirmPassword: '',
    });
    setAccountFieldErrors({});
    setAccountError('');
    setAccountSuccess('');
    setIsAccountModalOpen(true);
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError('');
    setAccountFieldErrors({});
    setAccountSuccess('');

    if (accountForm.password || accountForm.confirmPassword) {
      if (accountForm.password.length < 8) {
        setAccountFieldErrors({
          password: t('Password must be at least 8 characters long.'),
        });
        setAccountError(t('Please fix the errors in the form before submitting.'));
        return;
      }
      if (accountForm.password !== accountForm.confirmPassword) {
        setAccountFieldErrors({
          confirmPassword: t('Passwords do not match.'),
        });
        setAccountError(t('Please fix the errors in the form before submitting.'));
        return;
      }
    }

    setAccountLoading(true);
    try {
      const targetId = displayUser?.id;
      if (targetId) {
        const payload: Partial<User> = {
          email: accountForm.email,
          phone_number: accountForm.phone_number,
          middle_man_code: accountForm.middle_man_code,
        };
        if (accountForm.password) {
          payload.password = accountForm.password;
        }
        await updateUser(String(targetId), payload);
        await loadAll();
      }
      setAccountSuccess(t('Account information updated successfully!'));
      setTimeout(() => {
        closeAccountModal();
      }, 1200);
    } catch (err: any) {
      const formatted = formatApiError(err, t, isRTL);
      setAccountFieldErrors(formatted.fieldErrors);
      setAccountError(bottomErrorMessage(formatted, t));
    } finally {
      setAccountLoading(false);
    }
  };

  const toggleCollapseAll = () => {
    if (allCollapsed) {
      // Expand all
      setCollapsedSections({});
    } else {
      // Collapse all
      const next: Record<string, boolean> = {};
      visibleSectionKeys.forEach((k) => {
        next[k] = true;
      });
      setCollapsedSections(next);
    }
  };

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const queryParams = userId ? { user: userId } : undefined;

  const loadAll = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [
        user, personalInfo, physicalInfo, identityInfo, birthCertInfo, familyInfo,
        engagementStatus, mother, father, financialInfo, intellectualInfo,
        prefWifeIntellectual, prefWifePersonal, prefWifePhysical, prefWifeExtra,
        subjectDetails, sisters, brothers, grooms, bridesWives,
        exHusbandChildren, futureSpouseOriginalities, introducedSubjects,
      ] = await Promise.all([
        userId ? getUser(userId).catch(() => null) : Promise.resolve(null),
        safeFirst<PersonalInformation>(() => fetchPersonalInformation(queryParams)),
        safeFirst<PhysicalInformation>(() => fetchPhysicalInformation(queryParams)),
        safeFirst<IdentityInformation>(() => fetchIdentityInformation(queryParams)),
        safeFirst<BirthCertificateInformation>(() => fetchBirthCertificateInformation(queryParams)),
        safeFirst<FamilyInformation>(() => fetchFamilyInformation(queryParams)),
        safeFirst<EngagementOrWeddingStatus>(() => fetchEngagementOrWeddingStatus(queryParams)),
        safeFirst<Mother>(() => fetchMothers(queryParams)),
        safeFirst<Father>(() => fetchFathers(queryParams)),
        safeFirst<FinancialInformation>(() => fetchFinancialInformation(queryParams)),
        safeFirst<IntellectualInformation>(() => fetchIntellectualInformation(queryParams)),
        safeFirst<PreferredWifeIntellectualInformation>(() => fetchPreferredWifeIntellectualInformation(queryParams)),
        safeFirst<PreferredWifePersonalInformation>(() => fetchPreferredWifePersonalInformation(queryParams)),
        safeFirst<PreferredWifePhysicalInformation>(() => fetchPreferredWifePhysicalInformation(queryParams)),
        safeFirst<PreferredWifeExtraInformation>(() => fetchPreferredWifeExtraInformation(queryParams)),
        shouldHideAdminSections ? Promise.resolve(null) : safeFirst<SubjectDetails>(() => fetchSubjectDetails(queryParams)),
        safeList<Sister>(() => fetchSisters(queryParams)),
        safeList<Brother>(() => fetchBrothers(queryParams)),
        safeList<Groom>(() => fetchGrooms(queryParams)),
        safeList<BrideOrWife>(() => fetchBrideOrWives(queryParams)),
        safeList<ExHusbandChildStatus>(() => fetchExHusbandChildStatuses(queryParams)),
        safeList<FutureSposeOriginality>(() => fetchFutureSpouseOriginalities(queryParams)),
        shouldHideAdminSections ? Promise.resolve([]) : safeList<IntroducedSubjectsInformation>(() => fetchIntroducedSubjectsInformation(queryParams)),
      ]);
      setData({
        user, personalInfo, physicalInfo, identityInfo, birthCertInfo, familyInfo,
        engagementStatus, mother, father, financialInfo, intellectualInfo,
        prefWifeIntellectual, prefWifePersonal, prefWifePhysical, prefWifeExtra,
        subjectDetails, sisters, brothers, grooms, bridesWives,
        exHusbandChildren, futureSpouseOriginalities, introducedSubjects,
      });
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load profile');
    } finally { setLoading(false); }
  }, [userId, shouldHideAdminSections]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const displayUser = data.user || authUser;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <p className="text-sm text-gray-500">{t('Loading profile data...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-6 py-8 text-center">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        <button onClick={loadAll} className="mt-3 text-sm font-medium text-red-600 hover:underline">{t('Retry')}</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {backUrl && (
            <Link href={backUrl} className="text-sm text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
              {isRTL ? '→ بازگشت' : '← Back'}
            </Link>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {displayUser?.username
                ? isRTL
                  ? `پروفایل ${displayUser.username}`
                  : `${displayUser.username}'s Profile`
                : t('Complete Profile')}
            </h1>
            {displayUser?.email && <p className="text-sm text-slate-500 dark:text-gray-400">{displayUser.email}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Saved Bookmarks Shortcut */}
          <Link
            href="/profile/bookmarks"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors shadow-xs"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span>{t('Saved Bookmarks')}</span>
          </Link>

          {/* Global Collapse All / Expand All button */}
          <button
            type="button"
            onClick={toggleCollapseAll}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700/60 transition-colors shadow-2xs"
          >
            {allCollapsed ? (
              <>
                <ChevronDownIcon className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>{t('Expand All')}</span>
              </>
            ) : (
              <>
                <ChevronUpIcon className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>{t('Collapse All')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {displayUser && (
        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-gray-800 dark:bg-white/[0.03] px-6 py-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{t('Account Info')}</h3>
            <button
              type="button"
              onClick={openAccountModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700/60 transition-colors shadow-2xs cursor-pointer"
            >
              <PencilIcon className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              {t('Change Account Info')}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div className="flex gap-2"><span className="text-slate-500 dark:text-gray-400 shrink-0">{t('Username')}:</span><span className="text-slate-900 dark:text-white font-medium">{displayUser.username}</span></div>
            <div className="flex gap-2"><span className="text-slate-500 dark:text-gray-400 shrink-0">{t('Email')}:</span><span className="text-slate-900 dark:text-white font-medium">{displayUser.email}</span></div>
            <div className="flex gap-2"><span className="text-slate-500 dark:text-gray-400 shrink-0">{t('Phone')}:</span><span className="text-slate-900 dark:text-white font-medium font-mono">{formatIranianPhoneNumber(displayUser.phone_number, isRTL)}</span></div>
            <div className="flex gap-2"><span className="text-slate-500 dark:text-gray-400 shrink-0">{t('Middle Man Code')}:</span><span className="text-slate-900 dark:text-white font-medium">{displayUser.middle_man_code ? (isRTL ? toPersianDigits(displayUser.middle_man_code) : displayUser.middle_man_code) : '—'}</span></div>
            <div className="flex gap-2"><span className="text-slate-500 dark:text-gray-400 shrink-0">{t('Status')}:</span>
              <span className={displayUser.is_active ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-red-600 dark:text-red-400 font-semibold'}>
                {displayUser.is_active ? t('Active') : t('Inactive')}
              </span>
            </div>
            <div className="flex gap-2"><span className="text-slate-500 dark:text-gray-400 shrink-0">{t('Joined')}:</span><span className="text-slate-900 dark:text-white font-medium">{displayUser.date_joined ? formatDate(displayUser.date_joined, isRTL) : '—'}</span></div>
          </div>
        </div>
      )}

      {/* Single Record Profile Sections */}
      <PersonalsInformationSection
        data={data.personalInfo}
        onReload={loadAll}
        isCollapsed={!!collapsedSections['personalInfo']}
        onToggleCollapse={() => toggleSection('personalInfo')}
      />
      <IdentityInformationSection
        data={data.identityInfo}
        onReload={loadAll}
        isCollapsed={!!collapsedSections['identityInfo']}
        onToggleCollapse={() => toggleSection('identityInfo')}
      />
      <BirthCertificateSection
        data={data.birthCertInfo}
        onReload={loadAll}
        isCollapsed={!!collapsedSections['birthCertInfo']}
        onToggleCollapse={() => toggleSection('birthCertInfo')}
      />
      <PhysicalInformationSection
        data={data.physicalInfo}
        onReload={loadAll}
        isCollapsed={!!collapsedSections['physicalInfo']}
        onToggleCollapse={() => toggleSection('physicalInfo')}
      />
      <FamilyInformationSection
        data={data.familyInfo}
        onReload={loadAll}
        isCollapsed={!!collapsedSections['familyInfo']}
        onToggleCollapse={() => toggleSection('familyInfo')}
      />
      <EngagementStatusSection
        data={data.engagementStatus}
        onReload={loadAll}
        isCollapsed={!!collapsedSections['engagementStatus']}
        onToggleCollapse={() => toggleSection('engagementStatus')}
      />

      {/* Relatives / Multi-record sections */}
      <ExHusbandChildStatusSection
        records={data.exHusbandChildren}
        onReload={loadAll}
        isCollapsed={!!collapsedSections['exHusbandChildren']}
        onToggleCollapse={() => toggleSection('exHusbandChildren')}
      />
      <SistersSection
        records={data.sisters}
        onReload={loadAll}
        isCollapsed={!!collapsedSections['sisters']}
        onToggleCollapse={() => toggleSection('sisters')}
      />
      <BrothersSection
        records={data.brothers}
        onReload={loadAll}
        isCollapsed={!!collapsedSections['brothers']}
        onToggleCollapse={() => toggleSection('brothers')}
      />
      <GroomsSection
        records={data.grooms}
        onReload={loadAll}
        isCollapsed={!!collapsedSections['grooms']}
        onToggleCollapse={() => toggleSection('grooms')}
      />
      <BridesWivesSection
        records={data.bridesWives}
        onReload={loadAll}
        isCollapsed={!!collapsedSections['bridesWives']}
        onToggleCollapse={() => toggleSection('bridesWives')}
      />

      {/* Parents */}
      <MotherSection
        data={data.mother}
        onReload={loadAll}
        isCollapsed={!!collapsedSections['mother']}
        onToggleCollapse={() => toggleSection('mother')}
      />
      <FatherSection
        data={data.father}
        onReload={loadAll}
        isCollapsed={!!collapsedSections['father']}
        onToggleCollapse={() => toggleSection('father')}
      />

      {/* Financial & Intellectual */}
      <FinancialInformationSection
        data={data.financialInfo}
        onReload={loadAll}
        isCollapsed={!!collapsedSections['financialInfo']}
        onToggleCollapse={() => toggleSection('financialInfo')}
      />
      <IntellectualInformationSection
        data={data.intellectualInfo}
        onReload={loadAll}
        isCollapsed={!!collapsedSections['intellectualInfo']}
        onToggleCollapse={() => toggleSection('intellectualInfo')}
      />

      {/* Preferred Wife Sections */}
      <PreferredWifeIntellectualSection
        data={data.prefWifeIntellectual}
        onReload={loadAll}
        isCollapsed={!!collapsedSections['prefWifeIntellectual']}
        onToggleCollapse={() => toggleSection('prefWifeIntellectual')}
      />
      <FutureSpouseOriginalitiesSection
        records={data.futureSpouseOriginalities}
        onReload={loadAll}
        isCollapsed={!!collapsedSections['futureSpouseOriginalities']}
        onToggleCollapse={() => toggleSection('futureSpouseOriginalities')}
      />
      <PreferredWifePersonalSection
        data={data.prefWifePersonal}
        onReload={loadAll}
        isCollapsed={!!collapsedSections['prefWifePersonal']}
        onToggleCollapse={() => toggleSection('prefWifePersonal')}
      />
      <PreferredWifePhysicalSection
        data={data.prefWifePhysical}
        onReload={loadAll}
        isCollapsed={!!collapsedSections['prefWifePhysical']}
        onToggleCollapse={() => toggleSection('prefWifePhysical')}
      />
      <PreferredWifeExtraSection
        data={data.prefWifeExtra}
        onReload={loadAll}
        isCollapsed={!!collapsedSections['prefWifeExtra']}
        onToggleCollapse={() => toggleSection('prefWifeExtra')}
      />

      {/* Admin / System Sections - Shown only on admin user profile view */}
      {!shouldHideAdminSections && (
        <>
          <IntroducedSubjectsSection
            records={data.introducedSubjects}
            onReload={loadAll}
            isCollapsed={!!collapsedSections['introducedSubjects']}
            onToggleCollapse={() => toggleSection('introducedSubjects')}
          />
          <SubjectDetailsSection
            data={data.subjectDetails}
            onReload={loadAll}
            isCollapsed={!!collapsedSections['subjectDetails']}
            onToggleCollapse={() => toggleSection('subjectDetails')}
          />
        </>
      )}

      {/* Change Account Information Modal */}
      <Modal
        isOpen={isAccountModalOpen}
        onClose={closeAccountModal}
        showCloseButton={false}
        className="p-6 max-w-lg w-full"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] dark:bg-[var(--color-primary)]/20 dark:text-[var(--color-primary)] flex items-center justify-center">
              <PencilIcon className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('Change Account Information')}
            </h3>
          </div>
          <button
            type="button"
            onClick={closeAccountModal}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleAccountSubmit} className="space-y-4 pt-4">
          {accountSuccess && (
            <div className="p-3 text-xs rounded-xl bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400 border border-green-200 dark:border-green-800">
              {accountSuccess}
            </div>
          )}

          {/* 1. Email */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-gray-300 mb-1">
              {t('Email Address')}
            </label>
            <input
              type="email"
              placeholder="user@example.com"
              value={accountForm.email}
              onChange={(e) => handleAccountFieldChange('email', e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-xl bg-white text-slate-800 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 ${
                accountFieldErrors.email
                  ? 'border-red-500 ring-1 ring-red-500 bg-red-50/10 text-red-900 dark:text-red-200 focus:border-red-500 focus:ring-red-500'
                  : 'border-slate-300 dark:border-gray-700 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]'
              }`}
            />
            {accountFieldErrors.email && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium flex items-center gap-1">
                {accountFieldErrors.email}
              </p>
            )}
          </div>

          {/* 2. Phone Number */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-gray-300 mb-1">
              {t('Phone Number')}
            </label>
            <input
              type="text"
              placeholder={isRTL ? "۰۹..." : "+989..."}
              value={accountForm.phone_number}
              onChange={(e) => handleAccountFieldChange('phone_number', e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-xl bg-white text-slate-800 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 ${
                accountFieldErrors.phone_number
                  ? 'border-red-500 ring-1 ring-red-500 bg-red-50/10 text-red-900 dark:text-red-200 focus:border-red-500 focus:ring-red-500'
                  : 'border-slate-300 dark:border-gray-700 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]'
              }`}
            />
            {accountFieldErrors.phone_number && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium flex items-center gap-1">
                {accountFieldErrors.phone_number}
              </p>
            )}
          </div>

          {/* 3. Middle Man Code */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-gray-300 mb-1">
              {t('Middle Man Code')}
            </label>
            <input
              type="text"
              placeholder={t('Enter reference or middle man code')}
              value={accountForm.middle_man_code}
              onChange={(e) => handleAccountFieldChange('middle_man_code', e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-xl bg-white text-slate-800 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 ${
                accountFieldErrors.middle_man_code
                  ? 'border-red-500 ring-1 ring-red-500 bg-red-50/10 text-red-900 dark:text-red-200 focus:border-red-500 focus:ring-red-500'
                  : 'border-slate-300 dark:border-gray-700 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]'
              }`}
            />
            {accountFieldErrors.middle_man_code && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium flex items-center gap-1">
                {accountFieldErrors.middle_man_code}
              </p>
            )}
          </div>

          {/* 4. Password (Optional) */}
          <div className="pt-2 border-t border-slate-100 dark:border-gray-800">
            <p className="text-xs font-semibold text-slate-700 dark:text-gray-300 mb-3">
              {t('Change Password (Optional)')}
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 dark:text-gray-400 mb-1">
                  {t('New Password (leave blank to keep unchanged)')}
                </label>
                <input
                  type="password"
                  minLength={8}
                  placeholder={t('Min. 8 characters')}
                  value={accountForm.password}
                  onChange={(e) => handleAccountFieldChange('password', e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-xl bg-white text-slate-800 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 ${
                    accountFieldErrors.password || accountFieldErrors.new_password
                      ? 'border-red-500 ring-1 ring-red-500 bg-red-50/10 text-red-900 dark:text-red-200 focus:border-red-500 focus:ring-red-500'
                      : 'border-slate-300 dark:border-gray-700 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]'
                  }`}
                />
                {(accountFieldErrors.password || accountFieldErrors.new_password) && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium flex items-center gap-1">
                    {accountFieldErrors.password || accountFieldErrors.new_password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs text-slate-500 dark:text-gray-400 mb-1">
                  {t('Confirm New Password')}
                </label>
                <input
                  type="password"
                  minLength={8}
                  placeholder={t('Confirm new password')}
                  value={accountForm.confirmPassword}
                  onChange={(e) => handleAccountFieldChange('confirmPassword', e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-xl bg-white text-slate-800 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 ${
                    accountFieldErrors.confirmPassword || accountFieldErrors.password2 || accountFieldErrors.confirm_password
                      ? 'border-red-500 ring-1 ring-red-500 bg-red-50/10 text-red-900 dark:text-red-200 focus:border-red-500 focus:ring-red-500'
                      : 'border-slate-300 dark:border-gray-700 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]'
                  }`}
                />
                {(accountFieldErrors.confirmPassword || accountFieldErrors.password2 || accountFieldErrors.confirm_password) && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium flex items-center gap-1">
                    {accountFieldErrors.confirmPassword || accountFieldErrors.password2 || accountFieldErrors.confirm_password}
                  </p>
                )}
              </div>
            </div>
          </div>

          {accountError && <p className="mt-3 text-sm text-red-500">{accountError}</p>}

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-gray-800">
            <button
              type="button"
              onClick={closeAccountModal}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors shadow-2xs"
            >
              {t('Cancel')}
            </button>
            <button
              type="submit"
              disabled={accountLoading}
              className="px-4 py-2 text-xs font-medium rounded-xl bg-[var(--color-primary)] text-white hover:brightness-95 disabled:opacity-50 transition-colors shadow-xs"
            >
              {accountLoading ? t('Saving...') : t('Save Changes')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default FullProfileView;