"use client";

import { ReactNode, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { ROLE_HOME_ROUTE } from "@/constants/roles";
import { Role } from "@/types/user";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

function subscribeNoop() {
  return () => {};
}
function getClientSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}

/** True only after the client has hydrated — keeps the first client render matching SSR
 *  output (both "not mounted") instead of reading localStorage-derived state too early. */
function useMounted(): boolean {
  return useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot);
}

/**
 * Frontend-only role gate for UX (redirects to login / the correct dashboard). The backend's
 * authorize() middleware remains the real security boundary — this never replaces it.
 */
export function RoleGuard({ role, children }: { role: Role; children: ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const mounted = useMounted();

  useEffect(() => {
    if (!mounted || isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (user && user.role !== role) {
      router.replace(ROLE_HOME_ROUTE[user.role]);
    }
  }, [mounted, isLoading, isAuthenticated, user, role, router]);

  const isReady = mounted && !isLoading && isAuthenticated && user?.role === role;

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
