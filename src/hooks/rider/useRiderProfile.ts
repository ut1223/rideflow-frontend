"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as usersService from "@/services/users.service";
import { CURRENT_USER_QUERY_KEY } from "@/providers/AuthProvider";

/** Writes back into the same cache key AuthProvider's GET /auth/me populates —
 *  /users/me and /auth/me return the identical User shape, so there's no need for a second query. */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersService.updateMe,
    onSuccess: (user) => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, user);
    },
  });
}
