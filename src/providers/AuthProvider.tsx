"use client";

import { ReactNode, createContext, useCallback, useContext, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as authService from "@/services/auth.service";
import * as driversService from "@/services/drivers.service";
import { clearTokens, hasStoredSession, setTokens } from "@/lib/auth";
import { AuthResponse } from "@/types/auth";
import { User } from "@/types/user";

export const CURRENT_USER_QUERY_KEY = ["auth", "me"] as const;

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** Persists tokens + seeds the current-user cache after a successful login/register call. */
  applySession: (auth: AuthResponse) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: authService.getCurrentUser,
    enabled: hasStoredSession(),
    retry: false,
    staleTime: 60_000,
  });

  const applySession = useCallback(
    (auth: AuthResponse) => {
      setTokens(auth);
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, auth.user);
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    const currentUser = queryClient.getQueryData<User>(CURRENT_USER_QUERY_KEY);

    if (currentUser?.role === "DRIVER") {
      try {
        // Best-effort — there's no manual toggle, so going offline happens here instead (the
        // matching "go online" side effect is DriverOnlineStatusSync). This can legitimately
        // fail (e.g. the backend refuses to go offline mid-ride) — logout must proceed anyway.
        await driversService.updateStatus(false);
      } catch {
        // Ignored — see comment above.
      }
    }

    try {
      await authService.logout();
    } catch {
      // Backend logout is stateless (no server-side session to revoke) — clear locally regardless.
    }
    clearTokens();
    queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isLoading: hasStoredSession() && isLoading,
      isAuthenticated: Boolean(user),
      applySession,
      logout,
    }),
    [user, isLoading, applySession, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
