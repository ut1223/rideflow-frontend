export type PaymentMethod = "CASH" | "CARD" | "UPI";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export interface Payment {
  id: string;
  rideId: string;
  riderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionReference: string;
  createdAt: string;
  updatedAt: string;
}
