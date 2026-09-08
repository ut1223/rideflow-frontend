"use client";

import { useRouter } from "next/navigation";
import { useAcceptRideMutation, useRidesQuery } from "@/hooks/rides/useRides";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { formatCurrency, formatDateTime, getErrorMessage } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";

export default function DriverRequestsPage() {
  const requestsQuery = useRidesQuery({
    status: "REQUESTED",
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const acceptMutation = useAcceptRideMutation();
  const { showToast } = useToast();
  const router = useRouter();

  function handleAccept(rideId: string) {
    acceptMutation.mutate(rideId, {
      onSuccess: () => {
        showToast("Ride accepted successfully", "success");
        router.push(`/driver/rides/${rideId}`);
      },
      onError: (error) => {
        const message = getErrorMessage(error);
        showToast(
          message.toLowerCase().includes("no longer available")
            ? "Ride is no longer available."
            : message,
          "error"
        );
      },
    });
  }

  return (
    <div>
      <PageHeader title="Ride Requests" description="Accept a ride to get started." />

      {requestsQuery.isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white">
          <TableSkeleton />
        </div>
      ) : requestsQuery.isError ? (
        <ErrorState error={requestsQuery.error} onRetry={() => requestsQuery.refetch()} />
      ) : !requestsQuery.data || requestsQuery.data.data.length === 0 ? (
        <EmptyState
          title="No ride requests right now"
          description="New requests will appear here as riders book."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {requestsQuery.data.data.map((ride) => (
            <Card key={ride.id}>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs uppercase text-slate-400">Pickup</p>
                  <p className="text-sm font-medium text-slate-900">{ride.pickupAddress}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-400">Destination</p>
                  <p className="text-sm font-medium text-slate-900">{ride.destinationAddress}</p>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>
                    {ride.estimatedDistance} km &middot; {Math.round(ride.estimatedDuration)} min
                  </span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency(ride.estimatedFare)}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Requested {formatDateTime(ride.requestedAt)}</p>
                <Button
                  className="w-full"
                  onClick={() => handleAccept(ride.id)}
                  isLoading={acceptMutation.isPending && acceptMutation.variables === ride.id}
                >
                  Accept Ride
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
