"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ridesService from "@/services/rides.service";
import { Ride, RideStatus } from "@/types/ride";

export const rideKeys = {
  all: ["rides"] as const,
  list: (params: unknown) => ["rides", "list", params] as const,
  detail: (id: string) => ["rides", "detail", id] as const,
  history: (id: string) => ["rides", "history", id] as const,
};

export interface RideListParams {
  status?: RideStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useRidesQuery(params: RideListParams) {
  return useQuery({
    queryKey: rideKeys.list(params),
    queryFn: () => ridesService.listRides(params),
  });
}

export function useRideQuery(id: string) {
  return useQuery({
    queryKey: rideKeys.detail(id),
    queryFn: () => ridesService.getRide(id),
    enabled: Boolean(id),
  });
}

export function useRideHistoryQuery(id: string) {
  return useQuery({
    queryKey: rideKeys.history(id),
    queryFn: () => ridesService.getRideHistory(id),
    enabled: Boolean(id),
  });
}

export function useEstimateFareMutation() {
  return useMutation({ mutationFn: ridesService.estimateFare });
}

export function useCreateRideMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ridesService.createRide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rideKeys.all });
    },
  });
}

function useRideActionMutation(mutationFn: (id: string) => Promise<Ride>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rideKeys.all });
    },
  });
}

export function useAcceptRideMutation() {
  return useRideActionMutation(ridesService.acceptRide);
}

export function useArrivingRideMutation() {
  return useRideActionMutation(ridesService.markArriving);
}

export function useArrivedRideMutation() {
  return useRideActionMutation(ridesService.markArrived);
}

export function useStartRideMutation() {
  return useRideActionMutation(ridesService.startRide);
}

export function useCompleteRideMutation() {
  return useRideActionMutation(ridesService.completeRide);
}

export function useCancelRideMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      ridesService.cancelRide(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rideKeys.all });
    },
  });
}
