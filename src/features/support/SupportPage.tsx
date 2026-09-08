"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useCreateTicketMutation, useSupportTicketsQuery } from "@/hooks/support/useSupport";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { TicketPriorityBadge, TicketStatusBadge } from "@/components/common/StatusBadge";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { formatDateTime, getErrorMessage } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import { CreateTicketFormValues, createTicketSchema } from "./support.schemas";
import { SupportTicket } from "@/types/support";

export function SupportPage() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const { showToast } = useToast();

  const ticketsQuery = useSupportTicketsQuery({ page, limit: 10 });
  const createMutation = useCreateTicketMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: { priority: "MEDIUM" },
  });

  function onSubmit(values: CreateTicketFormValues) {
    createMutation.mutate(values, {
      onSuccess: () => {
        showToast("Support ticket created", "success");
        reset({ subject: "", description: "", priority: "MEDIUM" });
        setCreateOpen(false);
      },
      onError: (error) => showToast(getErrorMessage(error), "error"),
    });
  }

  return (
    <div>
      <PageHeader
        title="Support"
        description="Get help with your rides or account."
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" /> New Ticket
          </Button>
        }
      />

      {ticketsQuery.isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white">
          <TableSkeleton />
        </div>
      ) : ticketsQuery.isError ? (
        <ErrorState error={ticketsQuery.error} onRetry={() => ticketsQuery.refetch()} />
      ) : !ticketsQuery.data || ticketsQuery.data.data.length === 0 ? (
        <EmptyState title="No support tickets" description="Tickets you raise will appear here." />
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

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New support ticket">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input label="Subject" error={errors.subject?.message} {...register("subject")} />
          <Textarea
            label="Description"
            error={errors.description?.message}
            {...register("description")}
          />
          <Select
            label="Priority"
            options={[
              { label: "Low", value: "LOW" },
              { label: "Medium", value: "MEDIUM" },
              { label: "High", value: "HIGH" },
              { label: "Urgent", value: "URGENT" },
            ]}
            error={errors.priority?.message}
            {...register("priority")}
          />
          <Button type="submit" className="w-full" isLoading={createMutation.isPending}>
            Submit Ticket
          </Button>
        </form>
      </Modal>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.subject ?? ""}>
        {selected && (
          <div className="space-y-3 text-sm">
            <div className="flex gap-2">
              <TicketStatusBadge status={selected.status} />
              <TicketPriorityBadge priority={selected.priority} />
            </div>
            <p className="whitespace-pre-wrap text-slate-700">{selected.description}</p>
            <p className="text-xs text-slate-400">Created {formatDateTime(selected.createdAt)}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
