import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

/**
 * Read-only — there's no manual online/offline toggle. Presence is tied to being logged in:
 * DriverOnlineStatusSync brings a verified driver online as soon as they land on a driver page,
 * and AuthProvider.logout() takes them offline (best-effort) when they log out.
 */
export function DriverStatusBadge({ isOnline }: { isOnline: boolean }) {
  return (
    <Badge
      className={cn(
        "gap-1.5",
        isOnline
          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
          : "bg-slate-100 text-slate-600 ring-slate-500/20"
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", isOnline ? "bg-emerald-500" : "bg-slate-400")} />
      {isOnline ? "Online" : "Offline"}
    </Badge>
  );
}
