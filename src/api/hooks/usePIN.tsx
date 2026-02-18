import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import { API_ENDPOINTS } from "../endpoints";

// Define types for request payload and response
interface SetPINData {
  email: string;
  pin: string;
}

// Define types for request payload and response
interface VerifyPINData {
  email: string;
  pin: string;
}

interface ApiResponse<T> {
  status: string;
  message: string;
}

const useSetPIN = () => {
  return useMutation({
    mutationFn: async (userData: SetPINData) => {
      try {
        const { data } = await axiosInstance.post<ApiResponse<any>>(
          API_ENDPOINTS.SET_PIN,
          userData
        );
        return data;
      } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to set PIN");
      }
    },
  });
};

const useVerifyPIN = () => {
  return useMutation<ApiResponse<any>, Error, VerifyPINData>({
    mutationFn: async (userData) => {
      const response = await axiosInstance.post<ApiResponse<any>>(
        API_ENDPOINTS.VERIFY_PIN,
        userData
      );
      return response.data;
    },
  });
};

export { useSetPIN, useVerifyPIN };
