import { PublicUser } from "./user";
import { Vehicle } from "./vehicle";

export type DocumentType =
  | "DRIVING_LICENSE"
  | "VEHICLE_RC"
  | "INSURANCE"
  | "IDENTITY_PROOF";

export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface DriverDocument {
  id: string;
  driverId: string;
  documentType: DocumentType;
  documentUrl: string;
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  isOnline: boolean;
  isVerified: boolean;
  currentLatitude: number | null;
  currentLongitude: number | null;
  createdAt: string;
  updatedAt: string;
}

/** GET /drivers/me includes vehicles + documents */
export interface DriverProfile extends Driver {
  vehicles: Vehicle[];
  documents: DriverDocument[];
}

/** GET /admin/drivers rows include the joined public user + vehicles (no documents) */
export interface AdminDriverSummary extends Driver {
  user: PublicUser;
  vehicles: Vehicle[];
}

/** GET /admin/drivers/:id additionally includes documents */
export interface AdminDriverDetail extends AdminDriverSummary {
  documents: DriverDocument[];
}

export interface DriverEarnings {
  totalCompletedRides: number;
  totalEarnings: number;
}
