import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getErrorMessage } from "@/lib/utils";

export interface ErrorStateProps {
  error?: unknown;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ error, message, onRetry }: ErrorStateProps) {
  const text = message ?? getErrorMessage(error, "We couldn't load this. Please try again.");

  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-6 py-12 text-center">
      <AlertTriangle className="h-8 w-8 text-red-400" aria-hidden="true" />
      <p className="text-sm font-medium text-red-800">{text}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
