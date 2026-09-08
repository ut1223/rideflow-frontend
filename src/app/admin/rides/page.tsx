"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminRidesQuery } from "@/hooks/admin/useAdmin";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { TableToolbar } from "@/components/tables/TableToolbar";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Select } from "@/components/ui/Select";
import { PaymentStatusBadge, RideStatusBadge } from "@/components/common/StatusBadge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { RideStatus } from "@/types/ride";

const STATUS_OPTIONS = [
  { label: "All statuses", value: "" },
  { label: "Requested", value: "REQUESTED" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Driver Arriving", value: "DRIVER_ARRIVING" },
  { label: "Driver Arrived", value: "DRIVER_ARRIVED" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function AdminRidesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<RideStatus | "">("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);

  const ridesQuery = useAdminRidesQuery({
    search: debouncedSearch || undefined,
    status: status || undefined,
    page,
    limit: 15,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return (
    <div>
      <PageHeader title="Rides" description="All rides across the platform." />

      <TableToolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      >
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as RideStatus | "");
            setPage(1);
          }}
          options={STATUS_OPTIONS}
          className="w-48"
          aria-label="Filter by status"
        />
      </TableToolbar>

      {ridesQuery.isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white">
          <TableSkeleton />
        </div>
      ) : ridesQuery.isError ? (
        <ErrorState error={ridesQuery.error} onRetry={() => ridesQuery.refetch()} />
      ) : !ridesQuery.data || ridesQuery.data.data.length === 0 ? (
        <EmptyState title="No rides match your filters" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Route</th>
                  <th className="px-4 py-3 font-medium">Fare</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ridesQuery.data.data.map((ride) => (
                  <tr key={ride.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{ride.pickupAddress}</p>
                      <p className="text-xs text-slate-500">→ {ride.destinationAddress}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatCurrency(ride.finalFare ?? ride.estimatedFare)}
                    </td>
                    <td className="px-4 py-3">
                      <RideStatusBadge status={ride.status} />
                    </td>
                    <td className="px-4 py-3">
                      <PaymentStatusBadge status={ride.paymentStatus} />
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDateTime(ride.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/rides/${ride.id}`}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-2">
            <Pagination meta={ridesQuery.data.pagination} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
}
