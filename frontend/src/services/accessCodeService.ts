import { apiClient } from "@/services/api/client";

export interface AccessCode {
  id: number;
  code: string;
  active: boolean;
  date_created: string;
}

export interface AccessCodePayload {
  active?: boolean;
}

export interface PaginatedAccessCodeResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AccessCode[];
}

export async function fetchAccessCodes(params?: {
  active?: boolean;
  page?: number;
}): Promise<PaginatedAccessCodeResponse | AccessCode[]> {
  const queryParams: Record<string, string> = {};
  if (params?.active !== undefined) {
    queryParams.active = String(params.active);
  }
  if (params?.page) {
    queryParams.page = String(params.page);
  }

  return apiClient<PaginatedAccessCodeResponse | AccessCode[]>("/api/access-codes/", {
    method: "GET",
    params: queryParams,
  });
}

export async function getAccessCode(id: number): Promise<AccessCode> {
  return apiClient<AccessCode>(`/api/access-codes/${id}/`, {
    method: "GET",
  });
}

export async function createAccessCode(payload: AccessCodePayload = { active: true }): Promise<AccessCode> {
  return apiClient<AccessCode>("/api/access-codes/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAccessCodePut(id: number, payload: AccessCodePayload): Promise<AccessCode> {
  return apiClient<AccessCode>(`/api/access-codes/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function updateAccessCodePatch(id: number, payload: AccessCodePayload): Promise<AccessCode> {
  return apiClient<AccessCode>(`/api/access-codes/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteAccessCode(id: number): Promise<void> {
  return apiClient<void>(`/api/access-codes/${id}/`, {
    method: "DELETE",
  });
}
