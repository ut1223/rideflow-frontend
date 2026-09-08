"use client";

import { useState } from "react";
import { usePaymentsQuery } from "@/hooks/payments/usePayments";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { PaymentStatusBadge } from "@/components/common/StatusBadge";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Payment } from "@/types/payment";

export default function RiderPaymentsPage() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Payment | null>(null);
  const paymentsQuery = usePaymentsQuery({ page, limit: 10 });

  return (
    <div>
      <PageHeader title="Payments" description="Your payment history." />

      {paymentsQuery.isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white">
          <TableSkeleton />
        </div>
      ) : paymentsQuery.isError ? (
        <ErrorState error={paymentsQuery.error} onRetry={() => paymentsQuery.refetch()} />
      ) : !paymentsQuery.data || paymentsQuery.data.data.length === 0 ? (
        <EmptyState title="No payments yet" description="Payments for completed rides will show up here." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Method</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paymentsQuery.data.data.map((payment) => (
                  <tr
                    key={payment.id}
                    onClick={() => setSelected(payment)}
                    className="cursor-pointer hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{payment.method}</td>
                    <td className="px-4 py-3">
                      <PaymentStatusBadge status={payment.status} />
                    </td>
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

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="Payment details">
        {selected && (
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Amount</dt>
              <dd className="font-medium text-slate-900">{formatCurrency(selected.amount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Method</dt>
              <dd className="font-medium text-slate-900">{selected.method}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Status</dt>
              <dd>
                <PaymentStatusBadge status={selected.status} />
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Transaction reference</dt>
              <dd className="font-mono text-xs text-slate-700">{selected.transactionReference}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Date</dt>
              <dd className="text-slate-700">{formatDateTime(selected.createdAt)}</dd>
            </div>
          </dl>
        )}
      </Modal>
    </div>
  );
}
