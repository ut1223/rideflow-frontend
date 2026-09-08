"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Plus } from "lucide-react";
import {
  useAddDriverDocumentMutation,
  useDriverDocumentsQuery,
} from "@/hooks/driver/useDriverDocuments";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { VerificationStatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { formatDateTime, getErrorMessage } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import { AddDocumentFormValues, addDocumentSchema } from "@/features/driver/driver.schemas";

const DOCUMENT_TYPE_OPTIONS = [
  { label: "Driving License", value: "DRIVING_LICENSE" },
  { label: "Vehicle RC", value: "VEHICLE_RC" },
  { label: "Insurance", value: "INSURANCE" },
  { label: "Identity Proof", value: "IDENTITY_PROOF" },
];

export default function DriverDocumentsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const { showToast } = useToast();

  const documentsQuery = useDriverDocumentsQuery();
  const addMutation = useAddDriverDocumentMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddDocumentFormValues>({
    resolver: zodResolver(addDocumentSchema),
    defaultValues: { documentType: "DRIVING_LICENSE" },
  });

  function onSubmit(values: AddDocumentFormValues) {
    addMutation.mutate(values, {
      onSuccess: () => {
        showToast("Document submitted successfully", "success");
        reset({ documentType: "DRIVING_LICENSE", documentUrl: "" });
        setAddOpen(false);
      },
      onError: (error) => showToast(getErrorMessage(error), "error"),
    });
  }

  return (
    <div>
      <PageHeader
        title="Documents"
        description="Documents are submitted as URLs — there's no file upload in this build (the backend stores document URLs, not files)."
        action={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" /> Add Document
          </Button>
        }
      />

      {documentsQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : documentsQuery.isError ? (
        <ErrorState error={documentsQuery.error} onRetry={() => documentsQuery.refetch()} />
      ) : !documentsQuery.data || documentsQuery.data.length === 0 ? (
        <EmptyState
          title="No documents submitted"
          description="Add your driving license, RC, insurance, or ID proof."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {documentsQuery.data.map((document) => (
            <Card key={document.id}>
              <CardContent className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-slate-900">
                      {document.documentType.replace("_", " ")}
                    </p>
                    <VerificationStatusBadge status={document.verificationStatus} />
                  </div>
                  <a
                    href={document.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate text-sm text-blue-600 hover:underline"
                  >
                    {document.documentUrl}
                  </a>
                  <p className="mt-1 text-xs text-slate-400">
                    Submitted {formatDateTime(document.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Document">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Select
            label="Document type"
            options={DOCUMENT_TYPE_OPTIONS}
            error={errors.documentType?.message}
            {...register("documentType")}
          />
          <Input
            label="Document URL"
            placeholder="https://example.com/my-license.pdf"
            error={errors.documentUrl?.message}
            {...register("documentUrl")}
          />
          <Button type="submit" className="w-full" isLoading={addMutation.isPending}>
            Submit Document
          </Button>
        </form>
      </Modal>
    </div>
  );
}
