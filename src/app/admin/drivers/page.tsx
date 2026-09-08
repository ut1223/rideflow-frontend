"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminDriversQuery } from "@/hooks/admin/useAdmin";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { TableToolbar } from "@/components/tables/TableToolbar";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";

const TRISTATE_OPTIONS = [
  { label: "All", value: "" },
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

function parseTristate(value: string): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

export default function AdminDriversPage() {
  const [search, setSearch] = useState("");
  const [verified, setVerified] = useState("");
  const [online, setOnline] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);

  const driversQuery = useAdminDriversQuery({
    search: debouncedSearch || undefined,
    verified: parseTristate(verified),
    online: parseTristate(online),
    page,
    limit: 15,
  });

  return (
    <div>
      <PageHeader title="Drivers" description="All drivers and their verification status." />

      <TableToolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      >
        <Select
          value={verified}
          onChange={(e) => {
            setVerified(e.target.value);
            setPage(1);
          }}
          options={TRISTATE_OPTIONS.map((o, i) => (i === 0 ? { label: "All verification", value: "" } : o))}
          className="w-40"
          aria-label="Filter by verification"
        />
        <Select
          value={online}
          onChange={(e) => {
            setOnline(e.target.value);
            setPage(1);
          }}
          options={TRISTATE_OPTIONS.map((o, i) => (i === 0 ? { label: "All status", value: "" } : o))}
          className="w-40"
          aria-label="Filter by online status"
        />
      </TableToolbar>

      {driversQuery.isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white">
          <TableSkeleton />
        </div>
      ) : driversQuery.isError ? (
        <ErrorState error={driversQuery.error} onRetry={() => driversQuery.refetch()} />
      ) : !driversQuery.data || driversQuery.data.data.length === 0 ? (
        <EmptyState title="No drivers match your filters" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Driver</th>
                  <th className="px-4 py-3 font-medium">Verification</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Vehicle</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {driversQuery.data.data.map((driver) => (
                  <tr key={driver.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{driver.user.name}</p>
                      <p className="text-xs text-slate-500">{driver.user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          driver.isVerified
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                            : "bg-amber-50 text-amber-700 ring-amber-600/20"
                        }
                      >
                        {driver.isVerified ? "Verified" : "Pending"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          driver.isOnline
                            ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                            : "bg-slate-100 text-slate-600 ring-slate-500/20"
                        }
                      >
                        {driver.isOnline ? "Online" : "Offline"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {driver.vehicles.length > 0
                        ? `${driver.vehicles[0].brand} ${driver.vehicles[0].model}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/drivers/${driver.id}`}
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
            <Pagination meta={driversQuery.data.pagination} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
}
