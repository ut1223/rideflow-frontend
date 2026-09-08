export type NotificationType = "RIDE" | "PAYMENT" | "SYSTEM" | "SUPPORT";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}
