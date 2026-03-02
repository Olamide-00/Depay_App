// src/hooks/useGoogleLogin.ts
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { useEffect } from "react";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleLogin = () => {
  // Your Android client ID
  const androidClientId =
    "833928399680-43jvqo26115sebd71fv8pd35p7ag67p0.apps.googleusercontent.com";

  // Construct the redirect URI for Android
  const redirectUri = AuthSession.makeRedirectUri({
    native: `${androidClientId.split(".")[0]}.${androidClientId.split(".")[1]}:/oauth2redirect`,
    // For development, you might want to use a different scheme
    scheme: "com.olamide00.jaanApp",
  });

  console.log("Redirect URI:", redirectUri); // Useful for debugging

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: androidClientId,
    redirectUri: Platform.select({
      android: redirectUri,
      default: undefined,
    }),
    scopes: ["profile", "email", "openid"],
    // Optional: Add android-specific client ID if you have one
    androidClientId: androidClientId, // Explicitly set for Android
  });

  const getGoogleUser = async (accessToken: string) => {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(
          `Failed to fetch Google user info: ${res.status} ${errorData}`,
        );
      }

      const userData = await res.json();
      return userData as {
        id: string;
        email: string;
        name: string;
        given_name?: string;
        family_name?: string;
        picture: string;
        verified_email: boolean;
        locale?: string;
      };
    } catch (error) {
      console.error("Error fetching Google user:", error);
      throw error;
    }
  };

  // Handle the response
  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      console.log("✅ Google login successful");
      // You can trigger a callback here if needed
    } else if (response?.type === "error") {
      console.error("❌ Google login error:", response.error);
    } else if (response?.type === "cancel") {
      console.log("Google login cancelled");
    }
  }, [response]);

  return {
    request,
    response,
    promptAsync,
    getGoogleUser,
    isLoading: !request,
  };
};
