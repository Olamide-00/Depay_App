import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import { API_ENDPOINTS } from "../endpoints";



// Define types for request payload and response
interface VerifyPINData {
  email: string;
  pin: string;
}

interface ApiResponse<T> {
  status: string;
  message: string;
}



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

export { useVerifyPIN };
