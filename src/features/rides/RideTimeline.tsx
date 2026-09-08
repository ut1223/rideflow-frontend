import { CheckCircle2, Circle, XCircle } from "lucide-react";
import { RIDE_STATUS_LABELS, RIDE_STATUS_PIPELINE } from "@/constants/ride-status";
import { RideStatusHistoryEntry } from "@/types/ride";
import { formatDateTime } from "@/lib/utils";

export function RideTimeline({ history }: { history: RideStatusHistoryEntry[] }) {
  const reachedStatuses = new Set(history.map((entry) => entry.status));
  const cancelledEntry = history.find((entry) => entry.status === "CANCELLED");

  return (
    <ol className="space-y-4">
      {RIDE_STATUS_PIPELINE.map((status) => {
        const entry = history.find((h) => h.status === status);
        const reached = reachedStatuses.has(status);
        return (
          <li key={status} className="flex items-start gap-3">
            {reached ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
            ) : (
              <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" aria-hidden="true" />
            )}
            <div>
              <p className={reached ? "text-sm font-medium text-slate-900" : "text-sm text-slate-400"}>
                {RIDE_STATUS_LABELS[status]}
              </p>
              {entry && <p className="text-xs text-slate-400">{formatDateTime(entry.createdAt)}</p>}
            </div>
          </li>
        );
      })}
      {cancelledEntry && (
        <li className="flex items-start gap-3">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-red-700">Cancelled</p>
            <p className="text-xs text-slate-400">{formatDateTime(cancelledEntry.createdAt)}</p>
          </div>
        </li>
      )}
    </ol>
  );
}
