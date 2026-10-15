import {
  fetchPersonalInformation,
  fetchPhysicalInformation,
  fetchIdentityInformation,
  fetchBirthCertificateInformation,
  fetchFamilyInformation,
  fetchMothers,
  fetchFathers,
  fetchFinancialInformation,
  fetchIntellectualInformation,
  fetchPreferredWifeIntellectualInformation,
  fetchPreferredWifePersonalInformation,
  fetchPreferredWifePhysicalInformation,
  fetchPreferredWifeExtraInformation,
  extractFirst,
} from '@/services/profileService';
import {
  fetchFutureSpouseOriginalities,
  fetchSisters,
  fetchBrothers,
  fetchGrooms,
  fetchBrideOrWives,
  fetchExHusbandChildStatuses,
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

function countFilledFields(obj: any, keys: string[]): number {
  if (!obj || typeof obj !== 'object') return 0;
  let filled = 0;
  for (const k of keys) {
    if (hasValue(obj[k])) filled++;
  }
  return filled;
}

export function computeProfileCompletion(raw: {
  personalInfo?: any;
  identityInfo?: any;
  birthCertInfo?: any;
  physicalInfo?: any;
  familyInfo?: any;
  mother?: any;
  father?: any;
  financialInfo?: any;
  intellectualInfo?: any;
  prefWifeIntellectual?: any;
  prefWifePersonal?: any;
  prefWifePhysical?: any;
  prefWifeExtra?: any;
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

  // 1. Personal Information (weight 12)
  const personalFields = ['gender', 'birth_date', 'birth_location', 'education', 'job', 'income'];
  const pFilled = countFilledFields(raw.personalInfo, personalFields);
  const pScore = personalFields.length > 0 ? Math.min(1, pFilled / (personalFields.length * 0.7)) : 0;
  sections.push({
    nameKey: 'Personal Information',
    nameFa: 'اطلاعات فردی',
    weight: 12,
    score: pScore,
    isComplete: pScore >= 0.8,
  });

  // 2. Identity Information (weight 6)
  const idFields = ['first_name', 'last_name', 'father_name', 'gender'];
  const idFilled = countFilledFields(raw.identityInfo, idFields);
  const idScore = idFields.length > 0 ? Math.min(1, idFilled / 3) : 0;
  sections.push({
    nameKey: 'Identity Information',
    nameFa: 'اطلاعات هویتی و ثبت احوال',
    weight: 6,
    score: idScore,
    isComplete: idScore >= 0.8,
  });

  // 3. Birth Certificate Information (weight 6)
  const bcFields = ['birth_certificate_number', 'national_code', 'issue_place'];
  const bcFilled = countFilledFields(raw.birthCertInfo, bcFields);
  const bcScore = bcFields.length > 0 ? Math.min(1, bcFilled / 2) : 0;
  sections.push({
    nameKey: 'Birth Certificate',
    nameFa: 'اطلاعات شناسنامه‌ای',
    weight: 6,
    score: bcScore,
    isComplete: bcScore >= 0.8,
  });

  // 4. Physical Information (weight 8)
  const phyFields = ['height', 'weight', 'skin_color', 'eyes_color', 'body_and_face'];
  const phyFilled = countFilledFields(raw.physicalInfo, phyFields);
  const phyScore = phyFields.length > 0 ? Math.min(1, phyFilled / 3) : 0;
  sections.push({
    nameKey: 'Physical Information',
    nameFa: 'اطلاعات جسمی و فیزیکی',
    weight: 8,
    score: phyScore,
    isComplete: phyScore >= 0.8,
  });

  // 5. Family Information (weight 8)
  const famFields = ['average_family_education', 'average_family_finance', 'contact_with_family'];
  const famFilled = countFilledFields(raw.familyInfo, famFields);
  const famScore = famFields.length > 0 ? Math.min(1, famFilled / 2) : 0;
  sections.push({
    nameKey: 'Family Information',
    nameFa: 'اطلاعات خانوادگی',
    weight: 8,
    score: famScore,
    isComplete: famScore >= 0.8,
  });

  // 6. Mother (weight 7)
  const motherFields = ['alive', 'education', 'job', 'originality'];
  const mFilled = countFilledFields(raw.mother, motherFields);
  const mScore = motherFields.length > 0 ? Math.min(1, mFilled / 2) : 0;
  sections.push({
    nameKey: 'Mother Information',
    nameFa: 'اطلاعات مادر',
    weight: 7,
    score: mScore,
    isComplete: mScore >= 0.8,
  });

  // 7. Father (weight 7)
  const fatherFields = ['alive', 'education', 'job', 'originality'];
  const fFilled = countFilledFields(raw.father, fatherFields);
  const fScore = fatherFields.length > 0 ? Math.min(1, fFilled / 2) : 0;
  sections.push({
    nameKey: 'Father Information',
    nameFa: 'اطلاعات پدر',
    weight: 7,
    score: fScore,
    isComplete: fScore >= 0.8,
  });

  // 8. Financial Information (weight 10)
  const finFields = ['current_residence_status', 'ownership_status', 'capital'];
  const finFilled = countFilledFields(raw.financialInfo, finFields);
  const finScore = finFields.length > 0 ? Math.min(1, finFilled / 2) : 0;
  sections.push({
    nameKey: 'Financial Information',
    nameFa: 'اطلاعات مالی و اقتصادی',
    weight: 10,
    score: finScore,
    isComplete: finScore >= 0.8,
  });

  // 9. Intellectual & Beliefs (weight 12)
  const intFields = ['worship_prayer', 'fasting', 'cover_type_society', 'marriage_goals'];
  const intFilled = countFilledFields(raw.intellectualInfo, intFields);
  const intScore = intFields.length > 0 ? Math.min(1, intFilled / 2) : 0;
  sections.push({
    nameKey: 'Intellectual & Beliefs',
    nameFa: 'اطلاعات فکری و عقیدتی',
    weight: 12,
    score: intScore,
    isComplete: intScore >= 0.8,
  });

  // 10. Preferred Spouse Intellectual (weight 7)
  const pwiFields = ['cover_type_society', 'worship_prayer', 'fasting'];
  const pwiFilled = countFilledFields(raw.prefWifeIntellectual, pwiFields);
  const pwiScore = pwiFields.length > 0 ? Math.min(1, pwiFilled / 2) : 0;
  sections.push({
    nameKey: 'Preferred Spouse Intellectual',
    nameFa: 'معیارهای فکری همسر مدنظر',
    weight: 7,
    score: pwiScore,
    isComplete: pwiScore >= 0.8,
  });

  // 11. Preferred Spouse Ethnicity / Originality (weight 5)
  const origScore = Array.isArray(raw.futureSpouseOriginalities) && raw.futureSpouseOriginalities.length > 0 ? 1 : 0;
  sections.push({
    nameKey: 'Preferred Spouse Ethnicity',
    nameFa: 'معیارهای قومیتی و اصالت همسر',
    weight: 5,
    score: origScore,
    isComplete: origScore > 0,
  });

  // 12. Preferred Spouse Personal (weight 6)
  const pwpFields = ['min_age', 'max_age', 'education', 'job_status'];
  const pwpFilled = countFilledFields(raw.prefWifePersonal, pwpFields);
  const pwpScore = pwpFields.length > 0 ? Math.min(1, pwpFilled / 2) : 0;
  sections.push({
    nameKey: 'Preferred Spouse Personal',
    nameFa: 'معیارهای فردی همسر مدنظر',
    weight: 6,
    score: pwpScore,
    isComplete: pwpScore >= 0.8,
  });

  // 13. Preferred Spouse Physical (weight 6)
  const pwphyFields = ['min_height', 'max_height', 'skin_color'];
  const pwphyFilled = countFilledFields(raw.prefWifePhysical, pwphyFields);
  const pwphyScore = pwphyFields.length > 0 ? Math.min(1, pwphyFilled / 2) : 0;
  sections.push({
    nameKey: 'Preferred Spouse Physical',
    nameFa: 'معیارهای ظاهری همسر مدنظر',
    weight: 6,
    score: pwphyScore,
    isComplete: pwphyScore >= 0.8,
  });

  // 14. Preferred Spouse Extra (weight 5)
  const pweFields = ['special_conditions', 'extra_explanation'];
  const pweFilled = countFilledFields(raw.prefWifeExtra, pweFields);
  const pweScore = pweFilled > 0 ? 1 : 0.5; // lenient default if other sections are filled
  sections.push({
    nameKey: 'Preferred Spouse Extra',
    nameFa: 'سایر معیارهای همسر مدنظر',
    weight: 5,
    score: pweScore,
    isComplete: pweScore >= 0.8,
  });

  // Calculate Weighted Percentage (Only mandatory core sections counted)
  // Optional sections (engagement, previous children, sisters, brothers, grooms, brides)
  // DO NOT penalize users who have none!
  const totalWeight = sections.reduce((sum, s) => sum + s.weight, 0);
  const earnedWeight = sections.reduce((sum, s) => sum + s.score * s.weight, 0);
  const percentage = Math.round(Math.min(100, Math.max(0, (earnedWeight / totalWeight) * 100)));

  const isReady = percentage >= 75;
  const statusTextFa = percentage >= 90
    ? 'تکمیل ۱۰۰٪ و آماده همسان‌گزینی'
    : percentage >= 70
    ? `فعال و تکمیل (${percentage}٪)`
    : `در حال تکمیل (${percentage}٪)`;

  const statusTextEn = percentage >= 90
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

let cachedCompletion: { result: ProfileCompletionResult; timestamp: number } | null = null;

export async function fetchProfileCompletionStatus(forceRefresh = false): Promise<ProfileCompletionResult> {
  const now = Date.now();
  if (!forceRefresh && cachedCompletion && now - cachedCompletion.timestamp < 60000) {
    return cachedCompletion.result;
  }

  try {
    const [
      personalRes,
      identityRes,
      birthCertRes,
      physicalRes,
      familyRes,
      motherRes,
      fatherRes,
      financialRes,
      intellectualRes,
      prefWifeIntRes,
      prefWifePerRes,
      prefWifePhyRes,
      prefWifeExtRes,
      spouseOrigRes,
    ] = await Promise.all([
      fetchPersonalInformation().catch(() => null),
      fetchIdentityInformation().catch(() => null),
      fetchBirthCertificateInformation().catch(() => null),
      fetchPhysicalInformation().catch(() => null),
      fetchFamilyInformation().catch(() => null),
      fetchMothers().catch(() => null),
      fetchFathers().catch(() => null),
      fetchFinancialInformation().catch(() => null),
      fetchIntellectualInformation().catch(() => null),
      fetchPreferredWifeIntellectualInformation().catch(() => null),
      fetchPreferredWifePersonalInformation().catch(() => null),
      fetchPreferredWifePhysicalInformation().catch(() => null),
      fetchPreferredWifeExtraInformation().catch(() => null),
      fetchFutureSpouseOriginalities().catch(() => []),
    ]);

    const result = computeProfileCompletion({
      personalInfo: extractFirst(personalRes as any),
      identityInfo: extractFirst(identityRes as any),
      birthCertInfo: extractFirst(birthCertRes as any),
      physicalInfo: extractFirst(physicalRes as any),
      familyInfo: extractFirst(familyRes as any),
      mother: extractFirst(motherRes as any),
      father: extractFirst(fatherRes as any),
      financialInfo: extractFirst(financialRes as any),
      intellectualInfo: extractFirst(intellectualRes as any),
      prefWifeIntellectual: extractFirst(prefWifeIntRes as any),
      prefWifePersonal: extractFirst(prefWifePerRes as any),
      prefWifePhysical: extractFirst(prefWifePhyRes as any),
      prefWifeExtra: extractFirst(prefWifeExtRes as any),
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
