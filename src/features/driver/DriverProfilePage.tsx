"use client";

import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/common/ErrorState";
import {
  useCreateDriverProfileMutation,
  useDriverProfileQuery,
  useUpdateDriverProfileMutation,
} from "@/hooks/driver/useDriverProfile";
import { getErrorMessage } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import { ApiErrorResponse } from "@/types/api";
import {
  CreateDriverProfileFormValues,
  UpdateLocationFormValues,
  createDriverProfileSchema,
  updateLocationSchema,
} from "./driver.schemas";

function CreateProfileForm() {
  const { showToast } = useToast();
  const createMutation = useCreateDriverProfileMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateDriverProfileFormValues>({ resolver: zodResolver(createDriverProfileSchema) });

  function onSubmit(values: CreateDriverProfileFormValues) {
    createMutation.mutate(values.licenseNumber, {
      onSuccess: () => showToast("Driver profile created", "success"),
      onError: (error) => showToast(getErrorMessage(error), "error"),
    });
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Set up your driver profile</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-slate-500">
          You need a driver profile before you can go online, add a vehicle, or accept rides.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            label="License number"
            error={errors.licenseNumber?.message}
            {...register("licenseNumber")}
          />
          <Button type="submit" className="w-full" isLoading={createMutation.isPending}>
            Create Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function LocationForm({
  currentLatitude,
  currentLongitude,
}: {
  currentLatitude: number | null;
  currentLongitude: number | null;
}) {
  const { showToast } = useToast();
  const updateMutation = useUpdateDriverProfileMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateLocationFormValues>({
    resolver: zodResolver(updateLocationSchema),
    values: { currentLatitude: currentLatitude ?? 0, currentLongitude: currentLongitude ?? 0 },
  });

  function onSubmit(values: UpdateLocationFormValues) {
    updateMutation.mutate(values, {
      onSuccess: () => showToast("Location updated", "success"),
      onError: (error) => showToast(getErrorMessage(error), "error"),
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="number"
          step="any"
          label="Current latitude"
          error={errors.currentLatitude?.message}
          {...register("currentLatitude", { valueAsNumber: true })}
        />
        <Input
          type="number"
          step="any"
          label="Current longitude"
          error={errors.currentLongitude?.message}
          {...register("currentLongitude", { valueAsNumber: true })}
        />
      </div>
      <Button type="submit" isLoading={updateMutation.isPending}>
        Update Location
      </Button>
    </form>
  );
}

export function DriverProfilePage() {
  const profileQuery = useDriverProfileQuery();

  if (profileQuery.isLoading) return <CardSkeleton />;

  if (profileQuery.isError) {
    const code = (profileQuery.error as AxiosError<ApiErrorResponse>).response?.data?.error;
    if (code === "DRIVER_PROFILE_NOT_FOUND") return <CreateProfileForm />;
    return <ErrorState error={profileQuery.error} onRetry={() => profileQuery.refetch()} />;
  }

  const driver = profileQuery.data;
  if (!driver) return null;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Driver details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">License number</span>
            <span className="font-medium text-slate-900">{driver.licenseNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Verification</span>
            <Badge
              className={
                driver.isVerified
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                  : "bg-amber-50 text-amber-700 ring-amber-600/20"
              }
            >
              {driver.isVerified ? "Verified" : "Pending Verification"}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Status</span>
            <Badge
              className={
                driver.isOnline
                  ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                  : "bg-slate-100 text-slate-600 ring-slate-500/20"
              }
            >
              {driver.isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current location</CardTitle>
        </CardHeader>
        <CardContent>
          <LocationForm
            currentLatitude={driver.currentLatitude}
            currentLongitude={driver.currentLongitude}
          />
        </CardContent>
      </Card>
    </div>
  );
}
