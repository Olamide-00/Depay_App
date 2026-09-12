import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import { API_ENDPOINTS } from "../endpoints";

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

// Get all services
export const useGetAllServices = (identifier: string) => {
  const { data, isSuccess, isError, isLoading, refetch } = useQuery<
    ApiResponse<any>,
    Error
  >({
    queryKey: ["services", identifier],
    queryFn: async () => {
      if (!identifier) {
        throw new Error("Identifier not available");
      }

      const getServicesUrl = `bills/get-services?identifier=${identifier}`;

      const response =
        await axiosInstance.get<ApiResponse<any>>(getServicesUrl);
      return response.data;
    },
    enabled: !!identifier,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  });

  return {
    data,
    isSuccess,
    isError,
    isLoading,
    refetch,
  };
};

//service plans
export const useGetServicePLan = (serviceID: string) => {
  const { data, isSuccess, isError, isLoading, refetch } = useQuery<
    ApiResponse<any>,
    Error
  >({
    queryKey: ["services", serviceID],
    queryFn: async () => {
      if (!serviceID) {
        throw new Error("serviceID not available");
      }

      const getServicesPlansUrl = `bills/get-packages?serviceID=${serviceID}`;

      const response =
        await axiosInstance.get<ApiResponse<any>>(getServicesPlansUrl);
      return response.data;
    },
    enabled: !!serviceID,
    refetchOnWindowFocus: false,
    staleTime: 80 * 60 * 1000,
    cacheTime: 80 * 60 * 1000,
    retry: 3,
  });

  return {
    data,
    isSuccess,
    isError,
    isLoading,
    refetch,
  };
};

export const usePayBills = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<any>, Error, any>({
    mutationFn: async (userData) => {
      const response = await axiosInstance.post<ApiResponse<any>>(
        API_ENDPOINTS.PAY_BILLS,
        userData,
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the queryKey for bills history to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["bills", "histories"] });
    },
  });
};

export const useGetBillsHistory = (email: string) => {
  return useQuery<any[], Error>({
    queryKey: ["bills", "histories", email],
    queryFn: async () => {
      if (!email) {
        throw new Error("Email is required");
      }

      const response = await axiosInstance.get<any[]>(
        `${API_ENDPOINTS.BILLS_HISTORIES}/${email}`,
      );
      // Note: response.data is the raw history array here (not wrapped in
      // {data: ...}), and can be empty for a brand-new user — indexing into
      // it unconditionally (as this used to do for a debug log) throws and
      // fails the whole query, which is why history sometimes never loaded.
      return response.data;
    },
    enabled: !!email,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

// Wallet funding history (bank transfer top-ups, admin credits, etc).
// Previously the app had an endpoint constant for this but never actually
// called it, so admin wallet credits never showed up here even though they
// were visible on the admin dashboard.
export const useGetFundingHistory = (email: string) => {
  return useQuery<any[], Error>({
    queryKey: ["bills", "funding-history", email],
    queryFn: async () => {
      if (!email) {
        throw new Error("Email is required");
      }

      const response = await axiosInstance.get<ApiResponse<any[]>>(
        `${API_ENDPOINTS.FUNDING_HISTORY}/${email}`,
      );
      return response.data?.data ?? [];
    },
    enabled: !!email,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
