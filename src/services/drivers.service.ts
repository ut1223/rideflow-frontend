import { apiClient } from "@/lib/axios";
import { toQueryParams } from "@/lib/utils";
import { ApiPaginatedResponse, ApiSuccessResponse } from "@/types/api";
import { Driver, DriverDocument, DriverEarnings, DriverProfile, DocumentType } from "@/types/driver";
import { DriverRatingsResult } from "@/types/rating";
import { Ride } from "@/types/ride";

export async function createProfile(licenseNumber: string): Promise<Driver> {
  const { data } = await apiClient.post<ApiSuccessResponse<Driver>>("/drivers/profile", {
    licenseNumber,
  });
  return data.data;
}

export async function getMe(): Promise<DriverProfile> {
  const { data } = await apiClient.get<ApiSuccessResponse<DriverProfile>>("/drivers/me");
  return data.data;
}

export interface UpdateDriverProfileInput {
  currentLatitude?: number;
  currentLongitude?: number;
}

export async function updateMe(input: UpdateDriverProfileInput): Promise<Driver> {
  const { data } = await apiClient.patch<ApiSuccessResponse<Driver>>("/drivers/me", input);
  return data.data;
}

export async function updateStatus(isOnline: boolean): Promise<Driver> {
  const { data } = await apiClient.patch<ApiSuccessResponse<Driver>>("/drivers/me/status", {
    isOnline,
  });
  return data.data;
}

export async function addDocument(input: {
  documentType: DocumentType;
  documentUrl: string;
}): Promise<DriverDocument> {
  const { data } = await apiClient.post<ApiSuccessResponse<DriverDocument>>(
    "/drivers/me/documents",
    input
  );
  return data.data;
}

export async function getDocuments(): Promise<DriverDocument[]> {
  const { data } = await apiClient.get<ApiSuccessResponse<DriverDocument[]>>(
    "/drivers/me/documents"
  );
  return data.data;
}

export async function getMyRides(params: {
  page?: number;
  limit?: number;
}): Promise<ApiPaginatedResponse<Ride>> {
  const { data } = await apiClient.get<ApiPaginatedResponse<Ride>>("/drivers/me/rides", {
    params: toQueryParams(params),
  });
  return data;
}

export async function getEarnings(): Promise<DriverEarnings> {
  const { data } = await apiClient.get<ApiSuccessResponse<DriverEarnings>>(
    "/drivers/me/earnings"
  );
  return data.data;
}

export async function getDriverRatings(
  driverId: string,
  params: { page?: number; limit?: number }
): Promise<DriverRatingsResult> {
  const { data } = await apiClient.get<ApiSuccessResponse<DriverRatingsResult>>(
    `/drivers/${driverId}/ratings`,
    { params: toQueryParams(params) }
  );
  return data.data;
}
