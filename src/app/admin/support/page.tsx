"use client";

import { useState } from "react";
import { useAdminSupportTicketsQuery } from "@/hooks/admin/useAdmin";
import { useUpdateTicketMutation } from "@/hooks/support/useSupport";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { TableToolbar } from "@/components/tables/TableToolbar";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { TicketPriorityBadge, TicketStatusBadge } from "@/components/common/StatusBadge";
import { formatDateTime, getErrorMessage } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import { SupportTicket, TicketPriority, TicketStatus } from "@/types/support";

const STATUS_FILTER_OPTIONS = [
  { label: "All statuses", value: "" },
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Closed", value: "CLOSED" },
];

const STATUS_UPDATE_OPTIONS = STATUS_FILTER_OPTIONS.slice(1);

const PRIORITY_UPDATE_OPTIONS = [
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
  { label: "Urgent", value: "URGENT" },
];

export default function AdminSupportPage() {
  const [status, setStatus] = useState<TicketStatus | "">("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const { showToast } = useToast();

  const ticketsQuery = useAdminSupportTicketsQuery({
    status: status || undefined,
    page,
    limit: 15,
  });
  const updateMutation = useUpdateTicketMutation();

  function handleStatusChange(value: string) {
    if (!selected) return;
    updateMutation.mutate(
      { id: selected.id, input: { status: value as TicketStatus } },
      {
        onSuccess: (ticket) => {
          showToast("Ticket status updated", "success");
          setSelected(ticket);
        },
        onError: (error) => showToast(getErrorMessage(error), "error"),
      }
    );
  }

  function handlePriorityChange(value: string) {
    if (!selected) return;
    updateMutation.mutate(
      { id: selected.id, input: { priority: value as TicketPriority } },
      {
        onSuccess: (ticket) => {
          showToast("Ticket priority updated", "success");
          setSelected(ticket);
        },
        onError: (error) => showToast(getErrorMessage(error), "error"),
      }
    );
  }

  return (
    <div>
      <PageHeader title="Support" description="Manage support tickets across the platform." />

      <TableToolbar>
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as TicketStatus | "");
            setPage(1);
          }}
          options={STATUS_FILTER_OPTIONS}
          className="w-44"
          aria-label="Filter by status"
        />
      </TableToolbar>

      {ticketsQuery.isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white">
          <TableSkeleton />
        </div>
      ) : ticketsQuery.isError ? (
        <ErrorState error={ticketsQuery.error} onRetry={() => ticketsQuery.refetch()} />
      ) : !ticketsQuery.data || ticketsQuery.data.data.length === 0 ? (
        <EmptyState title="No support tickets" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Subject</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ticketsQuery.data.data.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => setSelected(ticket)}
                    className="cursor-pointer hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">{ticket.subject}</td>
                    <td className="px-4 py-3">
                      <TicketPriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <TicketStatusBadge status={ticket.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDateTime(ticket.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-2">
            <Pagination meta={ticketsQuery.data.pagination} onPageChange={setPage} />
          </div>
        </div>
      )}

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.subject ?? ""}>
        {selected && (
          <div className="space-y-4 text-sm">
            <p className="whitespace-pre-wrap text-slate-700">{selected.description}</p>
            <p className="text-xs text-slate-400">Created {formatDateTime(selected.createdAt)}</p>
            <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
              <Select
                label="Status"
                value={selected.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                options={STATUS_UPDATE_OPTIONS}
                disabled={updateMutation.isPending}
              />
              <Select
                label="Priority"
                value={selected.priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                options={PRIORITY_UPDATE_OPTIONS}
                disabled={updateMutation.isPending}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
