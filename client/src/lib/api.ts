
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";
const ACCESS_TOKEN_KEY = "techstax.access-token";
const REFRESH_TOKEN_KEY = "techstax.refresh-token";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const tokenStore = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  set(tokens: { accessToken: string; refreshToken: string }) {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  },
  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;
  const isFormData = body instanceof FormData;
  const response = await fetch(API_URL + path, {
    ...rest,
    headers: {
      ...(auth && tokenStore.getAccessToken() ? { Authorization: "Bearer " + tokenStore.getAccessToken() } : {}),
      ...(!isFormData && body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers
    },
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body)
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success) {
    throw new ApiError(payload?.error ?? "Request failed", response.status, payload?.details);
  }

  return payload.data as T;
}

export const api = {
  get<T>(path: string, auth = true) {
    return request<T>(path, { method: "GET", auth });
  },
  post<T>(path: string, body?: unknown, auth = true) {
    return request<T>(path, { method: "POST", body, auth });
  },
  patch<T>(path: string, body?: unknown, auth = true) {
    return request<T>(path, { method: "PATCH", body, auth });
  },
  delete<T>(path: string, auth = true) {
    return request<T>(path, { method: "DELETE", auth });
  }
};

export function getApiBaseUrl() {
  return API_URL.replace(/\/api\/v1$/, "");
}
