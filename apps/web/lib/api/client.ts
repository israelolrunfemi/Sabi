import { apiRoutes } from "./routes";
import type { ApiError, ApiFailure, ApiSuccess } from "./types";

function getApiBase() {
  if (typeof window !== "undefined") return "/api";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return new URL("/api", appUrl).toString().replace(/\/$/, "");
}

function getStoredToken(key: "accessToken" | "refreshToken") {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

function setStoredToken(key: "accessToken" | "refreshToken", value: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}

function clearStoredTokens() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("accessToken");
  window.localStorage.removeItem("refreshToken");
}

function buildUrl(path: string) {
  return `${getApiBase()}${path}`;
}

function parseQuery(params?: Record<string, string | number | boolean | null | undefined>) {
  if (!params) return "";

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

async function readError(response: Response): Promise<ApiError> {
  const payload = (await response.json().catch(() => null)) as ApiFailure | null;

  return {
    status: response.status,
    success: false,
    message: payload?.message ?? "Request failed",
    errors: payload?.errors ?? null,
  };
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const accessToken = getStoredToken("accessToken");

  const response = await fetch(buildUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...init.headers,
    },
  });

  const payload = (await response.json().catch(() => null)) as ApiSuccess<T> | ApiFailure | null;

  if (!response.ok || !payload || payload.success === false) {
    throw await readError(response);
  }

  return (payload as ApiSuccess<T>).data;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}) {
  return request<T>(path, init);
}

export async function apiFetchWithRefresh<T>(path: string, init: RequestInit = {}) {
  try {
    return await request<T>(path, init);
  } catch (error) {
    const apiError = error as ApiError;

    if (typeof window === "undefined" || apiError.status !== 401) {
      throw error;
    }

    const refreshToken = getStoredToken("refreshToken");
    if (!refreshToken) throw error;

    const refreshResponse = await fetch(buildUrl(apiRoutes.auth.refresh), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const refreshPayload = (await refreshResponse
      .json()
      .catch(() => null)) as ApiSuccess<{ accessToken: string }> | ApiFailure | null;

    if (!refreshResponse.ok || !refreshPayload || refreshPayload.success === false) {
      clearStoredTokens();
      throw error;
    }

    const nextAccessToken = (refreshPayload as ApiSuccess<{ accessToken: string }>).data.accessToken;
    setStoredToken("accessToken", nextAccessToken);

    return request<T>(path, init);
  }
}

export async function apiDownload(path: string, init: RequestInit = {}) {
  const accessToken = getStoredToken("accessToken");

  const response = await fetch(buildUrl(path), {
    ...init,
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw await readError(response);
  }

  return response.blob();
}

export { clearStoredTokens, getStoredToken, parseQuery, setStoredToken };
