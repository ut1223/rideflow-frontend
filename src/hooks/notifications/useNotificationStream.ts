"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getAccessToken } from "@/lib/auth";
import { useToast } from "@/providers/ToastProvider";
import { Notification } from "@/types/notification";
import { notificationKeys } from "./useNotifications";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Live notifications via Server-Sent Events (GET /notifications/stream). The native
 * EventSource API can't set an Authorization header, so the access token travels as a query
 * param instead — see authenticateStream on the backend. One known limitation: if the browser
 * has to reconnect (network drop) after the access token has expired, EventSource retries the
 * exact same URL with the now-stale token and the reconnect will 401. The already-open
 * connection itself doesn't re-check the token per message, so this only affects the reconnect
 * case, not normal usage within a session.
 */
export function useNotificationStream(enabled: boolean) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  useEffect(() => {
    if (!enabled) return;

    const token = getAccessToken();
    if (!token || !API_BASE_URL) return;

    const source = new EventSource(
      `${API_BASE_URL}/notifications/stream?token=${encodeURIComponent(token)}`
    );

    function handleNotification(event: MessageEvent<string>) {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      try {
        const notification = JSON.parse(event.data) as Notification;
        showToast(notification.title, "info");
      } catch {
        // Malformed payload — the query invalidation above still keeps the list correct.
      }
    }

    source.addEventListener("notification", handleNotification);

    return () => {
      source.removeEventListener("notification", handleNotification);
      source.close();
    };
  }, [enabled, queryClient, showToast]);
}
