"use client";

import { useQuery } from "@tanstack/react-query";
import * as driversService from "@/services/drivers.service";

export function useDriverRidesQuery(params: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["drivers", "me", "rides", params],
    queryFn: () => driversService.getMyRides(params),
  });
}
