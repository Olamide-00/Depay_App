// src/hooks/useGoogleAppAuth.ts
import * as Google from "expo-google-app-auth";
import { Platform } from "react-native";
import { Alert } from "react-native";

// Your Android client ID
const ANDROID_CLIENT_ID =
  "833928399680-43jvqo26115sebd71fv8pd35p7ag67p0.apps.googleusercontent.com";

export const useGoogleAppAuth = () => {
  const signInWithGoogle = async () => {
    try {
      console.log("Starting Google Sign-In with expo-google-app-auth...");

      const config = {
        androidClientId: ANDROID_CLIENT_ID,
        // For Expo Go, we need to include these scopes
        scopes: ["profile", "email", "openid"],
        // This helps with the redirect in Expo Go
        redirectUrl: Platform.select({
          android: `com.googleusercontent.apps.${ANDROID_CLIENT_ID.split(".")[0]}.${ANDROID_CLIENT_ID.split(".")[1]}:/oauth2redirect`,
          default: undefined,
        }),
      };

      console.log("Auth config:", JSON.stringify(config, null, 2));

      const result = await Google.logInAsync(config);

      console.log("Google Sign-In result type:", result.type);

      if (result.type === "success") {
        console.log("Google Sign-In successful");
        return {
          accessToken: result.accessToken,
          idToken: result.idToken,
          refreshToken: result.refreshToken,
          user: result.user,
          type: "success",
        };
      } else {
        console.log("Google Sign-In cancelled or failed:", result.type);
        return { type: "cancel" };
      }
    } catch (error: any) {
      console.error("Google Sign-In error details:", error);

      // More specific error messages
      if (error.message?.includes("CANCELLED")) {
        return { type: "cancel" };
      }

      if (error.message?.includes("PLAY_SERVICES_NOT_AVAILABLE")) {
        Alert.alert(
          "Google Play Services Required",
          "Please install Google Play Services to use Google Sign-In.",
        );
      }

      throw error;
    }
  };

  const getGoogleUser = async (accessToken: string) => {
    try {
      console.log("Fetching Google user info...");
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Failed to fetch Google user info: ${res.status} ${errorText}`,
        );
      }

      const userData = await res.json();
      console.log("Google user info fetched:", userData.email);
      return userData;
    } catch (error) {
      console.error("Error fetching Google user:", error);
      throw error;
    }
  };

  return { signInWithGoogle, getGoogleUser };
};
