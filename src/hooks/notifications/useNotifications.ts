"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as notificationsService from "@/services/notifications.service";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (page: number, limit: number) => ["notifications", "list", page, limit] as const,
};

export function useNotificationsQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey: notificationKeys.list(page, limit),
    queryFn: () => notificationsService.listNotifications({ page, limit }),
  });
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
