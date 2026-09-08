import { PaymentStatus } from "@/types/payment";
import { TicketStatus, TicketPriority } from "@/types/support";
import { VerificationStatus } from "@/types/driver";

export const PAYMENT_STATUS_BADGE_CLASSES: Record<PaymentStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
  SUCCESS: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  FAILED: "bg-red-50 text-red-700 ring-red-600/20",
  REFUNDED: "bg-slate-100 text-slate-700 ring-slate-600/20",
};

export const TICKET_STATUS_BADGE_CLASSES: Record<TicketStatus, string> = {
  OPEN: "bg-amber-50 text-amber-700 ring-amber-600/20",
  IN_PROGRESS: "bg-blue-50 text-blue-700 ring-blue-600/20",
  RESOLVED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  CLOSED: "bg-slate-100 text-slate-700 ring-slate-600/20",
};

export const TICKET_PRIORITY_BADGE_CLASSES: Record<TicketPriority, string> = {
  LOW: "bg-slate-100 text-slate-700 ring-slate-600/20",
  MEDIUM: "bg-blue-50 text-blue-700 ring-blue-600/20",
  HIGH: "bg-orange-50 text-orange-700 ring-orange-600/20",
  URGENT: "bg-red-50 text-red-700 ring-red-600/20",
};

export const VERIFICATION_STATUS_BADGE_CLASSES: Record<VerificationStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
  APPROVED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  REJECTED: "bg-red-50 text-red-700 ring-red-600/20",
};
