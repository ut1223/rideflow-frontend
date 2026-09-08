import { User } from "./user";
import { Driver } from "./driver";
import { PaymentStatus } from "./payment";
import { Rating } from "./rating";

export type RideStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "DRIVER_ARRIVING"
  | "DRIVER_ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface Ride {
  id: string;
  riderId: string;
  driverId: string | null;
  pickupAddress: string;
  destinationAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  estimatedDistance: number;
  estimatedDuration: number;
  estimatedFare: number;
  finalFare: number | null;
  status: RideStatus;
  paymentStatus: PaymentStatus;
  requestedAt: string;
  acceptedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** GET /rides/:id includes the bare driver relation (no nested user — name unavailable here),
 *  plus the ride's rating if one exists (null if not yet rated). */
export interface RideDetail extends Ride {
  driver: Driver | null;
  rating: Rating | null;
}

/** GET /users/me/rides includes driver -> user, so the driver's name is available */
export interface RideWithDriver extends Ride {
  driver: (Driver & { user: User }) | null;
}

export interface RideStatusHistoryEntry {
  id: string;
  rideId: string;
  status: RideStatus;
  changedBy: string;
  createdAt: string;
}

/** Response shape of POST /rides/estimate — field names differ from the POST /rides request body */
export interface FareEstimate {
  distance: number;
  duration: number;
  estimatedFare: number;
}
