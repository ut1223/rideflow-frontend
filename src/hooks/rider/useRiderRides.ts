"use client";

import { useQuery } from "@tanstack/react-query";
import * as usersService from "@/services/users.service";

export function useMyRidesQuery(params: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["users", "me", "rides", params],
    queryFn: () => usersService.getMyRides(params),
  });
}
