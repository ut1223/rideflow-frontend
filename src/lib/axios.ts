import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ApiErrorResponse } from "@/types/api";
import { AuthTokens } from "@/types/auth";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "./auth";

// NEXT_PUBLIC_* vars are inlined at build time, so this must be set wherever the app is built
// (e.g. Vercel's Environment Variables, not just a local, gitignored .env.local). Deliberately
// NOT a top-level throw when missing — that would crash every page's build (including ones that
// never call the API, like the auto-generated /_not-found), rather than failing at the point
// the value actually matters. Missing config surfaces loudly the first time a request is made.
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (!baseURL) {
    console.error(
      "NEXT_PUBLIC_API_BASE_URL is not set — API requests will fail. Set it in .env.local (dev) or your host's environment variables (production)."
    );
  }
  const token = getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const AUTH_ENDPOINTS_WITHOUT_REFRESH = ["/auth/login", "/auth/register", "/auth/refresh"];

// Shared in-flight refresh so concurrent 401s trigger exactly one /auth/refresh call.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await axios.post<{ data: AuthTokens }>(`${baseURL}/auth/refresh`, {
      refreshToken,
    });
    setTokens(response.data.data);
    return response.data.data.accessToken;
  } catch {
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const requestUrl = originalRequest?.url ?? "";
    const isAuthEndpoint = AUTH_ENDPOINTS_WITHOUT_REFRESH.some((path) =>
      requestUrl.includes(path)
    );

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      if (newAccessToken) {
        originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
        return apiClient(originalRequest);
      }

      clearTokens();
      if (typeof window !== "undefined") {
        // This runs inside an axios interceptor, outside the React tree, so useRouter()
        // isn't available — a hard redirect is the only option here, and it's desirable
        // anyway since it fully resets in-memory app state after an unrecoverable session.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
