"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as supportService from "@/services/support.service";
import { TicketPriority, TicketStatus } from "@/types/support";

export const supportKeys = {
  all: ["support", "tickets"] as const,
  list: (params: unknown) => ["support", "tickets", "list", params] as const,
  detail: (id: string) => ["support", "tickets", "detail", id] as const,
};

export function useSupportTicketsQuery(params: {
  status?: TicketStatus;
  priority?: TicketPriority;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: supportKeys.list(params),
    queryFn: () => supportService.listTickets(params),
  });
}

export function useSupportTicketQuery(id: string) {
  return useQuery({
    queryKey: supportKeys.detail(id),
    queryFn: () => supportService.getTicket(id),
    enabled: Boolean(id),
  });
}

export function useCreateTicketMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: supportService.createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supportKeys.all });
    },
  });
}

export function useUpdateTicketMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: supportService.UpdateTicketInput }) =>
      supportService.updateTicket(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supportKeys.all });
      // Admin's ticket table lives under a separate ["admin", "support"] key (adminService),
      // not ["support", "tickets"] — an update here (PATCH is admin-only) must refresh both.
      queryClient.invalidateQueries({ queryKey: ["admin", "support"] });
    },
  });
}
