import { ShieldAlert } from "lucide-react";

export function ForbiddenState({
  message = "You do not have permission to view this.",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-6 py-12 text-center">
      <ShieldAlert className="h-8 w-8 text-amber-500" aria-hidden="true" />
      <p className="text-sm font-medium text-amber-800">{message}</p>
    </div>
  );
}
