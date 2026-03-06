import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import { API_ENDPOINTS } from "../endpoints";
import useAuthStore from "../../store/userStore";
import { useEffect } from "react";

interface CreateWalletData {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  bvn: string;
  preferred_bank?: string;
  country?: string;
}

interface Account {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
}

interface WalletDetailsResponse {
  status: string;
  message: string;
  data: {
    accounts: Account[];
  };
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

// ✅ Fixed: interface matches backend exactly
const useCreateWallet = () => {
  return useMutation<ApiResponse<any>, Error, CreateWalletData>({
    mutationFn: async (userData) => {
      const response = await axiosInstance.post<ApiResponse<any>>(
        API_ENDPOINTS.CREATE_WALLET,
        userData,
        {
          timeout: 90000, // 90s — backend can take 30-60s due to Paystack retries
        },
      );
      return response.data;
    },
  });
};

export const useWalletDetails = () => {
  const userData = useAuthStore((state) => state.userData);
  const setAccountDetails = useAuthStore((state) => state.setAccountDetails);
  const email = userData?.email;

  const { data, isSuccess, isError, isLoading, error, refetch } = useQuery<
    ApiResponse<WalletDetailsResponse>,
    Error
  >({
    queryKey: ["walletDetails", email],
    queryFn: async () => {
      if (!email) throw new Error("Email not available");
      const response = await axiosInstance.get<
        ApiResponse<WalletDetailsResponse>
      >(`/wallet/account-details/${email}`);
      return response.data;
    },
    enabled: !!email,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  useEffect(() => {
    if (isSuccess && data?.data?.accounts) {
      setAccountDetails(data.data.accounts);
    }
  }, [isSuccess, data, setAccountDetails]);

  return { walletData: data, isSuccess, isError, isLoading, error, refetch };
};

export { useCreateWallet };
