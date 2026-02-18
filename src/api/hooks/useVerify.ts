import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../endpoints";
import axiosInstance from "../axiosInstance";

type VerifyPayload = {
  serviceID: string;
  billersCode: string;
};

type VerifyResponse = any;

const useVerify = () => {
  const queryClient = useQueryClient();

  return useMutation<VerifyResponse, Error, VerifyPayload>({
    mutationFn: async (payload: VerifyPayload) => {
      const response = await axiosInstance.post<VerifyResponse>(
        API_ENDPOINTS.VERIFY,
        payload
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Refetch related queries after a successful verification
      queryClient.invalidateQueries({
        queryKey: ["verification", variables.serviceID, variables.billersCode],
      });
    },
  });
};

// verify bank details
export const useVerifyBank = (bankCode?: string, accountNumber?: string) => {
  return useQuery({
    queryKey: ["verifyBank", bankCode, accountNumber],
    queryFn: async () => {
      if (!bankCode || !accountNumber) return null;
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.VERIFY_BANK}?bankCode=${bankCode}&accountNumber=${accountNumber}`
      );
      return response.data;
    },
    enabled: !!bankCode && !!accountNumber,
  });
};

export default useVerify;
