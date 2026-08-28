import { apiClient } from "./client";

export interface User {
  id: number | string;
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  middle_man_code?: string;
  is_active?: boolean;
  is_staff?: boolean;
  date_joined?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  user?: User;
  detail?: string;
  [key: string]: any;
}

export interface RegisterPayload {
  username: string;
  email: string;
  phone_number: string;
  access_code: string;
  password: string;
  password2?: string;
  middle_man_code?: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export interface CompleteProfilePayload {
  first_name: string;
  last_name: string;
  phone_number?: string;
  email?: string;
  middle_man_code?: string;
}

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logoutApi(): Promise<{ detail?: string }> {
  return apiClient<{ detail?: string }>("/api/auth/logout/", {
    method: "POST",
  });
}

export async function registerApi(payload: RegisterPayload): Promise<User> {
  return apiClient<User>("/api/auth/register/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMeApi(): Promise<User> {
  return apiClient<User>("/api/auth/me/", {
    method: "GET",
  });
}

export async function updateMeApi(payload: Partial<User>): Promise<User> {
  return apiClient<User>("/api/auth/me/", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function changePasswordApi(payload: ChangePasswordPayload): Promise<{ detail?: string }> {
  return apiClient<{ detail?: string }>("/api/auth/me/", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function completeProfileApi(payload: CompleteProfilePayload): Promise<User> {
  return apiClient<User>("/api/auth/complete-profile/", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function refreshTokenApi(): Promise<{ detail?: string }> {
  return apiClient<{ detail?: string }>("/api/auth/refresh/", {
    method: "POST",
  });
}
