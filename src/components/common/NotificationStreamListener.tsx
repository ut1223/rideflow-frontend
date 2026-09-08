"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useNotificationStream } from "@/hooks/notifications/useNotificationStream";

/** Renders nothing — just keeps the SSE notification stream open for the current session. */
export function NotificationStreamListener() {
  const { isAuthenticated } = useAuth();
  useNotificationStream(isAuthenticated);
  return null;
}
