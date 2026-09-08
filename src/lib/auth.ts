import { AuthTokens } from "@/types/auth";

const ACCESS_TOKEN_KEY = "rideflow.accessToken";
const REFRESH_TOKEN_KEY = "rideflow.refreshToken";

/**
 * Token storage strategy: the RideFlow backend is stateless JWT with no server-side
 * refresh-token persistence and no httpOnly cookie support (tokens come back in the JSON
 * body), so there is no cookie-based option available. Access + refresh tokens are kept in
 * localStorage so a page reload doesn't force a re-login, mirrored by an in-memory cache for
 * synchronous reads on every request. This is a deliberate tradeoff (localStorage is
 * readable by any script on the page) accepted because the backend contract leaves no safer
 * alternative — see README "Authentication & Token Storage".
 */
let accessTokenMemory: string | null = null;

export function getAccessToken(): string | null {
  if (accessTokenMemory !== null) return accessTokenMemory;
  if (typeof window === "undefined") return null;
  accessTokenMemory = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  return accessTokenMemory;
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(tokens: AuthTokens): void {
  accessTokenMemory = tokens.accessToken;
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function clearTokens(): void {
  accessTokenMemory = null;
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function hasStoredSession(): boolean {
  return getRefreshToken() !== null;
}
