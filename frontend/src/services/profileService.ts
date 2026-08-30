import { apiClient } from '@/services/api/client';

export type GenderEnum = 'man' | 'woman' | 'boy' | 'girl' | 'separated' | 'deceased';
export type EducationEnum = 'Unlettered' | 'Under Diploma' | 'Diploma' | 'Associate Degree' | "Bachelor's Degree" | "Master's Degree" | 'Ph.D.' | 'Hoze (Islamic Seminary) LVL 1' | 'Hoze (Islamic Seminary) LVL 2' | 'Hoze (Islamic Seminary) LVL 3' | 'Hoze (Islamic Seminary) LVL 4' | 'School & Quranic';
export type MilitaryStatusEnum = 'exemption' | 'mother_sponsorship' | 'father_sponsorship' | 'educational_exemption' | 'medical_exemption' | 'end_of_service' | 'no_service' | 'woman';
export type IncomeEnum = 'no_income' | '-10' | '10-20' | '20-30' | '30-40' | '40-50' | '50-100' | '+100';
export type DepositEnum = 'no_deposit' | '-50' | '50-100' | '100-200' | '200-500' | '+500';
export type InsuranceTypeEnum = 'tamin' | 'takmili' | 'darmani' | 'niroo_mosalah' | 'ommr' | 'iran' | 'asia' | 'dana' | 'moalem' | 'parsian' | 'pasargad' | 'saman' | 'melat' | 'ma' | 'alborz' | 'kosar' | 'karafarin' | 'novin' | 'day' | 'sarmad' | 'razi' | 'taavon' | 'hafez' | 'etkayii_iranian' | 'tejarat_no' | 'khavermiane' | 'hekmat_saba' | 'tosehe' | 'other';
export type LeisureTypeEnum = 'park' | 'trip' | 'working_from_home' | 'mobile' | 'reading' | 'shrine' | 'jankaran' | 'cinema' | 'visiting_family' | 'sport' | 'poem' | 'garden';
export type UsageCasesEnum = 'alcoholic_drinks' | 'drugs' | 'cigarettes' | 'hookah' | 'none';
export type SkinColorEnum = 'Very Bright' | 'Bor' | 'Fair' | 'White' | 'Wheat' | 'Greenish' | 'Olive' | 'Darken' | 'Black' | 'Bright Brown' | 'Darken Brown' | 'Bright' | 'Yellow' | 'Whitish White' | 'Red & White' | 'Bright Greenish' | 'Other';
export type EyesColorEnum = 'Green' | 'Light Blue' | 'Hazel' | 'Darken Blue' | 'Grey' | 'Honey' | 'Purple' | 'Light Brown' | 'Deep Brown' | 'Black';
export type BloodTypeEnum = 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';
export type CharacterAndTemperamentEnum = 'Safravi' | 'Damvi' | 'Sodavi' | 'Balghami';
export type BodyAndFaceEnum = 'Excellent' | 'Good' | 'Average' | 'Suitable' | 'Nice Face' | 'Nice Body' | 'Looks Older' | 'Looks Younger' | 'Satisfied' | 'None';
export type AverageFamilyEducationEnum = 'Under Diploma' | 'Diploma' | 'Associate Degree' | "Bachelor's" | "Master's" | 'Ph.D.' | 'Hoze';
export type AverageFamilyFinanceEnum = 'Perfect' | 'Good' | 'Average' | 'Weak';
export type EngagementStatusEnum = 'Engagement' | 'Contract' | 'Wedding' | 'None';
export type MarriageExperienceEnum = 'yes' | 'no' | 'engagement_only';
export type MarriageStatusEnum = 'husband' | 'blank_birth_certificate';
export type ChildrenEnum = 'none' | 'one_boy' | 'two_boys' | 'three_boys' | 'one_girl' | 'two_girls' | 'three_girls';
export type ChildrenCustodyEnum = 'father' | 'mother';
export type CurrentResidenceStatusEnum = 'fathers_house' | 'mothers_house' | 'other';
export type OwnershipStatusEnum = 'owner' | 'rent';
export type AssetsEnum = 'house' | 'shop' | 'land' | 'garden' | 'factory' | 'company' | 'motorcycle' | 'car' | 'gold' | 'other' | 'none';
export type AfterMarriageResidenceStatusEnum = 'owner' | 'mortgage' | 'fathers_house' | 'mothers_house' | 'other';
export type ExSpouseFinancialStatusEnum = 'rights' | 'settled' | 'creditor' | 'debtor' | 'female';
export type ExSpouseFinancialPayStatusEnum = 'monthly' | 'yearly' | 'two_years';
export type DowryTypeEnum = 'mecca' | 'iraq' | 'syria' | 'gold' | 'money' | 'land' | 'car' | 'garden' | 'house' | 'agreement';
export type JahiziyehEnum = 'does' | 'doesnt' | 'wants' | 'doesnt_want' | 'man_should_help' | 'agreement';
export type OriginalityEnum = 'Alborzz' | 'Ardabil' | 'Bushehr' | 'Chaharmahal and Bakhtiari' | 'East Azerbaijan' | 'Esfahan' | 'Fars' | 'Gilan' | 'Golestan' | 'Hamadan' | 'Hormozgan' | 'Ilam' | 'Kerman' | 'Kermanshah' | 'Khuzestan' | 'Kohgiluyeh and Boyer-Ahmad' | 'Kurdistan' | 'Lorestan' | 'Markazi' | 'Mazandaran' | 'North Khorasan' | 'Qazvin' | 'Qom' | 'Razavi Khorasan' | 'Semnan' | 'Sistan and Baluchestan' | 'South Khorasan' | 'Tehran' | 'West Azerbaijan' | 'Yazd' | 'Zanjan' | 'doesnt_matter';
export type ContractHowEnum = 'registry' | 'house_family' | 'hall' | 'doesnt_matter' | 'agreement';
export type WeddingHowEnum = 'house_family' | 'hall' | 'pilgrimage_trip' | 'doesnt_matter' | 'agreement';
export type WorshipAndPrayerEnum = 'fully_obligated' | 'sometimes' | 'not_obligated' | 'obligated_but_lazy' | 'doesnt_matter' | 'disagree';
export type FastingEnum = 'fully_obligated' | 'sometimes' | 'not_obligated' | 'obligated_but_lazy' | 'disagree' | 'doesnt_matter' | 'sick';
export type CoverTypeHouseEnum = 'cozy_attractive' | 'normal';
export type CoverTypeSocietyEnum = 'always_chador' | 'always_coverd_manto' | 'always_free_manto' | 'sometimes_chador' | 'sometimes_coverd_manto' | 'sometimes_free_manto';
export type ParticipationEnum = 'too_much' | 'much' | 'average' | 'low' | 'doesnt_matter';
export type MusicEnum = 'too_much' | 'much' | 'average' | 'low' | 'never';
export type DanceSingingEnum = 'too_much' | 'much' | 'average' | 'low' | 'never';
export type InnocentContactEnum = 'daily_matters' | 'work_matters' | 'doesnt_matter';
export type CoverTypeInnocentContactEnum = 'only_chador' | 'formal_manto' | 'colored_chador' | 'cozy_attractive';
export type DecisionMakingEnum = 'dependent' | 'independet' | 'counsole_with_parents' | 'counsole_with_bros_and_siss' | 'counsole_with_childs' | 'counsole_with_professional';
export type AppearanceTypeEnum = 'Religious' | 'Norm' | 'Cador' | 'Manto' | 'Sport & Modern';
export type AgeDifferenceEnum = 'Same' | 'Till 3' | '3 to 7' | '7 to 10' | '10 to 15' | 'Depends on the Looks' | "Doesn't Matter";
export type ImportanceEnum = 'too_much' | 'much' | 'any' | 'low' | 'doesnt_matter';
export type MarriageWithExperienceEnum = 'Never' | 'Divorced Virgin' | 'Divorced No Custody' | 'Divorced No Life' | 'Divorced No Child' | 'Divorced Have Boy' | 'Divorced Have Girl' | 'Spouse Died';
export type DisabledVeteranEnum = 'yes' | 'no' | 'depends';
export type AfterMarriageResidenceLocationEnum = 'Exactly Qom' | 'Near Qom' | 'Mega Cities' | 'Anywhere in Iran' | 'Villages Near Qom' | 'Environs Near Qom' | 'Foreign Country' | 'Agreement';
export type FutureSpouseJobEnum = 'Freelance' | 'Military' | 'Office' | 'Teacher' | 'Hoze M' | 'Hoze N' | 'hoze Sis' | 'Womanly Job' | 'No Job At All' | 'Housekeeper' | "Doesn't Matter";
export type SignupFeeTypeEnum = 'cash' | 'card';
export type VelayatFaqihEnum = 'agree' | 'no_opinion';
export type ChildQuantityEnum = 'dont_want' | 'depends' | '1' | '2' | '3' | 'more_than_3' | 'agreement';
export type FriendConnectionEnum = 'Excellent' | 'Good' | 'Average' | 'Weak' | 'None';
export type WomanJobOpinionEnum = 'Disagree' | 'Agree' | 'Must have a job' | 'Depends on Work Environment' | 'Depends on Job Type' | 'Womanly Job' | 'Housejob' | 'Depends On Spouse Opinion';
export type WomanEducationOpinionEnum = 'Disagree' | 'Agree' | 'Depends on the Degree' | 'Depends On Spouse Opinion';
export type EthnicityEnum = 'فارس' | 'لر' | 'ترک' | 'کرد' | 'لک' | 'تات' | 'عرب' | 'بلوچ';

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  middle_man_code?: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined?: string;
}

export interface PersonalInformation {
  id: number;
  gender: GenderEnum;
  sadat: boolean;
  birth_date: string;
  birth_location: string;
  education: EducationEnum;
  degree?: string | null;
  military_status?: MilitaryStatusEnum | null;
  military_status_explanation?: string | null;
  income: IncomeEnum;
  deposit: DepositEnum;
  have_insurance: boolean;
  insurance_type: InsuranceTypeEnum[];
  insurance_years?: number | null;
  leisure_type: LeisureTypeEnum[];
  usage_cases: UsageCasesEnum[];
  usage_case_description?: string | null;
  tatto: boolean;
  tatto_description?: string | null;
  conviction_or_arrest_history: boolean;
  conviction_reason?: string | null;
  user: string;
}

export interface PhysicalInformation {
  id: number;
  height?: number | null;
  weight?: number | null;
  skin_color?: SkinColorEnum | null;
  eyes_color?: EyesColorEnum | null;
  blood_type?: BloodTypeEnum | null;
  character_and_temperament?: CharacterAndTemperamentEnum | null;
  glasses: boolean;
  glasses_size?: string | null;
  body_and_face: BodyAndFaceEnum[];
  disease_or_surgery_history: boolean;
  medication_surgery_disease_type?: string | null;
  user: string;
}

export interface IdentityInformation {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  father_name?: string | null;
  eitta_number?: string | null;
  landline_phone?: string | null;
  mother_phone?: string | null;
  father_phone?: string | null;
  home_address?: string | null;
  work_address?: string | null;
  originality?: string | null;
  education?: string | null;
  job?: string | null;
  insurance?: string | null;
  income?: string | null;
  assets?: string[] | string | null;
  weight?: number | string | null;
  height?: number | string | null;
  prefered_meeting_time?: string | null;
  type_of_payment?: string | null;
  nationality?: string | null;
  user: string;
}

export interface BirthCertificateInformation {
  id: number;
  national_code: string;
  birth_certificate_serial: string;
  birth_certificate_location: string;
  marriage_experince: MarriageExperienceEnum;
  contract_date?: string | null;
  marriage_status: MarriageStatusEnum;
  marriage_date?: string | null;
  divorce_date?: string | null;
  husband_death_date?: string | null;
  birth_date: string;
  children: ChildrenEnum;
  children_custody?: ChildrenCustodyEnum | null;
  user: string;
}

export interface FamilyInformation {
  id: number;
  average_family_education: AverageFamilyEducationEnum;
  average_family_finance: AverageFamilyFinanceEnum;
  family_divorce_history: boolean;
  family_divorce_reason?: string | null;
  contact_with_family: string;
  contact_with_relatives: string;
  number_of_sisters?: number | null;
  number_of_brothers?: number | null;
  user: string;
}

export interface EngagementOrWeddingStatus {
  id: number;
  status: EngagementStatusEnum;
  contract_length?: string | null;
  living_length?: string | null;
  death_date?: string | null;
  divorce_date?: string | null;
  reason_for_divorce_or_death?: string | null;
  user: string;
}

export interface Mother {
  id: number;
  language: string;
  birth_date: string;
  job: string;
  originality: OriginalityEnum;
  education: EducationEnum;
  alive: boolean;
  death_date?: string | null;
  user: string;
}

export interface Father {
  id: number;
  language: string;
  birth_date: string;
  job: string;
  originality: OriginalityEnum;
  education: EducationEnum;
  alive: boolean;
  death_date?: string | null;
  user: string;
}

export interface FinancialInformation {
  id: number;
  job?: string | null;
  current_residence_status?: CurrentResidenceStatusEnum | null;
  ownership_status?: OwnershipStatusEnum | null;
  rent_amount?: string | null;
  mortgage_amount?: string | null;
  capital: AssetsEnum[];
  other_captial?: string | null;
  other_capital?: string | null;
  after_marriage_residence_status?: AfterMarriageResidenceStatusEnum | null;
  ex_spouse_financial_status?: ExSpouseFinancialStatusEnum | null;
  ex_spouse_financial_pay_status?: ExSpouseFinancialPayStatusEnum | null;
  ex_spouse_financial_amount?: string | null;
  dowry_type: DowryTypeEnum[];
  future_spouse_dowry_type?: DowryTypeEnum[];
  dowry_amount?: string | null;
  future_spose_dowry_amount?: string | null;
  jahiziyeh?: JahiziyehEnum | null;
  future_spose_jahiziyeh?: JahiziyehEnum | null;
  jahiziyeh_explantion?: string | null;
  future_spose_jahiziyeh_explanation?: string | null;
  user: string;
}

export interface IntellectualInformation {
  id: number;
  marriage_goals?: string | null;
  marriage_goals_purposes?: string | null;
  opinion_woman_job: WomanJobOpinionEnum[];
  opinion_about_womans_job?: WomanJobOpinionEnum[];
  opinion_woman_edu: WomanEducationOpinionEnum[];
  opinion_about_womans_education?: WomanEducationOpinionEnum[];
  pros_of_yourself?: string | null;
  cons_of_yourself?: string | null;
  type_connection_friends?: FriendConnectionEnum | null;
  type_of_connection_with_friends?: FriendConnectionEnum | null;
  friends_connection_reason?: string | null;
  political_orientation: boolean;
  opinion_velayat_faqih?: VelayatFaqihEnum | null;
  opinion_about_velayat_faqih?: VelayatFaqihEnum | null;
  opinion_child_quantity?: ChildQuantityEnum | null;
  opinion_about_child_quantity?: ChildQuantityEnum | null;
  contract_how?: ContractHowEnum | null;
  wedding_how?: WeddingHowEnum | null;
  worship_prayer?: WorshipAndPrayerEnum | null;
  worship_and_prayer?: WorshipAndPrayerEnum | null;
  fasting?: FastingEnum | null;
  fasting_explanation?: string | null;
  cover_type_house?: CoverTypeHouseEnum | null;
  cover_type_society?: CoverTypeSocietyEnum | null;
  participating_prayer_quran_meetings?: ParticipationEnum | null;
  participating_in_religious_meetings?: ParticipationEnum | null;
  music?: MusicEnum | null;
  dance_singing_assemblies?: DanceSingingEnum | null;
  opinion_innocent_contact?: InnocentContactEnum | null;
  opinion_about_innocent_contact?: InnocentContactEnum | null;
  cover_type_innocent_contact?: CoverTypeInnocentContactEnum | null;
  decision_making_choosing_spouse?: DecisionMakingEnum | null;
  user: string;
}

export interface PreferredWifeIntellectualInformation {
  id: number;
  appearance_type: AppearanceTypeEnum[];
  age_difference: AgeDifferenceEnum[];
  future_spouse_family_religious_status_importance?: ImportanceEnum | null;
  future_spouse_family_financial_status_importance?: ImportanceEnum | null;
  marriage_with_someone_with_marriage_experience: MarriageWithExperienceEnum[];
  additional_explnation_marriage_with_someone?: string | null;
  marriage_with_someone_explanation?: string | null;
  most_important_moral_feature_of_future_spouse?: string | null;
  most_important_moral_feature?: string | null;
  marriage_with_disabled?: DisabledVeteranEnum | null;
  marriage_with_disabled_person?: DisabledVeteranEnum | null;
  marriage_with_veteran?: DisabledVeteranEnum | null;
  marriage_with_veteran_person?: DisabledVeteranEnum | null;
  additional_explnation_disabled_veteran?: string | null;
  marriage_disabled_veteran_explanation?: string | null;
  red_flags?: string | null;
  user: string;
}

export interface PreferredWifePersonalInformation {
  id: number;
  education?: string | null;
  education_level?: string | null;
  field_of_study?: string | null;
  future_spouse_job: FutureSpouseJobEnum[];
  current_residence_location?: string | null;
  after_marriage_residence_location?: AfterMarriageResidenceLocationEnum[] | string | null;
  user: string;
}

export interface PreferredWifePhysicalInformation {
  id: number;
  height?: number | string | null;
  height_min?: number | null;
  height_max?: number | null;
  weight?: number | string | null;
  weight_min?: number | null;
  weight_max?: number | null;
  skin_color: SkinColorEnum[];
  user: string;
}

export interface PreferredWifeExtraInformation {
  id: number;
  additional_explanations?: string | null;
  user: string;
}

export interface SubjectDetails {
  id: number;
  preferred_date_times?: string | null;
  signup_fee_type?: SignupFeeTypeEnum | null;
  account_number?: string | null;
  bank?: string | null;
  bank_name?: string | null;
  gender_target?: string | null;
  amount?: string | null;
  professional_opinion?: string | null;
  user: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ProfileQueryParams {
  user?: string;
  page?: string;
}

export function extractFirst<T>(response: PaginatedResponse<T> | T[]): T | null {
  if (Array.isArray(response)) return response[0] ?? null;
  return response.results?.[0] ?? null;
}

// personal-information
export async function fetchPersonalInformation(params?: ProfileQueryParams): Promise<PaginatedResponse<PersonalInformation> | PersonalInformation[]> {
  return apiClient('/api/personal-information/', { params });
}
export async function createPersonalInformation(data: Partial<PersonalInformation>): Promise<PersonalInformation> {
  return apiClient('/api/personal-information/', { method: 'POST', body: JSON.stringify(data) });
}
export async function updatePersonalInformation(id: number, data: Partial<PersonalInformation>): Promise<PersonalInformation> {
  return apiClient(`/api/personal-information/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deletePersonalInformation(id: number): Promise<void> {
  return apiClient(`/api/personal-information/${id}/`, { method: 'DELETE' });
}

// physical-information
export async function fetchPhysicalInformation(params?: ProfileQueryParams): Promise<PaginatedResponse<PhysicalInformation> | PhysicalInformation[]> {
  return apiClient('/api/physical-information/', { params });
}
export async function createPhysicalInformation(data: Partial<PhysicalInformation>): Promise<PhysicalInformation> {
  return apiClient('/api/physical-information/', { method: 'POST', body: JSON.stringify(data) });
}
export async function updatePhysicalInformation(id: number, data: Partial<PhysicalInformation>): Promise<PhysicalInformation> {
  return apiClient(`/api/physical-information/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deletePhysicalInformation(id: number): Promise<void> {
  return apiClient(`/api/physical-information/${id}/`, { method: 'DELETE' });
}

// identity-information
export async function fetchIdentityInformation(params?: ProfileQueryParams): Promise<PaginatedResponse<IdentityInformation> | IdentityInformation[]> {
  return apiClient('/api/identity-information/', { params });
}
export async function createIdentityInformation(data: Partial<IdentityInformation>): Promise<IdentityInformation> {
  return apiClient('/api/identity-information/', { method: 'POST', body: JSON.stringify(data) });
}
export async function updateIdentityInformation(id: number, data: Partial<IdentityInformation>): Promise<IdentityInformation> {
  return apiClient(`/api/identity-information/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteIdentityInformation(id: number): Promise<void> {
  return apiClient(`/api/identity-information/${id}/`, { method: 'DELETE' });
}

// birth-certificate-information
export async function fetchBirthCertificateInformation(params?: ProfileQueryParams): Promise<PaginatedResponse<BirthCertificateInformation> | BirthCertificateInformation[]> {
  return apiClient('/api/birth-certificate-information/', { params });
}
export async function createBirthCertificateInformation(data: Partial<BirthCertificateInformation>): Promise<BirthCertificateInformation> {
  return apiClient('/api/birth-certificate-information/', { method: 'POST', body: JSON.stringify(data) });
}
export async function updateBirthCertificateInformation(id: number, data: Partial<BirthCertificateInformation>): Promise<BirthCertificateInformation> {
  return apiClient(`/api/birth-certificate-information/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteBirthCertificateInformation(id: number): Promise<void> {
  return apiClient(`/api/birth-certificate-information/${id}/`, { method: 'DELETE' });
}

// family-information
export async function fetchFamilyInformation(params?: ProfileQueryParams): Promise<PaginatedResponse<FamilyInformation> | FamilyInformation[]> {
  return apiClient('/api/family-information/', { params });
}
export async function createFamilyInformation(data: Partial<FamilyInformation>): Promise<FamilyInformation> {
  return apiClient('/api/family-information/', { method: 'POST', body: JSON.stringify(data) });
}
export async function updateFamilyInformation(id: number, data: Partial<FamilyInformation>): Promise<FamilyInformation> {
  return apiClient(`/api/family-information/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteFamilyInformation(id: number): Promise<void> {
  return apiClient(`/api/family-information/${id}/`, { method: 'DELETE' });
}

// engagement-or-wedding-status
export async function fetchEngagementOrWeddingStatus(params?: ProfileQueryParams): Promise<PaginatedResponse<EngagementOrWeddingStatus> | EngagementOrWeddingStatus[]> {
  return apiClient('/api/engagement-or-wedding-status/', { params });
}
export async function createEngagementOrWeddingStatus(data: Partial<EngagementOrWeddingStatus>): Promise<EngagementOrWeddingStatus> {
  return apiClient('/api/engagement-or-wedding-status/', { method: 'POST', body: JSON.stringify(data) });
}
export async function updateEngagementOrWeddingStatus(id: number, data: Partial<EngagementOrWeddingStatus>): Promise<EngagementOrWeddingStatus> {
  return apiClient(`/api/engagement-or-wedding-status/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteEngagementOrWeddingStatus(id: number): Promise<void> {
  return apiClient(`/api/engagement-or-wedding-status/${id}/`, { method: 'DELETE' });
}

// mothers
export async function fetchMothers(params?: ProfileQueryParams): Promise<PaginatedResponse<Mother> | Mother[]> {
  return apiClient('/api/mothers/', { params });
}
export async function createMother(data: Partial<Mother>): Promise<Mother> {
  return apiClient('/api/mothers/', { method: 'POST', body: JSON.stringify(data) });
}
export async function updateMother(id: number, data: Partial<Mother>): Promise<Mother> {
  return apiClient(`/api/mothers/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteMother(id: number): Promise<void> {
  return apiClient(`/api/mothers/${id}/`, { method: 'DELETE' });
}

// fathers
export async function fetchFathers(params?: ProfileQueryParams): Promise<PaginatedResponse<Father> | Father[]> {
  return apiClient('/api/fathers/', { params });
}
export async function createFather(data: Partial<Father>): Promise<Father> {
  return apiClient('/api/fathers/', { method: 'POST', body: JSON.stringify(data) });
}
export async function updateFather(id: number, data: Partial<Father>): Promise<Father> {
  return apiClient(`/api/fathers/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteFather(id: number): Promise<void> {
  return apiClient(`/api/fathers/${id}/`, { method: 'DELETE' });
}

// financial-information
export async function fetchFinancialInformation(params?: ProfileQueryParams): Promise<PaginatedResponse<FinancialInformation> | FinancialInformation[]> {
  return apiClient('/api/financial-information/', { params });
}
export async function createFinancialInformation(data: Partial<FinancialInformation>): Promise<FinancialInformation> {
  return apiClient('/api/financial-information/', { method: 'POST', body: JSON.stringify(data) });
}
export async function updateFinancialInformation(id: number, data: Partial<FinancialInformation>): Promise<FinancialInformation> {
  return apiClient(`/api/financial-information/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteFinancialInformation(id: number): Promise<void> {
  return apiClient(`/api/financial-information/${id}/`, { method: 'DELETE' });
}

// intellectual-information
export async function fetchIntellectualInformation(params?: ProfileQueryParams): Promise<PaginatedResponse<IntellectualInformation> | IntellectualInformation[]> {
  return apiClient('/api/intellectual-information/', { params });
}
export async function createIntellectualInformation(data: Partial<IntellectualInformation>): Promise<IntellectualInformation> {
  return apiClient('/api/intellectual-information/', { method: 'POST', body: JSON.stringify(data) });
}
export async function updateIntellectualInformation(id: number, data: Partial<IntellectualInformation>): Promise<IntellectualInformation> {
  return apiClient(`/api/intellectual-information/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteIntellectualInformation(id: number): Promise<void> {
  return apiClient(`/api/intellectual-information/${id}/`, { method: 'DELETE' });
}

// preferred-wife-intellectual-information
export async function fetchPreferredWifeIntellectualInformation(params?: ProfileQueryParams): Promise<PaginatedResponse<PreferredWifeIntellectualInformation> | PreferredWifeIntellectualInformation[]> {
  return apiClient('/api/preferred-wife-intellectual-information/', { params });
}
export async function createPreferredWifeIntellectualInformation(data: Partial<PreferredWifeIntellectualInformation>): Promise<PreferredWifeIntellectualInformation> {
  return apiClient('/api/preferred-wife-intellectual-information/', { method: 'POST', body: JSON.stringify(data) });
}
export async function updatePreferredWifeIntellectualInformation(id: number, data: Partial<PreferredWifeIntellectualInformation>): Promise<PreferredWifeIntellectualInformation> {
  return apiClient(`/api/preferred-wife-intellectual-information/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deletePreferredWifeIntellectualInformation(id: number): Promise<void> {
  return apiClient(`/api/preferred-wife-intellectual-information/${id}/`, { method: 'DELETE' });
}

// preferred-wife-personal-information
export async function fetchPreferredWifePersonalInformation(params?: ProfileQueryParams): Promise<PaginatedResponse<PreferredWifePersonalInformation> | PreferredWifePersonalInformation[]> {
  return apiClient('/api/preferred-wife-personal-information/', { params });
}
export async function createPreferredWifePersonalInformation(data: Partial<PreferredWifePersonalInformation>): Promise<PreferredWifePersonalInformation> {
  return apiClient('/api/preferred-wife-personal-information/', { method: 'POST', body: JSON.stringify(data) });
}
export async function updatePreferredWifePersonalInformation(id: number, data: Partial<PreferredWifePersonalInformation>): Promise<PreferredWifePersonalInformation> {
  return apiClient(`/api/preferred-wife-personal-information/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deletePreferredWifePersonalInformation(id: number): Promise<void> {
  return apiClient(`/api/preferred-wife-personal-information/${id}/`, { method: 'DELETE' });
}

// preferred-wife-physical-information
export async function fetchPreferredWifePhysicalInformation(params?: ProfileQueryParams): Promise<PaginatedResponse<PreferredWifePhysicalInformation> | PreferredWifePhysicalInformation[]> {
  return apiClient('/api/preferred-wife-physical-information/', { params });
}
export async function createPreferredWifePhysicalInformation(data: Partial<PreferredWifePhysicalInformation>): Promise<PreferredWifePhysicalInformation> {
  return apiClient('/api/preferred-wife-physical-information/', { method: 'POST', body: JSON.stringify(data) });
}
export async function updatePreferredWifePhysicalInformation(id: number, data: Partial<PreferredWifePhysicalInformation>): Promise<PreferredWifePhysicalInformation> {
  return apiClient(`/api/preferred-wife-physical-information/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deletePreferredWifePhysicalInformation(id: number): Promise<void> {
  return apiClient(`/api/preferred-wife-physical-information/${id}/`, { method: 'DELETE' });
}

// preferred-wife-extra-information
export async function fetchPreferredWifeExtraInformation(params?: ProfileQueryParams): Promise<PaginatedResponse<PreferredWifeExtraInformation> | PreferredWifeExtraInformation[]> {
  return apiClient('/api/preferred-wife-extra-information/', { params });
}
export async function createPreferredWifeExtraInformation(data: Partial<PreferredWifeExtraInformation>): Promise<PreferredWifeExtraInformation> {
  return apiClient('/api/preferred-wife-extra-information/', { method: 'POST', body: JSON.stringify(data) });
}
export async function updatePreferredWifeExtraInformation(id: number, data: Partial<PreferredWifeExtraInformation>): Promise<PreferredWifeExtraInformation> {
  return apiClient(`/api/preferred-wife-extra-information/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deletePreferredWifeExtraInformation(id: number): Promise<void> {
  return apiClient(`/api/preferred-wife-extra-information/${id}/`, { method: 'DELETE' });
}

// subject-details
export async function fetchSubjectDetails(params?: ProfileQueryParams): Promise<PaginatedResponse<SubjectDetails> | SubjectDetails[]> {
  return apiClient('/api/subject-details/', { params });
}
export async function createSubjectDetails(data: Partial<SubjectDetails>): Promise<SubjectDetails> {
  return apiClient('/api/subject-details/', { method: 'POST', body: JSON.stringify(data) });
}
export async function updateSubjectDetails(id: number, data: Partial<SubjectDetails>): Promise<SubjectDetails> {
  return apiClient(`/api/subject-details/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteSubjectDetails(id: number): Promise<void> {
  return apiClient(`/api/subject-details/${id}/`, { method: 'DELETE' });
}

// users
export async function fetchUsers(params?: Record<string, any>): Promise<PaginatedResponse<User> | User[]> {
  return apiClient('/api/users/', { params });
}
export async function getUser(id: string): Promise<User> {
  return apiClient(`/api/users/${id}/`);
}
export async function createUser(data: Partial<User>): Promise<User> {
  return apiClient('/api/users/', { method: 'POST', body: JSON.stringify(data) });
}
export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  return apiClient(`/api/users/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteUser(id: string): Promise<void> {
  return apiClient(`/api/users/${id}/`, { method: 'DELETE' });
}
export interface GenderRatioData {
  men_count: number;
  women_count: number;
  total_gender_count: number;
  men_percentage: number;
  women_percentage: number;
}

export interface UserStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  staff_users: number;
  total_codes: number;
  active_codes: number;
  used_codes: number;
  gender_ratio?: GenderRatioData;
  gender_breakdown?: Record<string, number>;
  location_breakdown?: Record<string, number>;
  education_breakdown?: Record<string, number>;
  income_breakdown?: Record<string, number>;
  housing_breakdown?: Record<string, number>;
  marriage_experience_breakdown?: Record<string, number>;
  age_breakdown?: Record<string, number>;
  selected_gender?: string;
  cohort_count?: number;
}

export async function fetchUserStats(params?: { gender?: string }): Promise<UserStats> {
  return apiClient('/api/users/stats/', { params });
}

export async function executeBatchUserAction(
  action: 'enable' | 'disable' | 'make_staff' | 'make_normal' | 'delete',
  userIds: string[]
): Promise<{ status: string; action: string; affected: number }> {
  return apiClient('/api/users/batch_action/', {
    method: 'POST',
    body: JSON.stringify({ action, user_ids: userIds }),
  });
}

export interface CandidateProfile {
  id: string;
  username: string;
  first_name?: string | null;
  last_name?: string | null;
  gender: 'man' | 'woman' | 'male' | 'female' | 'other' | null;
  age?: number | null;
  birth_date?: string | null;
  birth_location?: string | null;
  province?: string | null;
  education?: string | null;
  educationLevel?: string | null;
  degree?: string | null;
  job?: string | null;
  height?: number | null;
  weight?: number | null;
  skin_color?: string | null;
  skinColor?: string | null;
  eyes_color?: string | null;
  marriage_experience?: string | null;
  maritalExperience?: string | null;
  income?: string | null;
  incomeTier?: string | null;
  ownership_status?: string | null;
  housingOwnership?: string | null;
  worship_and_prayer?: string | null;
  worship?: string | null;
  cover_type_society?: string | string[] | null;
  societyCover?: string | string[] | null;
  date_joined?: string | null;
  is_bookmarked?: boolean;
  isBookmarked?: boolean;
  avatar?: string | null;
}

export interface CandidateSearchResponse {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  user_role: 'admin' | 'user';
  user_gender?: 'man' | 'woman' | null;
  target_gender?: 'man' | 'woman' | null;
  results: CandidateProfile[];
}

export interface CandidateSearchParams {
  q?: string;
  search?: string;
  keyword?: string;
  gender?: string;
  min_age?: number | string;
  max_age?: number | string;
  minAge?: number | string;
  maxAge?: number | string;
  education?: string;
  educationLevel?: string;
  location?: string;
  province?: string;
  min_height?: number | string;
  max_height?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  min_weight?: number | string;
  max_weight?: number | string;
  minWeight?: number | string;
  maxWeight?: number | string;
  skin_color?: string;
  skinColor?: string;
  marriage_experience?: string;
  maritalExperience?: string;
  income?: string;
  incomeTier?: string;
  ownership_status?: string;
  housingOwnership?: string;
  current_residence_status?: string;
  residenceStatus?: string;
  job?: string;
  worship_and_prayer?: string;
  worship?: string;
  cover_type_society?: string;
  societyCover?: string;
  fasting?: string;
  opinion_velayat_faqih?: string;
  velayatFaqih?: string;
  have_insurance?: string | boolean;
  disease_or_surgery?: string | boolean;
  capital?: string;
  dowry_type?: string;
  father_originality?: string;
  mother_originality?: string;
  marriage_with_experience?: string;
  marriage_with_someone_with_marriage_experience?: string;
  ordering?: string;
  sort?: string;
  page?: number;
  page_size?: number;
  limit?: number;
}

export async function searchCandidates(
  params?: CandidateSearchParams
): Promise<CandidateSearchResponse> {
  const queryParams: Record<string, any> = {};
  if (params) {
    if (params.keyword || params.q || params.search) queryParams.q = params.keyword || params.q || params.search;
    if (params.gender) queryParams.gender = params.gender;
    if (params.minAge !== undefined || params.min_age !== undefined) queryParams.min_age = params.minAge ?? params.min_age;
    if (params.maxAge !== undefined || params.max_age !== undefined) queryParams.max_age = params.maxAge ?? params.max_age;
    if (params.educationLevel || params.education) queryParams.education = params.educationLevel || params.education;
    if (params.province || params.location) queryParams.location = params.province || params.location;
    if (params.job) queryParams.job = params.job;
    if (params.minHeight !== undefined || params.min_height !== undefined) queryParams.min_height = params.minHeight ?? params.min_height;
    if (params.maxHeight !== undefined || params.max_height !== undefined) queryParams.max_height = params.maxHeight ?? params.max_height;
    if (params.minWeight !== undefined || params.min_weight !== undefined) queryParams.min_weight = params.minWeight ?? params.min_weight;
    if (params.maxWeight !== undefined || params.max_weight !== undefined) queryParams.max_weight = params.maxWeight ?? params.max_weight;
    if (params.skinColor || params.skin_color) queryParams.skin_color = params.skinColor || params.skin_color;
    if (params.maritalExperience || params.marriage_experience) queryParams.marriage_experience = params.maritalExperience || params.marriage_experience;
    if (params.incomeTier || params.income) queryParams.income = params.incomeTier || params.income;
    if (params.housingOwnership || params.ownership_status) queryParams.ownership_status = params.housingOwnership || params.ownership_status;
    if (params.residenceStatus || params.current_residence_status) queryParams.current_residence_status = params.residenceStatus || params.current_residence_status;
    if (params.worship || params.worship_and_prayer) queryParams.worship_and_prayer = params.worship || params.worship_and_prayer;
    if (params.societyCover || params.cover_type_society) queryParams.cover_type_society = params.societyCover || params.cover_type_society;
    if (params.fasting) queryParams.fasting = params.fasting;
    if (params.velayatFaqih || params.opinion_velayat_faqih) queryParams.opinion_velayat_faqih = params.velayatFaqih || params.opinion_velayat_faqih;
    if (params.have_insurance !== undefined) queryParams.have_insurance = params.have_insurance;
    if (params.disease_or_surgery !== undefined) queryParams.disease_or_surgery = params.disease_or_surgery;
    if (params.capital) queryParams.capital = params.capital;
    if (params.dowry_type) queryParams.dowry_type = params.dowry_type;
    if (params.father_originality) queryParams.father_originality = params.father_originality;
    if (params.mother_originality) queryParams.mother_originality = params.mother_originality;
    if (params.marriage_with_experience || params.marriage_with_someone_with_marriage_experience) {
      queryParams.marriage_with_someone_with_marriage_experience = params.marriage_with_someone_with_marriage_experience || params.marriage_with_experience;
    }
    if (params.sort || params.ordering) {
      if (params.sort === 'newest') queryParams.ordering = '-date_joined';
      else if (params.sort === 'oldest') queryParams.ordering = 'date_joined';
      else queryParams.ordering = params.sort || params.ordering;
    }
    if (params.page) queryParams.page = params.page;
    if (params.limit || params.page_size) queryParams.page_size = params.limit || params.page_size;
  }
  return apiClient('/api/users/candidate_search/', { params: queryParams });
}

export async function fetchBookmarks(): Promise<CandidateProfile[]> {
  const res = await apiClient<{ count: number; results: CandidateProfile[] } | CandidateProfile[]>('/api/users/bookmarks/');
  if (Array.isArray(res)) return res;
  return res.results ?? [];
}

export async function toggleBookmark(
  candidateId: string
): Promise<{ candidate_id: string; is_bookmarked: boolean }> {
  return apiClient('/api/users/toggle_bookmark/', {
    method: 'POST',
    body: JSON.stringify({ candidate_id: candidateId }),
  });
}
