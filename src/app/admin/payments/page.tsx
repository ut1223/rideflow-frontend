"use client";

import { useState } from "react";
import { useAdminPaymentsQuery } from "@/hooks/admin/useAdmin";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { TableToolbar } from "@/components/tables/TableToolbar";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Select } from "@/components/ui/Select";
import { PaymentStatusBadge } from "@/components/common/StatusBadge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { PaymentStatus } from "@/types/payment";

const STATUS_OPTIONS = [
  { label: "All statuses", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Success", value: "SUCCESS" },
  { label: "Failed", value: "FAILED" },
  { label: "Refunded", value: "REFUNDED" },
];

export default function AdminPaymentsPage() {
  const [status, setStatus] = useState<PaymentStatus | "">("");
  const [page, setPage] = useState(1);

  const paymentsQuery = useAdminPaymentsQuery({
    status: status || undefined,
    page,
    limit: 15,
  });

  return (
    <div>
      <PageHeader title="Payments" description="All payments processed on the platform." />

      <TableToolbar>
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as PaymentStatus | "");
            setPage(1);
          }}
          options={STATUS_OPTIONS}
          className="w-40"
          aria-label="Filter by status"
        />
      </TableToolbar>

      {paymentsQuery.isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white">
          <TableSkeleton />
        </div>
      ) : paymentsQuery.isError ? (
        <ErrorState error={paymentsQuery.error} onRetry={() => paymentsQuery.refetch()} />
      ) : !paymentsQuery.data || paymentsQuery.data.data.length === 0 ? (
        <EmptyState title="No payments match your filters" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Method</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Rider ID</th>
                  <th className="px-4 py-3 font-medium">Ride ID</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paymentsQuery.data.data.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{payment.method}</td>
                    <td className="px-4 py-3">
                      <PaymentStatusBadge status={payment.status} />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{payment.riderId}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{payment.rideId}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDateTime(payment.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-2">
            <Pagination meta={paymentsQuery.data.pagination} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
}
