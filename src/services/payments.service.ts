import { apiClient } from "@/lib/axios";
import { toQueryParams } from "@/lib/utils";
import { ApiPaginatedResponse, ApiSuccessResponse } from "@/types/api";
import { Payment, PaymentMethod, PaymentStatus } from "@/types/payment";

export async function processPayment(
  rideId: string,
  method: PaymentMethod = "CASH"
): Promise<Payment> {
  const { data } = await apiClient.post<ApiSuccessResponse<Payment>>(
    `/payments/${rideId}/process`,
    { method }
  );
  return data.data;
}

export async function getPayment(id: string): Promise<Payment> {
  const { data } = await apiClient.get<ApiSuccessResponse<Payment>>(`/payments/${id}`);
  return data.data;
}

export async function listPayments(params: {
  status?: PaymentStatus;
  page?: number;
  limit?: number;
}): Promise<ApiPaginatedResponse<Payment>> {
  const { data } = await apiClient.get<ApiPaginatedResponse<Payment>>("/payments", {
    params: toQueryParams(params),
  });
  return data;
}
