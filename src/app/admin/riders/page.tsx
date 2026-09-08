"use client";

import { useState } from "react";
import { useAdminRidersQuery } from "@/hooks/admin/useAdmin";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { TableToolbar } from "@/components/tables/TableToolbar";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils";
import { UserStatus } from "@/types/user";

const STATUS_OPTIONS = [
  { label: "All statuses", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Inactive", value: "INACTIVE" },
];

export default function AdminRidersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<UserStatus | "">("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);

  const ridersQuery = useAdminRidersQuery({
    search: debouncedSearch || undefined,
    status: status || undefined,
    page,
    limit: 15,
  });

  return (
    <div>
      <PageHeader title="Riders" description="All riders on the platform." />

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
            setStatus(e.target.value as UserStatus | "");
            setPage(1);
          }}
          options={STATUS_OPTIONS}
          className="w-40"
          aria-label="Filter by status"
        />
      </TableToolbar>

      {ridersQuery.isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white">
          <TableSkeleton />
        </div>
      ) : ridersQuery.isError ? (
        <ErrorState error={ridersQuery.error} onRetry={() => ridersQuery.refetch()} />
      ) : !ridersQuery.data || ridersQuery.data.data.length === 0 ? (
        <EmptyState title="No riders match your filters" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ridersQuery.data.data.map((rider) => (
                  <tr key={rider.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{rider.name}</td>
                    <td className="px-4 py-3 text-slate-600">{rider.email}</td>
                    <td className="px-4 py-3 text-slate-600">{rider.phone}</td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          rider.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                            : "bg-amber-50 text-amber-700 ring-amber-600/20"
                        }
                      >
                        {rider.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDateTime(rider.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-2">
            <Pagination meta={ridersQuery.data.pagination} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
}
