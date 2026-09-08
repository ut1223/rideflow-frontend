"use client";

import { useEffect, useRef } from "react";
import { useDriverProfileQuery, useUpdateDriverStatusMutation } from "@/hooks/driver/useDriverProfile";

/**
 * Renders nothing — automatically brings a verified driver online the moment their profile
 * loads (i.e. as soon as they're on any /driver/* page after logging in or reloading). There's
 * no manual toggle; going offline happens on logout instead (see AuthProvider.logout). If the
 * driver isn't verified yet, this simply never succeeds, which is the correct behavior — the
 * backend already refuses to bring an unverified driver online.
 */
export function DriverOnlineStatusSync() {
  const { data: driver } = useDriverProfileQuery();
  const updateStatus = useUpdateDriverStatusMutation();
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (!driver || attemptedRef.current) return;
    if (driver.isVerified && !driver.isOnline) {
      attemptedRef.current = true;
      updateStatus.mutate(true);
    }
  }, [driver, updateStatus]);

  return null;
}
