"use client";

import { UseMutationResult } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import {
  useArrivedRideMutation,
  useArrivingRideMutation,
  useCompleteRideMutation,
  useStartRideMutation,
} from "@/hooks/rides/useRides";
import { getErrorMessage } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import { Ride, RideStatus } from "@/types/ride";

export function RideLifecycleActions({ rideId, status }: { rideId: string; status: RideStatus }) {
  const { showToast } = useToast();
  const arriving = useArrivingRideMutation();
  const arrived = useArrivedRideMutation();
  const start = useStartRideMutation();
  const complete = useCompleteRideMutation();

  function run(mutation: UseMutationResult<Ride, Error, string, unknown>, successMessage: string) {
    mutation.mutate(rideId, {
      onSuccess: () => showToast(successMessage, "success"),
      onError: (error) => showToast(getErrorMessage(error), "error"),
    });
  }

  switch (status) {
    case "ACCEPTED":
      return (
        <Button
          className="w-full"
          isLoading={arriving.isPending}
          onClick={() => run(arriving, "Marked as arriving")}
        >
          Mark Arriving
        </Button>
      );
    case "DRIVER_ARRIVING":
      return (
        <Button
          className="w-full"
          isLoading={arrived.isPending}
          onClick={() => run(arrived, "Marked as arrived")}
        >
          Mark Arrived
        </Button>
      );
    case "DRIVER_ARRIVED":
      return (
        <Button className="w-full" isLoading={start.isPending} onClick={() => run(start, "Ride started")}>
          Start Ride
        </Button>
      );
    case "IN_PROGRESS":
      return (
        <Button
          className="w-full"
          isLoading={complete.isPending}
          onClick={() => run(complete, "Ride completed")}
        >
          Complete Ride
        </Button>
      );
    default:
      return null;
  }
}
