"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LocationAutocomplete, PlaceSelection } from "@/components/common/LocationAutocomplete";
import { useCreateRideMutation, useEstimateFareMutation } from "@/hooks/rides/useRides";
import { formatCurrency, getErrorMessage } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import { BookRideFormValues, bookRideSchema } from "@/features/rides/ride.schemas";
import { FareEstimate } from "@/types/ride";

export function BookRideForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [estimate, setEstimate] = useState<FareEstimate | null>(null);

  const estimateMutation = useEstimateFareMutation();
  const createRideMutation = useCreateRideMutation();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<BookRideFormValues>({
    resolver: zodResolver(bookRideSchema),
  });

  const pickupLat = useWatch({ control, name: "pickupLatitude" });
  const pickupLng = useWatch({ control, name: "pickupLongitude" });
  const destinationLat = useWatch({ control, name: "destinationLatitude" });
  const destinationLng = useWatch({ control, name: "destinationLongitude" });

  function handlePickupSelect(place: PlaceSelection) {
    setValue("pickupAddress", place.address, { shouldValidate: true });
    setValue("pickupLatitude", place.latitude, { shouldValidate: true });
    setValue("pickupLongitude", place.longitude, { shouldValidate: true });
  }

  function handleDestinationSelect(place: PlaceSelection) {
    setValue("destinationAddress", place.address, { shouldValidate: true });
    setValue("destinationLatitude", place.latitude, { shouldValidate: true });
    setValue("destinationLongitude", place.longitude, { shouldValidate: true });
  }

  function onEstimate(values: BookRideFormValues) {
    setEstimate(null);
    estimateMutation.mutate(
      {
        pickupLatitude: values.pickupLatitude,
        pickupLongitude: values.pickupLongitude,
        destinationLatitude: values.destinationLatitude,
        destinationLongitude: values.destinationLongitude,
      },
      { onSuccess: (result) => setEstimate(result) }
    );
  }

  function handleRequestRide() {
    if (!estimate) return;
    const values = getValues();
    createRideMutation.mutate(
      {
        pickupAddress: values.pickupAddress,
        destinationAddress: values.destinationAddress,
        pickupLatitude: values.pickupLatitude,
        pickupLongitude: values.pickupLongitude,
        destinationLatitude: values.destinationLatitude,
        destinationLongitude: values.destinationLongitude,
        estimatedDistance: estimate.distance,
        estimatedDuration: estimate.duration,
        estimatedFare: estimate.estimatedFare,
      },
      {
        onSuccess: (ride) => {
          showToast("Ride requested successfully", "success");
          router.push(`/rider/rides/${ride.id}`);
        },
        onError: (error) => showToast(getErrorMessage(error), "error"),
      }
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Trip details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onEstimate)} className="space-y-4" noValidate>
            <LocationAutocomplete
              label="Pickup location"
              placeholder="Search for a pickup location"
              onPlaceSelect={handlePickupSelect}
              error={
                errors.pickupAddress || errors.pickupLatitude
                  ? "Select a pickup location from the suggestions"
                  : undefined
              }
              hint={
                pickupLat !== undefined && pickupLng !== undefined
                  ? `${pickupLat.toFixed(5)}, ${pickupLng.toFixed(5)}`
                  : undefined
              }
            />

            <LocationAutocomplete
              label="Destination"
              placeholder="Search for a destination"
              onPlaceSelect={handleDestinationSelect}
              error={
                errors.destinationAddress || errors.destinationLatitude
                  ? "Select a destination from the suggestions"
                  : undefined
              }
              hint={
                destinationLat !== undefined && destinationLng !== undefined
                  ? `${destinationLat.toFixed(5)}, ${destinationLng.toFixed(5)}`
                  : undefined
              }
            />

            {estimateMutation.isError && (
              <p role="alert" className="text-sm text-red-600">
                {getErrorMessage(estimateMutation.error)}
              </p>
            )}

            <Button type="submit" className="w-full" isLoading={estimateMutation.isPending}>
              Estimate Fare
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fare estimate</CardTitle>
        </CardHeader>
        <CardContent>
          {!estimate ? (
            <p className="text-sm text-slate-500">
              Search and select a pickup and destination, then estimate the fare to continue.
            </p>
          ) : (
            <div className="space-y-4">
              <dl className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-slate-50 p-3">
                  <dt className="text-xs text-slate-500">Distance</dt>
                  <dd className="text-lg font-semibold text-slate-900">{estimate.distance} km</dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <dt className="text-xs text-slate-500">Duration</dt>
                  <dd className="text-lg font-semibold text-slate-900">
                    {Math.round(estimate.duration)} min
                  </dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <dt className="text-xs text-slate-500">Fare</dt>
                  <dd className="text-lg font-semibold text-slate-900">
                    {formatCurrency(estimate.estimatedFare)}
                  </dd>
                </div>
              </dl>

              {createRideMutation.isError && (
                <p role="alert" className="text-sm text-red-600">
                  {getErrorMessage(createRideMutation.error)}
                </p>
              )}

              <Button
                className="w-full"
                onClick={handleRequestRide}
                isLoading={createRideMutation.isPending}
              >
                Request Ride
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
