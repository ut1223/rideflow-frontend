"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useCreateRatingMutation } from "@/hooks/rider/useRating";
import { cn, formatDate, getErrorMessage } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import { Rating } from "@/types/rating";

function StarRow({ value, size = "h-6 w-6" }: { value: number; size?: string }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={size}
          fill={n <= value ? "#f59e0b" : "none"}
          stroke={n <= value ? "#f59e0b" : "#cbd5e1"}
        />
      ))}
    </div>
  );
}

/** Read-only view of a rating that's already been submitted — driven by the ride's actual
 *  `rating` field from GET /rides/:id, not a client-side guess. */
function SubmittedRating({ rating }: { rating: Rating }) {
  return (
    <div className="space-y-2">
      <StarRow value={rating.rating} />
      {rating.comment && <p className="text-sm text-slate-600">&ldquo;{rating.comment}&rdquo;</p>}
      <p className="text-xs text-slate-400">You rated this ride on {formatDate(rating.createdAt)}</p>
    </div>
  );
}

function RatingInput({ rideId }: { rideId: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const { showToast } = useToast();
  const ratingMutation = useCreateRatingMutation();

  function handleSubmit() {
    if (rating === 0) return;
    ratingMutation.mutate(
      { rideId, rating, comment: comment.trim() || undefined },
      {
        onSuccess: () => showToast("Thanks for rating your ride!", "success"),
        onError: (error) => showToast(getErrorMessage(error), "error"),
      }
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            onMouseEnter={() => setHoverRating(value)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
            className="p-0.5"
          >
            <Star
              className="h-7 w-7"
              fill={value <= (hoverRating || rating) ? "#f59e0b" : "none"}
              stroke={value <= (hoverRating || rating) ? "#f59e0b" : "#cbd5e1"}
            />
          </button>
        ))}
      </div>
      <Textarea
        placeholder="Add an optional comment about your ride"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      {ratingMutation.isError && (
        <p role="alert" className={cn("text-sm text-red-600")}>
          {getErrorMessage(ratingMutation.error)}
        </p>
      )}
      <Button onClick={handleSubmit} disabled={rating === 0} isLoading={ratingMutation.isPending}>
        Submit Rating
      </Button>
    </div>
  );
}

export function RatingForm({ rideId, rating }: { rideId: string; rating: Rating | null }) {
  if (rating) {
    return <SubmittedRating rating={rating} />;
  }
  return <RatingInput rideId={rideId} />;
}
