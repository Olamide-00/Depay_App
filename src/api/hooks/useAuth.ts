import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import { AxiosError } from "axios";
import { API_ENDPOINTS } from "../endpoints";
import { useEffect } from "react";

// Define types for each request payload and response
interface RegisterData {
  name: string;
  email: string;
  password: string;
  pushToken: string | null;
  referralCode?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface OtpData {
  email: string;
  otp: string;
}

interface ResendOtpData {
  email: string;
}

interface ResetOTPRequest {
  email: string;
}

interface UpdatePasswordRequest {
  email: string;
  otp: string;
  password: string;
}

// Generic API response type
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const useRegister = () => {
  return useMutation<ApiResponse<any>, Error, RegisterData>({
    mutationFn: async (userData) => {
      const response = await axiosInstance.post<ApiResponse<any>>(
        API_ENDPOINTS.REGISTER,
        userData
      );
      return response.data;
    },
  });
};

const useLogin = () => {
  return useMutation<ApiResponse<{ token: string }>, Error, LoginData>({
    mutationFn: async (credentials) => {
      const response = await axiosInstance.post<ApiResponse<{ token: string }>>(
        API_ENDPOINTS.LOGIN,
        credentials
      );
      return response.data;
    },
  });
};

const useVerifyOtp = () => {
  return useMutation<ApiResponse<any>, Error, OtpData>({
    mutationFn: async (otpData) => {
      const response = await axiosInstance.post<ApiResponse<any>>(
        API_ENDPOINTS.VERIFY_OTP,
        otpData
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("OTP Verified Successfully:", data);
    },
  });
};


//Resend OTP
const useResendOtp = () => {
  return useMutation<ApiResponse<any>, AxiosError, ResendOtpData>({
    mutationFn: async (emailData) => {
      const response = await axiosInstance.post<ApiResponse<any>>(
        API_ENDPOINTS.RESEND_OTP,
        emailData
      );
      return response.data;
    },
  });
};


//get instant wallet ballances
const useGetBalance = (email: string) => {
  const {
    data: balance,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["balance", email],
    queryFn: async () => {
      if (!email) throw new Error("Email is required");
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.GET_BALANCE}/${email}`
      );
      return response.data;
    },
    // Nuclear option - always refetch on mount
    staleTime: 0,
    cacheTime: 0,
  });

  return { balance, isLoading, isError, refetch };
};

const usePINOtp = () => {
  return useMutation<ApiResponse<any>, Error>({
    mutationFn: async (emailData) => {
      const response = await axiosInstance.post<ApiResponse<any>>(
        API_ENDPOINTS.PIN_OTP,
        emailData
      );
      return response.data;
    },
  });
};

const useUpdatePIN = () => {
  return useMutation<ApiResponse<any>, Error>({
    mutationFn: async (pinData) => {
      const response = await axiosInstance.post<ApiResponse<any>>(
        API_ENDPOINTS.UPDATE_PIN,
        pinData
      );
      return response.data;
    },
  });
};

const useUpdateNumber = () => {
  return useMutation<ApiResponse<any>, Error>({
    mutationFn: async (phoneData) => {
      const response = await axiosInstance.post<ApiResponse<any>>(
        API_ENDPOINTS.UPDATE_NUMBER,
        phoneData
      );
      return response.data;
    },
  });
};

// reset password otp
const useResetOTP = () => {
  return useMutation<ApiResponse<any>, Error, ResetOTPRequest>({
    mutationFn: async (otpData) => {
      const response = await axiosInstance.post<ApiResponse<any>>(
        API_ENDPOINTS.RESET_OTP,
        otpData
      );
      return response.data;
    },
  });
};

// update password
const useUpdatePassword = () => {
  return useMutation<ApiResponse<any>, Error, UpdatePasswordRequest>({
    mutationFn: async (passwordData) => {
      const response = await axiosInstance.post<ApiResponse<any>>(
        API_ENDPOINTS.UPDATE_PASSWORD,
        passwordData
      );
      return response.data;
    },
  });
};

// set profile picture
const useSetProfilePicture = () => {
  return useMutation<ApiResponse<any>, Error>({
    mutationFn: async (profilePictureData) => {
      const response = await axiosInstance.post<ApiResponse<any>>(
        API_ENDPOINTS.SET_PROFILE_PICTURE,
        profilePictureData
      );
      return response.data;
    },
  });
};

// delete account
const useDeleteAccount = () => {
  return useMutation<ApiResponse<any>, Error, string>({
    mutationFn: async (email: string) => {
      const response = await axiosInstance.delete<ApiResponse<any>>(
        `${API_ENDPOINTS.DELETE_ACCOUNT}/${email}`
      );
      return response.data;
    },
  });
};

export {
  useRegister,
  useLogin,
  useVerifyOtp,
  useResendOtp,
  useGetBalance,
  usePINOtp,
  useUpdatePIN,
  useUpdateNumber,
  useResetOTP,
  useUpdatePassword,
  useSetProfilePicture,
  useDeleteAccount,
};
