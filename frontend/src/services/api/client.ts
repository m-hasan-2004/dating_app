const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string>;
  _retry?: boolean;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiClient<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { params, headers, _retry, ...customConfig } = options;

  let url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const isFormData = customConfig.body instanceof FormData;

  const defaultHeaders: HeadersInit = isFormData
    ? {}
    : {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

  const config: RequestInit = {
    method: "GET",
    credentials: "include",
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...customConfig,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401 && !_retry && !endpoint.includes("/api/auth/login") && !endpoint.includes("/api/auth/refresh")) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (refreshResponse.ok) {
          return apiClient<T>(endpoint, { ...options, _retry: true });
        }
      } catch {
        // Refresh failed
      }
    }

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = { detail: response.statusText };
      }

      const errorMessage =
        errorData.detail ||
        errorData.message ||
        (typeof errorData === "object" ? JSON.stringify(errorData) : "An unexpected error occurred");

      throw new ApiError(response.status, errorMessage, errorData);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, (error as Error).message || "Network error");
  }
}
