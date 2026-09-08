"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import * as ratingsService from "@/services/ratings.service";
import { rideKeys } from "@/hooks/rides/useRides";
import { ApiErrorResponse } from "@/types/api";

export function useCreateRatingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ratingsService.createRating,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rideKeys.all });
    },
    onError: (error) => {
      // Race condition (e.g. two tabs): the ride's cached `rating` was stale-null. Refetch so
      // the UI swaps to the already-submitted view instead of leaving the input form stuck.
      const code = (error as AxiosError<ApiErrorResponse>).response?.data?.error;
      if (code === "RIDE_ALREADY_RATED") {
        queryClient.invalidateQueries({ queryKey: rideKeys.all });
      }
    },
  });
}
