import { apiClient } from "@/lib/axios";
import { toQueryParams } from "@/lib/utils";
import { AdminDashboard } from "@/types/admin";
import { ApiPaginatedResponse, ApiSuccessResponse } from "@/types/api";
import { AdminDriverDetail, AdminDriverSummary } from "@/types/driver";
import { Payment, PaymentStatus } from "@/types/payment";
import { Ride, RideStatus } from "@/types/ride";
import { SupportTicket, TicketStatus } from "@/types/support";
import { Role, User, UserStatus } from "@/types/user";

export async function getDashboard(): Promise<AdminDashboard> {
  const { data } = await apiClient.get<ApiSuccessResponse<AdminDashboard>>("/admin/dashboard");
  return data.data;
}

export async function listUsers(params: {
  search?: string;
  role?: Role;
  status?: UserStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<ApiPaginatedResponse<User>> {
  const { data } = await apiClient.get<ApiPaginatedResponse<User>>("/admin/users", {
    params: toQueryParams(params),
  });
  return data;
}

export async function listRiders(params: {
  search?: string;
  status?: UserStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<ApiPaginatedResponse<User>> {
  const { data } = await apiClient.get<ApiPaginatedResponse<User>>("/admin/riders", {
    params: toQueryParams(params),
  });
  return data;
}

export async function listDrivers(params: {
  search?: string;
  verified?: boolean;
  online?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<ApiPaginatedResponse<AdminDriverSummary>> {
  const { data } = await apiClient.get<ApiPaginatedResponse<AdminDriverSummary>>(
    "/admin/drivers",
    { params: toQueryParams(params) }
  );
  return data;
}

export async function getDriver(id: string): Promise<AdminDriverDetail> {
  const { data } = await apiClient.get<ApiSuccessResponse<AdminDriverDetail>>(
    `/admin/drivers/${id}`
  );
  return data.data;
}

export async function verifyDriver(id: string): Promise<AdminDriverDetail> {
  const { data } = await apiClient.patch<ApiSuccessResponse<AdminDriverDetail>>(
    `/admin/drivers/${id}/verify`
  );
  return data.data;
}

export async function rejectDriver(id: string): Promise<AdminDriverDetail> {
  const { data } = await apiClient.patch<ApiSuccessResponse<AdminDriverDetail>>(
    `/admin/drivers/${id}/reject`
  );
  return data.data;
}

export async function listRides(params: {
  search?: string;
  status?: RideStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<ApiPaginatedResponse<Ride>> {
  const { data } = await apiClient.get<ApiPaginatedResponse<Ride>>("/admin/rides", {
    params: toQueryParams(params),
  });
  return data;
}

export async function listPayments(params: {
  status?: PaymentStatus;
  page?: number;
  limit?: number;
}): Promise<ApiPaginatedResponse<Payment>> {
  const { data } = await apiClient.get<ApiPaginatedResponse<Payment>>("/admin/payments", {
    params: toQueryParams(params),
  });
  return data;
}

export async function listSupportTickets(params: {
  status?: TicketStatus;
  page?: number;
  limit?: number;
}): Promise<ApiPaginatedResponse<SupportTicket>> {
  const { data } = await apiClient.get<ApiPaginatedResponse<SupportTicket>>(
    "/admin/support/tickets",
    { params: toQueryParams(params) }
  );
  return data;
}
