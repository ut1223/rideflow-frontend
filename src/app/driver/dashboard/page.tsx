"use client";

import Link from "next/link";
import { AxiosError } from "axios";
import { useAuth } from "@/providers/AuthProvider";
import { useDriverEarningsQuery, useDriverProfileQuery } from "@/hooks/driver/useDriverProfile";
import { useRidesQuery } from "@/hooks/rides/useRides";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { RideStatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CardSkeleton, TableSkeleton } from "@/components/ui/Skeleton";
import { DriverStatusBadge } from "@/features/driver/DriverStatusBadge";
import { ACTIVE_RIDE_STATUSES } from "@/constants/ride-status";
import { formatCurrency } from "@/lib/utils";
import { ApiErrorResponse } from "@/types/api";

export default function DriverDashboardPage() {
  const { user } = useAuth();
  const profileQuery = useDriverProfileQuery();
  const earningsQuery = useDriverEarningsQuery();
  const ridesQuery = useRidesQuery({ limit: 20, sortBy: "createdAt", sortOrder: "desc" });

  const driver = profileQuery.data;
  const profileMissing =
    (profileQuery.error as AxiosError<ApiErrorResponse> | null)?.response?.data?.error ===
    "DRIVER_PROFILE_NOT_FOUND";

  const rides = ridesQuery.data?.data ?? [];
  const ownRides = driver ? rides.filter((r) => r.driverId === driver.id) : [];
  const currentRide = ownRides.find(
    (r) => ACTIVE_RIDE_STATUSES.includes(r.status) && r.status !== "REQUESTED"
  );
  const availableRequests = rides.filter((r) => r.driverId === null);
  const recentRides = ownRides
    .filter((r) => r.status === "COMPLETED" || r.status === "CANCELLED")
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title={`Welcome back${user ? `, ${user.name}` : ""}`}
        description="Here's your driving activity."
        action={driver ? <DriverStatusBadge isOnline={driver.isOnline} /> : undefined}
      />

      {profileMissing ? (
        <EmptyState
          title="Set up your driver profile"
          description="Create your driver profile to start accepting rides."
          action={
            <Link href="/driver/profile" className="text-sm font-medium text-slate-900 underline">
              Go to profile
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Current Ride</CardTitle>
              </CardHeader>
              <CardContent>
                {ridesQuery.isLoading ? (
                  <CardSkeleton />
                ) : currentRide ? (
                  <Link
                    href={`/driver/rides/${currentRide.id}`}
                    className="block rounded-lg border border-slate-200 p-4 hover:border-slate-300"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900">{currentRide.pickupAddress}</p>
                      <RideStatusBadge status={currentRide.status} />
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      → {currentRide.destinationAddress}
                    </p>
                  </Link>
                ) : (
                  <EmptyState
                    title="No active ride"
                    description="Accept a ride request to get started."
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                {earningsQuery.isLoading ? (
                  <CardSkeleton />
                ) : earningsQuery.isError ? (
                  <ErrorState error={earningsQuery.error} onRetry={() => earningsQuery.refetch()} />
                ) : earningsQuery.data ? (
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-slate-500">Total earnings</p>
                      <p className="text-2xl font-semibold text-slate-900">
                        {formatCurrency(earningsQuery.data.totalEarnings)}
                      </p>
                    </div>
                    <p className="text-sm text-slate-500">
                      {earningsQuery.data.totalCompletedRides} completed rides
                    </p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Ride Requests</CardTitle>
              <Link
                href="/driver/requests"
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent>
              {ridesQuery.isLoading ? (
                <TableSkeleton rows={3} cols={3} />
              ) : availableRequests.length === 0 ? (
                <EmptyState
                  title="No ride requests"
                  description={
                    driver?.isOnline
                      ? "You'll see new requests here."
                      : "Go online to start receiving requests."
                  }
                />
              ) : (
                <ul className="divide-y divide-slate-100">
                  {availableRequests.slice(0, 5).map((ride) => (
                    <li key={ride.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{ride.pickupAddress}</p>
                        <p className="text-xs text-slate-500">→ {ride.destinationAddress}</p>
                      </div>
                      <span className="text-sm text-slate-600">
                        {formatCurrency(ride.estimatedFare)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Recent Rides</CardTitle>
            </CardHeader>
            <CardContent>
              {recentRides.length === 0 ? (
                <EmptyState title="No completed rides yet" />
              ) : (
                <ul className="divide-y divide-slate-100">
                  {recentRides.map((ride) => (
                    <li key={ride.id}>
                      <Link
                        href={`/driver/rides/${ride.id}`}
                        className="flex items-center justify-between py-3 hover:bg-slate-50"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {ride.pickupAddress}
                          </p>
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
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
