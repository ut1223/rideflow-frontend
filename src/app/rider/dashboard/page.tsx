"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useRidesQuery } from "@/hooks/rides/useRides";
import { usePaymentsQuery } from "@/hooks/payments/usePayments";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { RideStatusBadge, PaymentStatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CardSkeleton, TableSkeleton } from "@/components/ui/Skeleton";
import { ACTIVE_RIDE_STATUSES } from "@/constants/ride-status";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function RiderDashboardPage() {
  const { user } = useAuth();
  const ridesQuery = useRidesQuery({ limit: 10, sortBy: "createdAt", sortOrder: "desc" });
  const paymentsQuery = usePaymentsQuery({ limit: 5 });

  const rides = ridesQuery.data?.data ?? [];
  const currentRide = rides.find((ride) => ACTIVE_RIDE_STATUSES.includes(ride.status));
  const recentRides = rides.filter((ride) => ride.id !== currentRide?.id).slice(0, 5);

  return (
    <div>
      <PageHeader
        title={`Welcome back${user ? `, ${user.name}` : ""}`}
        description="Here's what's happening with your rides."
        action={
          <Link href="/rider/book">
            <Button>
              <PlusCircle className="h-4 w-4" />
              Book a Ride
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Current Ride</CardTitle>
          </CardHeader>
          <CardContent>
            {ridesQuery.isLoading ? (
              <CardSkeleton />
            ) : ridesQuery.isError ? (
              <ErrorState error={ridesQuery.error} onRetry={() => ridesQuery.refetch()} />
            ) : currentRide ? (
              <Link
                href={`/rider/rides/${currentRide.id}`}
                className="block rounded-lg border border-slate-200 p-4 hover:border-slate-300"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">{currentRide.pickupAddress}</p>
                  <RideStatusBadge status={currentRide.status} />
                </div>
                <p className="mt-1 text-sm text-slate-500">→ {currentRide.destinationAddress}</p>
                <p className="mt-2 text-sm font-medium text-slate-700">
                  {formatCurrency(currentRide.estimatedFare)}
                </p>
              </Link>
            ) : (
              <EmptyState
                title="No active ride"
                description="Book a ride to get started."
                action={
                  <Link href="/rider/book">
                    <Button size="sm">Book a Ride</Button>
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {paymentsQuery.isLoading ? (
              <TableSkeleton rows={3} cols={1} />
            ) : paymentsQuery.isError ? (
              <ErrorState error={paymentsQuery.error} onRetry={() => paymentsQuery.refetch()} />
            ) : paymentsQuery.data && paymentsQuery.data.data.length > 0 ? (
              paymentsQuery.data.data.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-slate-900">{formatCurrency(payment.amount)}</p>
                    <p className="text-xs text-slate-400">{formatDateTime(payment.createdAt)}</p>
                  </div>
                  <PaymentStatusBadge status={payment.status} />
                </div>
              ))
            ) : (
              <EmptyState title="No payments yet" />
            )}
            <Link
              href="/rider/payments"
              className="block pt-1 text-center text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              View all payments
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Recent Rides</CardTitle>
        </CardHeader>
        <CardContent>
          {ridesQuery.isLoading ? (
            <TableSkeleton rows={4} cols={4} />
          ) : ridesQuery.isError ? (
            <ErrorState error={ridesQuery.error} onRetry={() => ridesQuery.refetch()} />
          ) : recentRides.length === 0 ? (
            <EmptyState title="No rides yet" description="Your ride history will show up here." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentRides.map((ride) => (
                <li key={ride.id}>
                  <Link
                    href={`/rider/rides/${ride.id}`}
                    className="flex items-center justify-between py-3 hover:bg-slate-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{ride.pickupAddress}</p>
                      <p className="text-xs text-slate-500">→ {ride.destinationAddress}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-600">
                        {formatCurrency(ride.finalFare ?? ride.estimatedFare)}
                      </span>
                      <RideStatusBadge status={ride.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/rider/rides"
            className="mt-2 block text-center text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            View all rides
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
