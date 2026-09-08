"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as vehiclesService from "@/services/vehicles.service";

export const vehicleKeys = {
  all: ["vehicles"] as const,
  detail: (id: string) => ["vehicles", "detail", id] as const,
};

export function useVehiclesQuery() {
  return useQuery({
    queryKey: vehicleKeys.all,
    queryFn: vehiclesService.listVehicles,
  });
}

export function useCreateVehicleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: vehiclesService.createVehicle,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: vehicleKeys.all }),
  });
}

export function useUpdateVehicleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: vehiclesService.UpdateVehicleInput }) =>
      vehiclesService.updateVehicle(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: vehicleKeys.all }),
  });
}

export function useDeleteVehicleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: vehiclesService.deleteVehicle,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: vehicleKeys.all }),
  });
}
