"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useProcessPaymentMutation } from "@/hooks/payments/usePayments";
import { getErrorMessage } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import { PaymentMethod } from "@/types/payment";

export function PaymentPanel({ rideId }: { rideId: string }) {
  const [method, setMethod] = useState<PaymentMethod>("CASH");
  const processPayment = useProcessPaymentMutation();
  const { showToast } = useToast();

  function handlePay() {
    processPayment.mutate(
      { rideId, method },
      {
        onSuccess: () => showToast("Payment processed successfully", "success"),
        onError: (error) => showToast(getErrorMessage(error), "error"),
      }
    );
  }

  return (
    <div className="space-y-3">
      <p className="flex items-center gap-1.5 text-xs text-slate-500">
        <CreditCard className="h-3.5 w-3.5" />
        Payments are simulated for this demo — no real gateway is involved.
      </p>
      <Select
        label="Payment method"
        value={method}
        onChange={(e) => setMethod(e.target.value as PaymentMethod)}
        options={[
          { label: "Cash", value: "CASH" },
          { label: "Card", value: "CARD" },
          { label: "UPI", value: "UPI" },
        ]}
      />
      {processPayment.isError && (
        <p role="alert" className="text-sm text-red-600">
          {getErrorMessage(processPayment.error)}
        </p>
      )}
      <Button className="w-full" onClick={handlePay} isLoading={processPayment.isPending}>
        Pay Now
      </Button>
    </div>
  );
}
