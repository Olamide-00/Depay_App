import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../endpoints";
import axiosInstance from "../axiosInstance";

// Get all banks
const useAllBanks = () => {
  return useQuery({
    queryKey: ["banks"],
    queryFn: async () => {
      const response = await axiosInstance.get(API_ENDPOINTS.ALL_BANKS);
      return response.data?.data || [];
    },
  });
};

// Transfer to banks
const useTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transferData: {
      accountNumber: string;
      bankCode: string;
      amount: number;
    }) => {
      const response = await axiosInstance.post(
        API_ENDPOINTS.TRANSFER,
        transferData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["history", "balance"]);
    },
  });
};

// Get transfer history
const useTransferHistory = (email: string) => {
  return useQuery({
    queryKey: ["history", email],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.FUNDING_HISTORY}/${email}`
      );
      return response?.data.data || [];
    },
  });
};

// find by remit tag
const useFindRemit = (tag) => {
  return useQuery({
    queryKey: ["findRemit", tag],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.FIND_REMIT_TAG}/${tag}`
      );
      return response.data;
    },
    enabled: !!tag,
  });
};

// transfer to remit account
const useTransferRemit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transferData: {
      email: string;
      tag: string;
      amount: number;
    }) => {
      const response = await axiosInstance.post(
        API_ENDPOINTS.TRANSFER_REMIT,
        transferData
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate SPECIFIC balance query for the affected user
      queryClient.invalidateQueries(["balance", variables.email]);

      // Also invalidate history if needed
      queryClient.invalidateQueries(["history"]);
    },
  });
};

export {
  useAllBanks,
  useTransfer,
  useTransferHistory,
  useFindRemit,
  useTransferRemit,
};
