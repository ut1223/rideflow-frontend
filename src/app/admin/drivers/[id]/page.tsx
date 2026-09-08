"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Car, FileText, Star } from "lucide-react";
import {
  useAdminDriverQuery,
  useDriverRatingsQuery,
  useRejectDriverMutation,
  useVerifyDriverMutation,
} from "@/hooks/admin/useAdmin";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { VerificationStatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { cn, formatDateTime, getErrorMessage } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";

export default function AdminDriverDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [confirmAction, setConfirmAction] = useState<"verify" | "reject" | null>(null);

  const driverQuery = useAdminDriverQuery(id);
  const ratingsQuery = useDriverRatingsQuery(id, { limit: 5 });
  const verifyMutation = useVerifyDriverMutation();
  const rejectMutation = useRejectDriverMutation();

  if (driverQuery.isLoading) return <CardSkeleton />;
  if (driverQuery.isError) {
    return <ErrorState error={driverQuery.error} onRetry={() => driverQuery.refetch()} />;
  }

  const driver = driverQuery.data;
  if (!driver) return null;

  function handleConfirm() {
    if (!confirmAction) return;
    const mutation = confirmAction === "verify" ? verifyMutation : rejectMutation;
    mutation.mutate(driver!.id, {
      onSuccess: () => {
        showToast(confirmAction === "verify" ? "Driver verified" : "Driver rejected", "success");
        setConfirmAction(null);
      },
      onError: (error) => showToast(getErrorMessage(error), "error"),
    });
  }

  return (
    <div>
      <PageHeader
        title={driver.user.name}
        description={driver.user.email}
        action={
          <div className="flex gap-2">
            {!driver.isVerified && (
              <Button onClick={() => setConfirmAction("verify")}>Verify Driver</Button>
            )}
            {driver.isVerified && (
              <Button variant="destructive" onClick={() => setConfirmAction("reject")}>
                Reject Driver
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Driver Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">License number</span>
              <span className="font-medium text-slate-900">{driver.licenseNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Phone</span>
              <span className="font-medium text-slate-900">{driver.user.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Account status</span>
              <span className="font-medium text-slate-900">{driver.user.status}</span>
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
                {driver.isVerified ? "Verified" : "Pending"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Online status</span>
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
            <CardTitle>Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            {ratingsQuery.isLoading ? (
              <CardSkeleton />
            ) : ratingsQuery.data ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="text-lg font-semibold text-slate-900">
                    {ratingsQuery.data.averageRating?.toFixed(1) ?? "—"}
                  </span>
                  <span className="text-sm text-slate-500">
                    ({ratingsQuery.data.meta.total} ratings)
                  </span>
                </div>
                {ratingsQuery.data.ratings.length === 0 ? (
                  <p className="text-sm text-slate-500">No ratings yet.</p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {ratingsQuery.data.ratings.map((rating) => (
                      <li key={rating.id} className="py-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-3.5 w-3.5",
                                i < rating.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                              )}
                            />
                          ))}
                        </div>
                        {rating.comment && (
                          <p className="mt-1 text-sm text-slate-600">{rating.comment}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            {driver.vehicles.length === 0 ? (
              <EmptyState title="No vehicles registered" icon={<Car className="h-8 w-8" />} />
            ) : (
              <ul className="space-y-2">
                {driver.vehicles.map((vehicle) => (
                  <li key={vehicle.id} className="rounded-lg border border-slate-100 p-3 text-sm">
                    <p className="font-medium text-slate-900">
                      {vehicle.brand} {vehicle.model}
                    </p>
                    <p className="text-slate-500">
                      {vehicle.vehicleType} &middot; {vehicle.color} &middot; {vehicle.plateNumber}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {driver.documents.length === 0 ? (
              <EmptyState title="No documents submitted" icon={<FileText className="h-8 w-8" />} />
            ) : (
              <ul className="space-y-2">
                {driver.documents.map((document) => (
                  <li
                    key={document.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 p-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {document.documentType.replace("_", " ")}
                      </p>
                      <p className="text-xs text-slate-400">{formatDateTime(document.createdAt)}</p>
                    </div>
                    <VerificationStatusBadge status={document.verificationStatus} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmAction !== null}
        title={confirmAction === "verify" ? "Verify this driver?" : "Reject this driver?"}
        description={
          confirmAction === "verify"
            ? "The driver will be able to go online and accept rides."
            : "The driver will be marked unverified and unable to go online."
        }
        confirmLabel={confirmAction === "verify" ? "Verify" : "Reject"}
        destructive={confirmAction === "reject"}
        isLoading={verifyMutation.isPending || rejectMutation.isPending}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
