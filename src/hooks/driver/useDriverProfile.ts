"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as driversService from "@/services/drivers.service";

export const driverProfileKeys = {
  me: ["drivers", "me"] as const,
  documents: ["drivers", "me", "documents"] as const,
  earnings: ["drivers", "me", "earnings"] as const,
};

export function useDriverProfileQuery() {
  return useQuery({
    queryKey: driverProfileKeys.me,
    queryFn: driversService.getMe,
    retry: false,
  });
}

export function useCreateDriverProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: driversService.createProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driverProfileKeys.me });
    },
  });
}

export function useUpdateDriverProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: driversService.updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driverProfileKeys.me });
    },
  });
}

export function useUpdateDriverStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: driversService.updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driverProfileKeys.me });
    },
  });
}

export function useDriverEarningsQuery() {
  return useQuery({
    queryKey: driverProfileKeys.earnings,
    queryFn: driversService.getEarnings,
  });
}
