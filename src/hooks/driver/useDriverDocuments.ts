"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as driversService from "@/services/drivers.service";
import { driverProfileKeys } from "./useDriverProfile";

export function useDriverDocumentsQuery() {
  return useQuery({
    queryKey: driverProfileKeys.documents,
    queryFn: driversService.getDocuments,
  });
}

export function useAddDriverDocumentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: driversService.addDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driverProfileKeys.documents });
    },
  });
}
