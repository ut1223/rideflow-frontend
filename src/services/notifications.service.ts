import { apiClient } from "@/lib/axios";
import { toQueryParams } from "@/lib/utils";
import { ApiPaginatedResponse, ApiSuccessResponse } from "@/types/api";
import { Notification } from "@/types/notification";

export async function listNotifications(params: {
  page?: number;
  limit?: number;
}): Promise<ApiPaginatedResponse<Notification>> {
  const { data } = await apiClient.get<ApiPaginatedResponse<Notification>>("/notifications", {
    params: toQueryParams(params),
  });
  return data;
}

export async function markAsRead(id: string): Promise<Notification> {
  const { data } = await apiClient.patch<ApiSuccessResponse<Notification>>(
    `/notifications/${id}/read`
  );
  return data.data;
}

export async function markAllAsRead(): Promise<void> {
  await apiClient.patch<ApiSuccessResponse<null>>("/notifications/read-all");
}
