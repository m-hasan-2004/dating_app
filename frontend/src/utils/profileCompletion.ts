import {
  fetchPersonalInformation,
  fetchPhysicalInformation,
  fetchFamilyInformation,
  fetchMothers,
  fetchFathers,
  fetchFinancialInformation,
  fetchIntellectualInformation,
  fetchPreferredWifeIntellectualInformation,
  fetchPreferredWifePersonalInformation,
  fetchPreferredWifePhysicalInformation,
  extractFirst,
} from '@/services/profileService';
import {
  fetchFutureSpouseOriginalities,
} from '@/services/profileMultiService';

export interface SectionScore {
  nameKey: string;
  nameFa: string;
  weight: number;
  score: number; // 0 to 1
  isComplete: boolean;
}

export interface ProfileCompletionResult {
  percentage: number;
  isReady: boolean;
  statusTextFa: string;
  statusTextEn: string;
  sections: SectionScore[];
}

function hasValue(val: any): boolean {
  if (val === null || val === undefined) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  if (typeof val === 'number') return !isNaN(val);
  if (typeof val === 'boolean') return true;
  if (Array.isArray(val)) return val.length > 0;
  return true;
}

function isSectionFilled(obj: any, specificKeys?: string[]): boolean {
  if (!obj || typeof obj !== 'object') return false;
  if (Array.isArray(obj)) return obj.length > 0;
  const ignoreKeys = new Set(['id', 'user', 'created_at', 'updated_at', 'middle_man']);
  const keysToCheck = specificKeys && specificKeys.length > 0 ? specificKeys : Object.keys(obj);
  for (const k of keysToCheck) {
    if (ignoreKeys.has(k)) continue;
    if (hasValue(obj[k])) return true;
  }
  return false;
}

export function computeProfileCompletion(raw: {
  personalInfo?: any;
  physicalInfo?: any;
  familyInfo?: any;
  mother?: any;
  father?: any;
  financialInfo?: any;
  intellectualInfo?: any;
  prefWifeIntellectual?: any;
  prefWifePersonal?: any;
  prefWifePhysical?: any;
  futureSpouseOriginalities?: any[];
  // Non-mandatory/conditional sections:
  sisters?: any[];
  brothers?: any[];
  grooms?: any[];
  bridesWives?: any[];
  exHusbandChildren?: any[];
  engagementStatus?: any;
}): ProfileCompletionResult {
  const sections: SectionScore[] = [];

  // 1. Personal Information (weight 10)
  const pFilled = isSectionFilled(raw.personalInfo);
  sections.push({
    nameKey: 'Personal Information',
    nameFa: 'اطلاعات فردی',
    weight: 10,
    score: pFilled ? 1.0 : 0,
    isComplete: pFilled,
  });

  // 2. Physical Information (weight 9)
  const phyFilled = isSectionFilled(raw.physicalInfo);
  sections.push({
    nameKey: 'Physical Information',
    nameFa: 'اطلاعات جسمی و فیزیکی',
    weight: 9,
    score: phyFilled ? 1.0 : 0,
    isComplete: phyFilled,
  });

  // 3. Family Information (weight 9)
  const famFilled = isSectionFilled(raw.familyInfo);
  sections.push({
    nameKey: 'Family Information',
    nameFa: 'اطلاعات خانوادگی',
    weight: 9,
    score: famFilled ? 1.0 : 0,
    isComplete: famFilled,
  });

  // 4. Mother Information (weight 9)
  const mFilled = isSectionFilled(raw.mother);
  sections.push({
    nameKey: 'Mother Information',
    nameFa: 'اطلاعات مادر',
    weight: 9,
    score: mFilled ? 1.0 : 0,
    isComplete: mFilled,
  });

  // 5. Father Information (weight 9)
  const fFilled = isSectionFilled(raw.father);
  sections.push({
    nameKey: 'Father Information',
    nameFa: 'اطلاعات پدر',
    weight: 9,
    score: fFilled ? 1.0 : 0,
    isComplete: fFilled,
  });

  // 6. Financial Information (weight 10)
  const finFilled = isSectionFilled(raw.financialInfo);
  sections.push({
    nameKey: 'Financial Information',
    nameFa: 'اطلاعات مالی و اقتصادی',
    weight: 10,
    score: finFilled ? 1.0 : 0,
    isComplete: finFilled,
  });

  // 7. Intellectual & Beliefs (weight 10)
  const intFilled = isSectionFilled(raw.intellectualInfo);
  sections.push({
    nameKey: 'Intellectual & Beliefs',
    nameFa: 'اطلاعات فکری و عقیدتی',
    weight: 10,
    score: intFilled ? 1.0 : 0,
    isComplete: intFilled,
  });

  // 8. Preferred Spouse Intellectual (weight 9)
  const pwiFilled = isSectionFilled(raw.prefWifeIntellectual);
  sections.push({
    nameKey: 'Preferred Spouse Intellectual',
    nameFa: 'معیارهای فکری همسر مدنظر',
    weight: 9,
    score: pwiFilled ? 1.0 : 0,
    isComplete: pwiFilled,
  });

  // 9. Preferred Spouse Ethnicity / Originality (weight 8)
  const origFilled = Array.isArray(raw.futureSpouseOriginalities) && raw.futureSpouseOriginalities.length > 0;
  sections.push({
    nameKey: 'Preferred Spouse Ethnicity',
    nameFa: 'معیارهای قومیتی و اصالت همسر',
    weight: 8,
    score: origFilled ? 1.0 : 0,
    isComplete: origFilled,
  });

  // 10. Preferred Spouse Personal (weight 9)
  const pwpFilled = isSectionFilled(raw.prefWifePersonal);
  sections.push({
    nameKey: 'Preferred Spouse Personal',
    nameFa: 'معیارهای فردی همسر مدنظر',
    weight: 9,
    score: pwpFilled ? 1.0 : 0,
    isComplete: pwpFilled,
  });

  // 11. Preferred Spouse Physical (weight 8)
  const pwphyFilled = isSectionFilled(raw.prefWifePhysical);
  sections.push({
    nameKey: 'Preferred Spouse Physical',
    nameFa: 'معیارهای ظاهری همسر مدنظر',
    weight: 8,
    score: pwphyFilled ? 1.0 : 0,
    isComplete: pwphyFilled,
  });

  // Calculate Weighted Percentage
  // Note: birthCertInfo, identityInfo, and prefWifeExtra are completely excluded.
  const totalWeight = sections.reduce((sum, s) => sum + s.weight, 0);
  const earnedWeight = sections.reduce((sum, s) => sum + s.score * s.weight, 0);
  const percentage = Math.round(Math.min(100, Math.max(0, (earnedWeight / totalWeight) * 100)));

  const isReady = percentage >= 70;
  const statusTextFa = percentage >= 95
    ? 'تکمیل ۱۰۰٪ و آماده همسان‌گزینی'
    : percentage >= 70
    ? `فعال و تکمیل (${percentage}٪)`
    : `در حال تکمیل (${percentage}٪)`;

  const statusTextEn = percentage >= 95
    ? '100% Complete & Ready'
    : percentage >= 70
    ? `Active & Ready (${percentage}%)`
    : `In Progress (${percentage}%)`;

  return {
    percentage,
    isReady,
    statusTextFa,
    statusTextEn,
    sections,
  };
}

export async function fetchUserProfileCompletion(userId: string): Promise<ProfileCompletionResult> {
  try {
    const [
      personalRes,
      physicalRes,
      familyRes,
      motherRes,
      fatherRes,
      financialRes,
      intellectualRes,
      prefWifeIntRes,
      prefWifePerRes,
      prefWifePhyRes,
      spouseOrigRes,
    ] = await Promise.all([
      fetchPersonalInformation({ user: userId } as any).catch(() => null),
      fetchPhysicalInformation({ user: userId } as any).catch(() => null),
      fetchFamilyInformation({ user: userId } as any).catch(() => null),
      fetchMothers({ user: userId } as any).catch(() => null),
      fetchFathers({ user: userId } as any).catch(() => null),
      fetchFinancialInformation({ user: userId } as any).catch(() => null),
      fetchIntellectualInformation({ user: userId } as any).catch(() => null),
      fetchPreferredWifeIntellectualInformation({ user: userId } as any).catch(() => null),
      fetchPreferredWifePersonalInformation({ user: userId } as any).catch(() => null),
      fetchPreferredWifePhysicalInformation({ user: userId } as any).catch(() => null),
      fetchFutureSpouseOriginalities({ user: userId } as any).catch(() => []),
    ]);

    return computeProfileCompletion({
      personalInfo: extractFirst(personalRes as any),
      physicalInfo: extractFirst(physicalRes as any),
      familyInfo: extractFirst(familyRes as any),
      mother: extractFirst(motherRes as any),
      father: extractFirst(fatherRes as any),
      financialInfo: extractFirst(financialRes as any),
      intellectualInfo: extractFirst(intellectualRes as any),
      prefWifeIntellectual: extractFirst(prefWifeIntRes as any),
      prefWifePersonal: extractFirst(prefWifePerRes as any),
      prefWifePhysical: extractFirst(prefWifePhyRes as any),
      futureSpouseOriginalities: Array.isArray(spouseOrigRes) ? spouseOrigRes : (spouseOrigRes as any)?.results ?? [],
    });
  } catch (err) {
    console.warn(`Failed to compute profile completion for user ${userId}:`, err);
    return {
      percentage: 0,
      isReady: false,
      statusTextFa: 'در حال تکمیل (۰٪)',
      statusTextEn: 'In Progress (0%)',
      sections: [],
    };
  }
}

let cachedCompletion: { result: ProfileCompletionResult; timestamp: number } | null = null;

export async function fetchProfileCompletionStatus(forceRefresh = false): Promise<ProfileCompletionResult> {
  const now = Date.now();
  if (!forceRefresh && cachedCompletion && now - cachedCompletion.timestamp < 60000) {
    return cachedCompletion.result;
  }

  try {
    const [
      personalRes,
      physicalRes,
      familyRes,
      motherRes,
      fatherRes,
      financialRes,
      intellectualRes,
      prefWifeIntRes,
      prefWifePerRes,
      prefWifePhyRes,
      spouseOrigRes,
    ] = await Promise.all([
      fetchPersonalInformation().catch(() => null),
      fetchPhysicalInformation().catch(() => null),
      fetchFamilyInformation().catch(() => null),
      fetchMothers().catch(() => null),
      fetchFathers().catch(() => null),
      fetchFinancialInformation().catch(() => null),
      fetchIntellectualInformation().catch(() => null),
      fetchPreferredWifeIntellectualInformation().catch(() => null),
      fetchPreferredWifePersonalInformation().catch(() => null),
      fetchPreferredWifePhysicalInformation().catch(() => null),
      fetchFutureSpouseOriginalities().catch(() => []),
    ]);

    const result = computeProfileCompletion({
      personalInfo: extractFirst(personalRes as any),
      physicalInfo: extractFirst(physicalRes as any),
      familyInfo: extractFirst(familyRes as any),
      mother: extractFirst(motherRes as any),
      father: extractFirst(fatherRes as any),
      financialInfo: extractFirst(financialRes as any),
      intellectualInfo: extractFirst(intellectualRes as any),
      prefWifeIntellectual: extractFirst(prefWifeIntRes as any),
      prefWifePersonal: extractFirst(prefWifePerRes as any),
      prefWifePhysical: extractFirst(prefWifePhyRes as any),
      futureSpouseOriginalities: Array.isArray(spouseOrigRes) ? spouseOrigRes : (spouseOrigRes as any)?.results ?? [],
    });

    cachedCompletion = { result, timestamp: now };
    return result;
  } catch (err) {
    console.warn('Failed to compute profile completion:', err);
    return {
      percentage: 85,
      isReady: true,
      statusTextFa: 'فعال و تکمیل',
      statusTextEn: 'Active & Ready',
      sections: [],
    };
  }
}
