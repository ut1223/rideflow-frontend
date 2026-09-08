"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { AxiosError } from "axios";
import { useCancelRideMutation, useRideHistoryQuery, useRideQuery } from "@/hooks/rides/useRides";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/ErrorState";
import { ForbiddenState } from "@/components/common/ForbiddenState";
import { PaymentStatusBadge, RideStatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { RideTimeline } from "@/features/rides/RideTimeline";
import { RideLifecycleActions } from "@/features/driver/RideLifecycleActions";
import { ACTIVE_RIDE_STATUSES } from "@/constants/ride-status";
import { formatCurrency, formatDateTime, getErrorMessage } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";

export default function DriverRideDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [cancelOpen, setCancelOpen] = useState(false);

  const rideQuery = useRideQuery(id);
  const historyQuery = useRideHistoryQuery(id);
  const cancelMutation = useCancelRideMutation();

  if (rideQuery.isLoading) return <CardSkeleton />;

  if (rideQuery.isError) {
    const status = (rideQuery.error as AxiosError)?.response?.status;
    if (status === 403) return <ForbiddenState message="You do not have access to this ride." />;
    return <ErrorState error={rideQuery.error} onRetry={() => rideQuery.refetch()} />;
  }

  const ride = rideQuery.data;
  if (!ride) return null;

  const canCancel = ACTIVE_RIDE_STATUSES.includes(ride.status) && ride.status !== "REQUESTED";

  function handleCancel() {
    cancelMutation.mutate(
      { id: ride!.id },
      {
        onSuccess: () => {
          showToast("Ride cancelled", "success");
          setCancelOpen(false);
        },
        onError: (error) => showToast(getErrorMessage(error), "error"),
      }
    );
  }

  return (
    <div>
      <PageHeader
        title="Ride Details"
        description={`Accepted ${ride.acceptedAt ? formatDateTime(ride.acceptedAt) : "—"}`}
        action={
          canCancel ? (
            <Button variant="destructive" onClick={() => setCancelOpen(true)}>
              Cancel Ride
            </Button>
          ) : undefined
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Trip</CardTitle>
            <RideStatusBadge status={ride.status} />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs uppercase text-slate-400">Pickup</p>
              <p className="text-sm font-medium text-slate-900">{ride.pickupAddress}</p>
              <p className="text-xs text-slate-400">
                {ride.pickupLatitude}, {ride.pickupLongitude}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400">Destination</p>
              <p className="text-sm font-medium text-slate-900">{ride.destinationAddress}</p>
              <p className="text-xs text-slate-400">
                {ride.destinationLatitude}, {ride.destinationLongitude}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
              <div>
                <p className="text-xs text-slate-400">Distance</p>
                <p className="text-sm font-medium text-slate-900">{ride.estimatedDistance} km</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Duration</p>
                <p className="text-sm font-medium text-slate-900">
                  {Math.round(ride.estimatedDuration)} min
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Fare</p>
                <p className="text-sm font-medium text-slate-900">
                  {formatCurrency(ride.finalFare ?? ride.estimatedFare)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-500">Payment status</p>
              <PaymentStatusBadge status={ride.paymentStatus} />
            </div>

            <div className="border-t border-slate-100 pt-4">
              <RideLifecycleActions rideId={ride.id} status={ride.status} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {historyQuery.isLoading ? (
              <CardSkeleton />
            ) : historyQuery.isError ? (
              <ErrorState error={historyQuery.error} onRetry={() => historyQuery.refetch()} />
            ) : (
              <RideTimeline history={historyQuery.data ?? []} />
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={cancelOpen}
        title="Cancel this ride?"
        description="This action cannot be undone."
        confirmLabel="Cancel Ride"
        destructive
        isLoading={cancelMutation.isPending}
        onConfirm={handleCancel}
        onCancel={() => setCancelOpen(false)}
      />
    </div>
  );
}
