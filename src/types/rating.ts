import { PaginationMeta } from "./api";

export interface Rating {
  id: string;
  rideId: string;
  riderId: string;
  driverId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

/** GET /drivers/:driverId/ratings — sent via sendSuccess, so pagination is nested under data, not top-level */
export interface DriverRatingsResult {
  ratings: Rating[];
  averageRating: number | null;
  meta: PaginationMeta;
}
