"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useCreateVehicleMutation } from "@/hooks/driver/useVehicles";
import { getErrorMessage } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import { CreateVehicleFormValues, createVehicleSchema } from "./driver.schemas";

const VEHICLE_TYPE_OPTIONS = [
  { label: "Car", value: "CAR" },
  { label: "Bike", value: "BIKE" },
  { label: "Auto", value: "AUTO" },
];

export function AddVehicleForm({ onSuccess }: { onSuccess: () => void }) {
  const { showToast } = useToast();
  const createMutation = useCreateVehicleMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateVehicleFormValues>({
    resolver: zodResolver(createVehicleSchema),
    defaultValues: { vehicleType: "CAR" },
  });

  function onSubmit(values: CreateVehicleFormValues) {
    createMutation.mutate(values, {
      onSuccess: () => {
        showToast("Vehicle added successfully", "success");
        onSuccess();
      },
      onError: (error) => showToast(getErrorMessage(error), "error"),
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Select
        label="Vehicle type"
        options={VEHICLE_TYPE_OPTIONS}
        error={errors.vehicleType?.message}
        {...register("vehicleType")}
      />
      <Input label="Brand" error={errors.brand?.message} {...register("brand")} />
      <Input label="Model" error={errors.model?.message} {...register("model")} />
      <Input label="Plate number" error={errors.plateNumber?.message} {...register("plateNumber")} />
      <Input label="Color" error={errors.color?.message} {...register("color")} />
      <Button type="submit" className="w-full" isLoading={createMutation.isPending}>
        Add Vehicle
      </Button>
    </form>
  );
}
