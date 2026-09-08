"use client";

import Link from "next/link";
import { Wallet, CheckCircle2 } from "lucide-react";
import { useDriverEarningsQuery } from "@/hooks/driver/useDriverProfile";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/ErrorState";
import { Card, CardContent } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/utils";

export default function DriverEarningsPage() {
  const earningsQuery = useDriverEarningsQuery();

  return (
    <div>
      <PageHeader title="Earnings" description="Your lifetime earnings on RideFlow." />

      {earningsQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : earningsQuery.isError ? (
        <ErrorState error={earningsQuery.error} onRetry={() => earningsQuery.refetch()} />
      ) : earningsQuery.data ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Total earnings</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {formatCurrency(earningsQuery.data.totalEarnings)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Completed rides</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {earningsQuery.data.totalCompletedRides}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <Link
        href="/driver/rides"
        className="mt-4 inline-block text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        View full ride history →
      </Link>
    </div>
  );
}
