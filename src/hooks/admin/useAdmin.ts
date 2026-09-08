"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as adminService from "@/services/admin.service";
import * as driversService from "@/services/drivers.service";
import { PaymentStatus } from "@/types/payment";
import { RideStatus } from "@/types/ride";
import { TicketStatus } from "@/types/support";
import { Role, UserStatus } from "@/types/user";

export const adminKeys = {
  dashboard: ["admin", "dashboard"] as const,
  users: (params: unknown) => ["admin", "users", params] as const,
  riders: (params: unknown) => ["admin", "riders", params] as const,
  drivers: (params: unknown) => ["admin", "drivers", params] as const,
  driver: (id: string) => ["admin", "drivers", "detail", id] as const,
  rides: (params: unknown) => ["admin", "rides", params] as const,
  payments: (params: unknown) => ["admin", "payments", params] as const,
  support: (params: unknown) => ["admin", "support", params] as const,
};

export function useAdminDashboardQuery() {
  return useQuery({ queryKey: adminKeys.dashboard, queryFn: adminService.getDashboard });
}

export function useAdminUsersQuery(params: {
  search?: string;
  role?: Role;
  status?: UserStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => adminService.listUsers(params),
  });
}

export function useAdminRidersQuery(params: {
  search?: string;
  status?: UserStatus;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: adminKeys.riders(params),
    queryFn: () => adminService.listRiders(params),
  });
}

export function useAdminDriversQuery(params: {
  search?: string;
  verified?: boolean;
  online?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  return useQuery({
    queryKey: adminKeys.drivers(params),
    queryFn: () => adminService.listDrivers(params),
  });
}

export function useAdminDriverQuery(id: string) {
  return useQuery({
    queryKey: adminKeys.driver(id),
    queryFn: () => adminService.getDriver(id),
    enabled: Boolean(id),
  });
}

export function useVerifyDriverMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.verifyDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "drivers"] });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard });
    },
  });
}

export function useRejectDriverMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.rejectDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "drivers"] });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard });
    },
  });
}

export function useAdminRidesQuery(params: {
  search?: string;
  status?: RideStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  return useQuery({
    queryKey: adminKeys.rides(params),
    queryFn: () => adminService.listRides(params),
  });
}

export function useAdminPaymentsQuery(params: {
  status?: PaymentStatus;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: adminKeys.payments(params),
    queryFn: () => adminService.listPayments(params),
  });
}

/** GET /drivers/:driverId/ratings is open to any authenticated role, so this doubles as the
 *  admin driver-detail page's ratings panel — there's no separate admin-only ratings endpoint. */
export function useDriverRatingsQuery(driverId: string, params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["drivers", driverId, "ratings", params],
    queryFn: () => driversService.getDriverRatings(driverId, params),
    enabled: Boolean(driverId),
  });
}

export function useAdminSupportTicketsQuery(params: {
  status?: TicketStatus;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: adminKeys.support(params),
    queryFn: () => adminService.listSupportTickets(params),
  });
}
