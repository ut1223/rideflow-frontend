"use client";

import { useState } from "react";
import Link from "next/link";
import { useMyRidesQuery } from "@/hooks/rider/useRiderRides";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { RideStatusBadge } from "@/components/common/StatusBadge";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function RiderRidesPage() {
  const [page, setPage] = useState(1);
  const ridesQuery = useMyRidesQuery({ page, limit: 10 });

  return (
    <div>
      <PageHeader title="My Rides" description="Your ride history." />

      {ridesQuery.isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white">
          <TableSkeleton />
        </div>
      ) : ridesQuery.isError ? (
        <ErrorState error={ridesQuery.error} onRetry={() => ridesQuery.refetch()} />
      ) : !ridesQuery.data || ridesQuery.data.data.length === 0 ? (
        <EmptyState title="No rides found" description="Rides you book will appear here." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Route</th>
                  <th className="px-4 py-3 font-medium">Driver</th>
                  <th className="px-4 py-3 font-medium">Fare</th>
                  <th className="px-4 py-3 font-medium">Status</th>
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
                    <td className="px-4 py-3 text-slate-600">{ride.driver?.user.name ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatCurrency(ride.finalFare ?? ride.estimatedFare)}
                    </td>
                    <td className="px-4 py-3">
                      <RideStatusBadge status={ride.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDateTime(ride.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/rider/rides/${ride.id}`}
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
