import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import { API_ENDPOINTS } from "../endpoints";
import useAuthStore from "../../store/userStore"
import { useEffect } from "react";
import { isLoading } from "expo-font";

// Define types for request payload and response
interface CreateWalletData {
  email: string;
  customerName: string;
  bvn: string;
  email: string;
  
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

// Create wallet mutation
const useCreateWallet = () => {
  return useMutation<ApiResponse<any>, Error, CreateWalletData>({
    mutationFn: async (userData) => {
      const response = await axiosInstance.post<ApiResponse<any>>(
        API_ENDPOINTS.CREATE_WALLET,
        userData
      );
      return response.data;
    },
  });
};

// Query to fetch wallet details and update store
export const useWalletDetails = () => {
  // Get userData from store
  const userData = useAuthStore((state) => state.userData);
  const setAccountDetails = useAuthStore((state) => state.setAccountDetails);
  const email = userData?.email;

  const { data, isSuccess, isError, error, refetch } = useQuery<
    ApiResponse<WalletDetailsResponse>,
    Error
  >({
    queryKey: ["walletDetails", email],
    queryFn: async () => {
      if (!email) {
        throw new Error("Email not available");
      }

      const walletDetailsUrl = `/wallet/account-details/${email}`;

      const response = await axiosInstance.get<
        ApiResponse<WalletDetailsResponse>
      >(walletDetailsUrl);

      return response.data;
    },
    enabled: !!email,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  useEffect(() => {
    if (isSuccess && data?.data?.accounts) {
      console.log("Setting account details:", data.data.accounts);
      setAccountDetails(data.data.accounts);
    }
  }, [isSuccess, data, setAccountDetails]);

  // Return everything the component might need
  return {
    walletData: data,
    isSuccess,
    isError,
    isLoading,
    error,
    refetch,
  };
};


export { useCreateWallet };
