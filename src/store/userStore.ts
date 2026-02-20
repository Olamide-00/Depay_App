import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";

const secureStorage = {
  getItem: async (name: string) => {
    const value = await SecureStore.getItemAsync(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, JSON.stringify(value));
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
};

interface UserData {
  email: string;
  name: string;
  phoneNumber: string;
  isWalletCreated: boolean;
  balance: number;
  profilePicture: string;
  tag: string;
  dateOfBirth?: string; 
  gender?: string;      
  bankName?: string;
  account?: string
}

interface Account {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
}

interface AuthState {
  isOnboarded: boolean;
  isAuthenticated: boolean;
  isActivated: boolean;
  isBioEnable: boolean;
  enableNotification: boolean;
  userData: UserData | null;
  token: string | null;
  isWalletCreated: boolean;
  isWalletCreatedLocally: boolean;
  accountDetails: Account[];
  loginDate: string | null;

  setIsOnboarded: (value: boolean) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsActivated: (value: boolean) => void;
  setIsBioEnable: (value: boolean) => void;
  setEnableNotification: (value: boolean) => void;
  setIsWalletCreated: (value: boolean) => void;
  setIsWalletCreatedLocally: (value: boolean) => void;
  setAccountDetails: (accounts: Account[]) => void;
  setUserData: (data: UserData | null) => void;
  setToken: (token: string | null) => void;
  login: (token: string, userData: UserData) => void;
  logout: () => void;
  activateAccount: () => void;
  deactivateAccount: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isOnboarded: false,
      isAuthenticated: false,
      isActivated: false,
      isBioEnable: false,
      enableNotification: false,
      isWalletCreated: false,
      isWalletCreatedLocally: false,
      accountDetails: [],
      userData: null,
      token: null,
      loginDate: null,

      setIsOnboarded: (value) => set({ isOnboarded: value }),
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      setIsActivated: (value) => set({ isActivated: value }),
      setIsBioEnable: (value) => set({ isBioEnable: value }),
      setEnableNotification: (value) => set({ enableNotification: value }),
      setIsWalletCreated: (value) => set({ isWalletCreated: value }),
      setIsWalletCreatedLocally: (value) => set({ isWalletCreatedLocally: value }),
      setAccountDetails: (accounts) => set({ accountDetails: accounts }),
      setUserData: (data) => set({ userData: data }),
      setToken: (token) => set({ token }),

      login: (token, userData) =>
        set({
          isAuthenticated: true,
          token,
          userData,
          loginDate: new Date().toISOString(),
        }),

      logout: async () => {
        await secureStorage.removeItem("auth-storage");
        set({
          // isOnboarded: false,
          isAuthenticated: false,
          isActivated: false,
          isBioEnable: false,
          enableNotification: false,
          isWalletCreated: false,
          isWalletCreatedLocally: false,
          accountDetails: [],
          userData: null,
          token: null,
          loginDate: null,
        });
      },

      activateAccount: () => set({ isActivated: true }),
      deactivateAccount: () => set({ isActivated: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        isOnboarded: state.isOnboarded,
        isAuthenticated: state.isAuthenticated,
        isActivated: state.isActivated,
        isBioEnable: state.isBioEnable,
        enableNotification: state.enableNotification,
        isWalletCreated: state.isWalletCreated,
        isWalletCreatedLocally: state.isWalletCreatedLocally,
        accountDetails: state.accountDetails,
        userData: state.userData,
        token: state.token,
        loginDate: state.loginDate,
      }),
    }
  )
);

export default useAuthStore;

export const selectIsOnboarded = (state: AuthState) => state.isOnboarded;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsActivated = (state: AuthState) => state.isActivated;
export const selectIsBioEnable = (state: AuthState) => state.isBioEnable;
export const selectEnableNotification = (state: AuthState) => state.enableNotification;
export const selectUserData = (state: AuthState) => state.userData;
export const selectToken = (state: AuthState) => state.token;
export const selectIsWalletCreatedLocally = (state: AuthState) => state.isWalletCreatedLocally;