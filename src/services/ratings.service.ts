import { apiClient } from "@/lib/axios";
import { ApiSuccessResponse } from "@/types/api";
import { Rating } from "@/types/rating";

export interface CreateRatingInput {
  rideId: string;
  rating: number;
  comment?: string;
}

export async function createRating(input: CreateRatingInput): Promise<Rating> {
  const { data } = await apiClient.post<ApiSuccessResponse<Rating>>("/ratings", input);
  return data.data;
}
