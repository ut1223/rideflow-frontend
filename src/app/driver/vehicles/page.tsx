"use client";

import { useState } from "react";
import { Car, Pencil, Plus, Trash2 } from "lucide-react";
import { useDeleteVehicleMutation, useVehiclesQuery } from "@/hooks/driver/useVehicles";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { AddVehicleForm } from "@/features/driver/AddVehicleForm";
import { EditVehicleForm } from "@/features/driver/EditVehicleForm";
import { getErrorMessage } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import { Vehicle } from "@/types/vehicle";

export default function DriverVehiclesPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState<Vehicle | null>(null);
  const { showToast } = useToast();

  const vehiclesQuery = useVehiclesQuery();
  const deleteMutation = useDeleteVehicleMutation();

  function handleDelete() {
    if (!deleting) return;
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        showToast("Vehicle deleted", "success");
        setDeleting(null);
      },
      onError: (error) => showToast(getErrorMessage(error), "error"),
    });
  }

  return (
    <div>
      <PageHeader
        title="Vehicles"
        description="Manage the vehicles registered to your driver profile."
        action={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" /> Add Vehicle
          </Button>
        }
      />

      {vehiclesQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : vehiclesQuery.isError ? (
        <ErrorState error={vehiclesQuery.error} onRetry={() => vehiclesQuery.refetch()} />
      ) : !vehiclesQuery.data || vehiclesQuery.data.length === 0 ? (
        <EmptyState
          title="No vehicles added"
          description="Add a vehicle to start accepting rides."
          action={
            <Button size="sm" onClick={() => setAddOpen(true)}>
              Add Vehicle
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehiclesQuery.data.map((vehicle) => (
            <Card key={vehicle.id}>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                    <Car className="h-5 w-5" />
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setEditing(vehicle)}
                      aria-label="Edit vehicle"
                      className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(vehicle)}
                      aria-label="Delete vehicle"
                      className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    {vehicle.brand} {vehicle.model}
                  </p>
                  <p className="text-sm text-slate-500">
                    {vehicle.vehicleType} &middot; {vehicle.color}
                  </p>
                  <p className="mt-1 font-mono text-xs text-slate-400">{vehicle.plateNumber}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Vehicle">
        <AddVehicleForm onSuccess={() => setAddOpen(false)} />
      </Modal>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit Vehicle">
        {editing && <EditVehicleForm vehicle={editing} onSuccess={() => setEditing(null)} />}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this vehicle?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        destructive
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
