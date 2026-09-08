"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, Car, CreditCard, LifeBuoy, Megaphone } from "lucide-react";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsQuery,
} from "@/hooks/notifications/useNotifications";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatDateTime, cn } from "@/lib/utils";
import { Notification, NotificationType } from "@/types/notification";

const TYPE_ICONS: Record<NotificationType, typeof Bell> = {
  RIDE: Car,
  PAYMENT: CreditCard,
  SYSTEM: Megaphone,
  SUPPORT: LifeBuoy,
};

export function NotificationBell({ viewAllHref }: { viewAllHref?: string }) {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useNotificationsQuery(1, 8);
  const markRead = useMarkNotificationReadMutation();
  const markAllRead = useMarkAllNotificationsReadMutation();

  const notifications = data?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  function handleNotificationClick(notification: Notification) {
    if (!notification.isRead) {
      markRead.mutate(notification.id);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-100 p-3">
              <p className="text-sm font-semibold text-slate-900">Notifications</p>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllRead.mutate()}
                  className="text-xs font-medium text-slate-500 hover:text-slate-900"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center py-6">
                  <LoadingSpinner />
                </div>
              ) : notifications.length === 0 ? (
                <p className="p-4 text-center text-sm text-slate-500">No notifications</p>
              ) : (
                <ul>
                  {notifications.map((notification) => {
                    const Icon = TYPE_ICONS[notification.type];
                    return (
                      <li key={notification.id}>
                        <button
                          type="button"
                          onClick={() => handleNotificationClick(notification)}
                          className={cn(
                            "flex w-full gap-2.5 border-b border-slate-50 p-3 text-left hover:bg-slate-50",
                            !notification.isRead && "bg-slate-50/80"
                          )}
                        >
                          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-900">
                              {notification.title}
                            </p>
                            <p className="line-clamp-2 text-xs text-slate-500">
                              {notification.message}
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-400">
                              {formatDateTime(notification.createdAt)}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            {viewAllHref && (
              <Link
                href={viewAllHref}
                onClick={() => setOpen(false)}
                className="block border-t border-slate-100 p-2.5 text-center text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                View all
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
