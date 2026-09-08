"use client";

import { useState } from "react";
import { Bell, Car, CreditCard, LifeBuoy, Megaphone } from "lucide-react";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsQuery,
} from "@/hooks/notifications/useNotifications";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { cn, formatDateTime } from "@/lib/utils";
import { NotificationType } from "@/types/notification";

const TYPE_ICONS: Record<NotificationType, typeof Bell> = {
  RIDE: Car,
  PAYMENT: CreditCard,
  SYSTEM: Megaphone,
  SUPPORT: LifeBuoy,
};

export function NotificationsPage() {
  const [page, setPage] = useState(1);
  const notificationsQuery = useNotificationsQuery(page, 15);
  const markRead = useMarkNotificationReadMutation();
  const markAllRead = useMarkAllNotificationsReadMutation();

  const notifications = notificationsQuery.data?.data ?? [];
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay up to date with your rides and account."
        action={
          hasUnread ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllRead.mutate()}
              isLoading={markAllRead.isPending}
            >
              Mark all read
            </Button>
          ) : undefined
        }
      />

      {notificationsQuery.isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white">
          <TableSkeleton cols={1} />
        </div>
      ) : notificationsQuery.isError ? (
        <ErrorState error={notificationsQuery.error} onRetry={() => notificationsQuery.refetch()} />
      ) : notifications.length === 0 ? (
        <EmptyState title="No notifications" description="You're all caught up." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <ul className="divide-y divide-slate-100">
            {notifications.map((notification) => {
              const Icon = TYPE_ICONS[notification.type];
              return (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => !notification.isRead && markRead.mutate(notification.id)}
                    className={cn(
                      "flex w-full items-start gap-3 p-4 text-left hover:bg-slate-50",
                      !notification.isRead && "bg-slate-50/70"
                    )}
                  >
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                      <p className="text-sm text-slate-500">{notification.message}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {formatDateTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          {notificationsQuery.data && (
            <div className="border-t border-slate-100 px-2">
              <Pagination meta={notificationsQuery.data.pagination} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
