import { apiClient } from '@/services/api/client';
import type { EducationEnum, EthnicityEnum, PaginatedResponse } from './profileService';

export interface Sister {
  id: number;
  status: boolean; // alive
  education: EducationEnum;
  job: string;
  user: string;
}
export interface Brother {
  id: number;
  status: boolean;
  education: EducationEnum;
  job: string;
  user: string;
}
export type GroomOrEnum = 'groom' | 'zan_dadash';
export interface Groom {
  id: number;
  status: boolean;
  education: EducationEnum;
  job: string;
  groom_or: GroomOrEnum;
  user: string;
}
export type BrideOrEnum = 'bride' | 'shohar_khahar';
export interface BrideOrWife {
  id: number;
  status: boolean;
  education: EducationEnum;
  job: string;
  bride_or: BrideOrEnum;
  user: string;
}
export type ExHusbandChildGenderEnum = 'boy' | 'girl';
export type CustodyEnum = 'Father' | 'Mother' | 'Independant' | 'Other';
export interface ExHusbandChildStatus {
  id: number;
  gender: ExHusbandChildGenderEnum;
  status: boolean;
  birth_date?: string | null;
  custody: CustodyEnum;
  living_location?: string | null;
  user: string;
}
export interface FutureSposeOriginality {
  id: number;
  future_spouse_originality?: EthnicityEnum;
  future_spouse_ethnicity?: EthnicityEnum;
  user: string;
}
export interface IntroducedSubjectsInformation {
  id: number;
  username: string;
  birth_date?: string | null;
  postive?: boolean;
  positive?: boolean;
  negative: boolean;
  reason?: string | null;
  dates_of_meetings?: string | null;
  result_and_regards?: string | null;
  result_regards?: string | null;
  cost_of_introduction?: string | null;
  cost_of_meeting?: string | null;
  user: string;
}

export interface ProfileQueryParams {
  user?: string;
  page?: string;
}

// Sisters
export async function fetchSisters(params?: ProfileQueryParams): Promise<PaginatedResponse<Sister> | Sister[]> {
  return apiClient('/api/sisters/', { params });
}
export async function createSister(data: Partial<Sister>, params?: ProfileQueryParams): Promise<Sister> {
  return apiClient('/api/sisters/', { method: 'POST', body: JSON.stringify(data), params });
}
export async function updateSister(id: number, data: Partial<Sister>): Promise<Sister> {
  return apiClient(`/api/sisters/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteSister(id: number): Promise<void> {
  return apiClient(`/api/sisters/${id}/`, { method: 'DELETE' });
}

// Brothers
export async function fetchBrothers(params?: ProfileQueryParams): Promise<PaginatedResponse<Brother> | Brother[]> {
  return apiClient('/api/brothers/', { params });
}
export async function createBrother(data: Partial<Brother>, params?: ProfileQueryParams): Promise<Brother> {
  return apiClient('/api/brothers/', { method: 'POST', body: JSON.stringify(data), params });
}
export async function updateBrother(id: number, data: Partial<Brother>): Promise<Brother> {
  return apiClient(`/api/brothers/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteBrother(id: number): Promise<void> {
  return apiClient(`/api/brothers/${id}/`, { method: 'DELETE' });
}

// Grooms
export async function fetchGrooms(params?: ProfileQueryParams): Promise<PaginatedResponse<Groom> | Groom[]> {
  return apiClient('/api/grooms/', { params });
}
export async function createGroom(data: Partial<Groom>, params?: ProfileQueryParams): Promise<Groom> {
  return apiClient('/api/grooms/', { method: 'POST', body: JSON.stringify(data), params });
}
export async function updateGroom(id: number, data: Partial<Groom>): Promise<Groom> {
  return apiClient(`/api/grooms/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteGroom(id: number): Promise<void> {
  return apiClient(`/api/grooms/${id}/`, { method: 'DELETE' });
}

// BrideOrWives
export async function fetchBrideOrWives(params?: ProfileQueryParams): Promise<PaginatedResponse<BrideOrWife> | BrideOrWife[]> {
  return apiClient('/api/bride-or-wife/', { params });
}
export async function createBrideOrWife(data: Partial<BrideOrWife>, params?: ProfileQueryParams): Promise<BrideOrWife> {
  return apiClient('/api/bride-or-wife/', { method: 'POST', body: JSON.stringify(data), params });
}
export async function updateBrideOrWife(id: number, data: Partial<BrideOrWife>): Promise<BrideOrWife> {
  return apiClient(`/api/bride-or-wife/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteBrideOrWife(id: number): Promise<void> {
  return apiClient(`/api/bride-or-wife/${id}/`, { method: 'DELETE' });
}

// ExHusbandChildStatus
export async function fetchExHusbandChildStatuses(params?: ProfileQueryParams): Promise<PaginatedResponse<ExHusbandChildStatus> | ExHusbandChildStatus[]> {
  return apiClient('/api/ex-husband-child-status/', { params });
}
export async function createExHusbandChildStatus(data: Partial<ExHusbandChildStatus>, params?: ProfileQueryParams): Promise<ExHusbandChildStatus> {
  return apiClient('/api/ex-husband-child-status/', { method: 'POST', body: JSON.stringify(data), params });
}
export async function updateExHusbandChildStatus(id: number, data: Partial<ExHusbandChildStatus>): Promise<ExHusbandChildStatus> {
  return apiClient(`/api/ex-husband-child-status/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteExHusbandChildStatus(id: number): Promise<void> {
  return apiClient(`/api/ex-husband-child-status/${id}/`, { method: 'DELETE' });
}

// FutureSposeOriginality
export async function fetchFutureSpouseOriginalities(params?: ProfileQueryParams): Promise<PaginatedResponse<FutureSposeOriginality> | FutureSposeOriginality[]> {
  return apiClient('/api/future-spouse-originality/', { params });
}
export async function createFutureSpouseOriginality(data: Partial<FutureSposeOriginality>, params?: ProfileQueryParams): Promise<FutureSposeOriginality> {
  return apiClient('/api/future-spouse-originality/', { method: 'POST', body: JSON.stringify(data), params });
}
export async function updateFutureSpouseOriginality(id: number, data: Partial<FutureSposeOriginality>): Promise<FutureSposeOriginality> {
  return apiClient(`/api/future-spouse-originality/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteFutureSpouseOriginality(id: number): Promise<void> {
  return apiClient(`/api/future-spouse-originality/${id}/`, { method: 'DELETE' });
}

// IntroducedSubjectsInformation
export async function fetchIntroducedSubjectsInformation(params?: ProfileQueryParams): Promise<PaginatedResponse<IntroducedSubjectsInformation> | IntroducedSubjectsInformation[]> {
  return apiClient('/api/introduced-subjects-information/', { params });
}
export async function createIntroducedSubjectsInformation(data: Partial<IntroducedSubjectsInformation>, params?: ProfileQueryParams): Promise<IntroducedSubjectsInformation> {
  return apiClient('/api/introduced-subjects-information/', { method: 'POST', body: JSON.stringify(data), params });
}
export async function updateIntroducedSubjectsInformation(id: number, data: Partial<IntroducedSubjectsInformation>): Promise<IntroducedSubjectsInformation> {
  return apiClient(`/api/introduced-subjects-information/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteIntroducedSubjectsInformation(id: number): Promise<void> {
  return apiClient(`/api/introduced-subjects-information/${id}/`, { method: 'DELETE' });
}