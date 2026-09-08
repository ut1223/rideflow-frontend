import { RideStatus } from "@/types/ride";

export const RIDE_STATUS = {
  REQUESTED: "REQUESTED",
  ACCEPTED: "ACCEPTED",
  DRIVER_ARRIVING: "DRIVER_ARRIVING",
  DRIVER_ARRIVED: "DRIVER_ARRIVED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const satisfies Record<string, RideStatus>;

/** Mirrors the backend's whitelist state machine (src/constants/ride-status.ts) — used only to
 *  decide which actions to *show*; the backend remains the authority that enforces it. */
export const RIDE_STATUS_TRANSITIONS: Record<RideStatus, RideStatus[]> = {
  REQUESTED: ["ACCEPTED", "CANCELLED"],
  ACCEPTED: ["DRIVER_ARRIVING", "CANCELLED"],
  DRIVER_ARRIVING: ["DRIVER_ARRIVED", "CANCELLED"],
  DRIVER_ARRIVED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

export const ACTIVE_RIDE_STATUSES: RideStatus[] = [
  "REQUESTED",
  "ACCEPTED",
  "DRIVER_ARRIVING",
  "DRIVER_ARRIVED",
  "IN_PROGRESS",
];

export const RIDE_STATUS_LABELS: Record<RideStatus, string> = {
  REQUESTED: "Requested",
  ACCEPTED: "Accepted",
  DRIVER_ARRIVING: "Driver Arriving",
  DRIVER_ARRIVED: "Driver Arrived",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const RIDE_STATUS_BADGE_CLASSES: Record<RideStatus, string> = {
  REQUESTED: "bg-amber-50 text-amber-700 ring-amber-600/20",
  ACCEPTED: "bg-blue-50 text-blue-700 ring-blue-600/20",
  DRIVER_ARRIVING: "bg-blue-50 text-blue-700 ring-blue-600/20",
  DRIVER_ARRIVED: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  IN_PROGRESS: "bg-violet-50 text-violet-700 ring-violet-600/20",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  CANCELLED: "bg-red-50 text-red-700 ring-red-600/20",
};

/** Ordered pipeline for the ride-history timeline UI (cancellation is handled separately). */
export const RIDE_STATUS_PIPELINE: RideStatus[] = [
  "REQUESTED",
  "ACCEPTED",
  "DRIVER_ARRIVING",
  "DRIVER_ARRIVED",
  "IN_PROGRESS",
  "COMPLETED",
];
