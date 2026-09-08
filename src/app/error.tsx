"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
      <AlertTriangle className="h-10 w-10 text-red-400" aria-hidden="true" />
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Something went wrong</h1>
        <p className="mt-1 text-sm text-slate-500">
          An unexpected error occurred. You can try again, or head back to the dashboard.
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
