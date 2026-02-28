import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

// Required — tells Expo to complete the auth session after redirect
WebBrowser.maybeCompleteAuthSession();

export const useGoogleLogin = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  const getGoogleUser = async (accessToken: string) => {
    const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch Google user info");
    }

    return (await res.json()) as {
      id: string;
      email: string;
      name: string;
      picture: string;
      verified_email: boolean;
    };
  };

  return {
    request, // OAuth request object (null until ready)
    response, // OAuth response (null until user completes flow)
    promptAsync, // Call this to open the Google sign-in window
    getGoogleUser,
  };
};
