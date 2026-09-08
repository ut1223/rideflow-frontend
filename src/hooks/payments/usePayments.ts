"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as paymentsService from "@/services/payments.service";
import { rideKeys } from "@/hooks/rides/useRides";
import { PaymentMethod, PaymentStatus } from "@/types/payment";

export const paymentKeys = {
  all: ["payments"] as const,
  list: (params: unknown) => ["payments", "list", params] as const,
  detail: (id: string) => ["payments", "detail", id] as const,
};

export function usePaymentsQuery(params: { status?: PaymentStatus; page?: number; limit?: number }) {
  return useQuery({
    queryKey: paymentKeys.list(params),
    queryFn: () => paymentsService.listPayments(params),
  });
}

export function usePaymentQuery(id: string) {
  return useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: () => paymentsService.getPayment(id),
    enabled: Boolean(id),
  });
}

export function useProcessPaymentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ rideId, method }: { rideId: string; method?: PaymentMethod }) =>
      paymentsService.processPayment(rideId, method),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      queryClient.invalidateQueries({ queryKey: rideKeys.all });
    },
  });
}
