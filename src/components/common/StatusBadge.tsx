import { Badge } from "@/components/ui/Badge";
import {
  PAYMENT_STATUS_BADGE_CLASSES,
  TICKET_PRIORITY_BADGE_CLASSES,
  TICKET_STATUS_BADGE_CLASSES,
  VERIFICATION_STATUS_BADGE_CLASSES,
} from "@/constants/status-colors";
import { RIDE_STATUS_BADGE_CLASSES, RIDE_STATUS_LABELS } from "@/constants/ride-status";
import { RideStatus } from "@/types/ride";
import { PaymentStatus } from "@/types/payment";
import { TicketPriority, TicketStatus } from "@/types/support";
import { VerificationStatus } from "@/types/driver";

export function RideStatusBadge({ status }: { status: RideStatus }) {
  return <Badge className={RIDE_STATUS_BADGE_CLASSES[status]}>{RIDE_STATUS_LABELS[status]}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge className={PAYMENT_STATUS_BADGE_CLASSES[status]}>{status}</Badge>;
}

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return (
    <Badge className={TICKET_STATUS_BADGE_CLASSES[status]}>{status.replace("_", " ")}</Badge>
  );
}

export function TicketPriorityBadge({ priority }: { priority: TicketPriority }) {
  return <Badge className={TICKET_PRIORITY_BADGE_CLASSES[priority]}>{priority}</Badge>;
}

export function VerificationStatusBadge({ status }: { status: VerificationStatus }) {
  return <Badge className={VERIFICATION_STATUS_BADGE_CLASSES[status]}>{status}</Badge>;
}
