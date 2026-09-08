import { apiClient } from "@/lib/axios";
import { toQueryParams } from "@/lib/utils";
import { ApiPaginatedResponse, ApiSuccessResponse } from "@/types/api";
import { SupportTicket, TicketPriority, TicketStatus } from "@/types/support";

export interface CreateTicketInput {
  rideId?: string;
  subject: string;
  description: string;
  priority?: TicketPriority;
}

export async function createTicket(input: CreateTicketInput): Promise<SupportTicket> {
  const { data } = await apiClient.post<ApiSuccessResponse<SupportTicket>>(
    "/support/tickets",
    input
  );
  return data.data;
}

export async function listTickets(params: {
  status?: TicketStatus;
  priority?: TicketPriority;
  page?: number;
  limit?: number;
}): Promise<ApiPaginatedResponse<SupportTicket>> {
  const { data } = await apiClient.get<ApiPaginatedResponse<SupportTicket>>("/support/tickets", {
    params: toQueryParams(params),
  });
  return data;
}

export async function getTicket(id: string): Promise<SupportTicket> {
  const { data } = await apiClient.get<ApiSuccessResponse<SupportTicket>>(
    `/support/tickets/${id}`
  );
  return data.data;
}

export interface UpdateTicketInput {
  status?: TicketStatus;
  priority?: TicketPriority;
}

export async function updateTicket(
  id: string,
  input: UpdateTicketInput
): Promise<SupportTicket> {
  const { data } = await apiClient.patch<ApiSuccessResponse<SupportTicket>>(
    `/support/tickets/${id}`,
    input
  );
  return data.data;
}
