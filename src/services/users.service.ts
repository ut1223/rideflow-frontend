import { apiClient } from "@/lib/axios";
import { toQueryParams } from "@/lib/utils";
import { ApiPaginatedResponse, ApiSuccessResponse } from "@/types/api";
import { RideWithDriver } from "@/types/ride";
import { User } from "@/types/user";

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<ApiSuccessResponse<User>>("/users/me");
  return data.data;
}

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
}

export async function updateMe(input: UpdateProfileInput): Promise<User> {
  const { data } = await apiClient.patch<ApiSuccessResponse<User>>("/users/me", input);
  return data.data;
}

export async function getMyRides(params: {
  page?: number;
  limit?: number;
}): Promise<ApiPaginatedResponse<RideWithDriver>> {
  const { data } = await apiClient.get<ApiPaginatedResponse<RideWithDriver>>("/users/me/rides", {
    params: toQueryParams(params),
  });
  return data;
}
