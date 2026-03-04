import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Platform } from "react-native";

// Your Android client ID
const ANDROID_CLIENT_ID =
  "833928399680-43jvqo26115sebd71fv8pd35p7ag67p0.apps.googleusercontent.com";

const WEB_CLIENT_ID =
  "833928399680-hk2cmrl36601bbnmi5p2o77d7hdadd9n.apps.googleusercontent.com";

export const useGoogleSignIn = () => {
  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: false,
      scopes: ["profile", "email"],
    });
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      return { type: "success", user: userInfo };
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      return { type: "error", error };
    }
  };

  const getCurrentUser = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      return await GoogleSignin.getCurrentUser();
    }
    return null;
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return {
    configureGoogleSignIn,
    signIn,
    getCurrentUser,
    signOut,
  };
};
