import { apiClient } from "@/lib/axios";
import { toQueryParams } from "@/lib/utils";
import { ApiPaginatedResponse, ApiSuccessResponse } from "@/types/api";
import { FareEstimate, Ride, RideDetail, RideStatus, RideStatusHistoryEntry } from "@/types/ride";

export interface EstimateFareInput {
  pickupLatitude: number;
  pickupLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
}

export async function estimateFare(input: EstimateFareInput): Promise<FareEstimate> {
  const { data } = await apiClient.post<ApiSuccessResponse<FareEstimate>>(
    "/rides/estimate",
    input
  );
  return data.data;
}

export interface CreateRideInput {
  pickupAddress: string;
  destinationAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  estimatedDistance: number;
  estimatedDuration: number;
  estimatedFare: number;
}

export async function createRide(input: CreateRideInput): Promise<Ride> {
  const { data } = await apiClient.post<ApiSuccessResponse<Ride>>("/rides", input);
  return data.data;
}

export async function listRides(params: {
  status?: RideStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<ApiPaginatedResponse<Ride>> {
  const { data } = await apiClient.get<ApiPaginatedResponse<Ride>>("/rides", {
    params: toQueryParams(params),
  });
  return data;
}

export async function getRide(id: string): Promise<RideDetail> {
  const { data } = await apiClient.get<ApiSuccessResponse<RideDetail>>(`/rides/${id}`);
  return data.data;
}

export async function getRideHistory(id: string): Promise<RideStatusHistoryEntry[]> {
  const { data } = await apiClient.get<ApiSuccessResponse<RideStatusHistoryEntry[]>>(
    `/rides/${id}/history`
  );
  return data.data;
}

export async function acceptRide(id: string): Promise<Ride> {
  const { data } = await apiClient.patch<ApiSuccessResponse<Ride>>(`/rides/${id}/accept`);
  return data.data;
}

export async function markArriving(id: string): Promise<Ride> {
  const { data } = await apiClient.patch<ApiSuccessResponse<Ride>>(`/rides/${id}/arriving`);
  return data.data;
}

export async function markArrived(id: string): Promise<Ride> {
  const { data } = await apiClient.patch<ApiSuccessResponse<Ride>>(`/rides/${id}/arrived`);
  return data.data;
}

export async function startRide(id: string): Promise<Ride> {
  const { data } = await apiClient.patch<ApiSuccessResponse<Ride>>(`/rides/${id}/start`);
  return data.data;
}

export async function completeRide(id: string): Promise<Ride> {
  const { data } = await apiClient.patch<ApiSuccessResponse<Ride>>(`/rides/${id}/complete`);
  return data.data;
}

export async function cancelRide(id: string, reason?: string): Promise<Ride> {
  const { data } = await apiClient.patch<ApiSuccessResponse<Ride>>(`/rides/${id}/cancel`, {
    reason,
  });
  return data.data;
}
