import { useEffect } from "react";
import { useGoogleSignIn } from "./src/hooks/useGoogleSignIn";
import RootNavigation from "./src/navigation/root";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function App() {
  const { configureGoogleSignIn } = useGoogleSignIn();

  const [fontsLoaded] = useFonts({
    "Tinos-Regular": require("./assets/fonts/Tinos-Regular.ttf"),
    "Tinos-Bold": require("./assets/fonts/Tinos-Bold.ttf"),
    "Tinos-Italic": require("./assets/fonts/Tinos-Italic.ttf"),
    "Tinos-BoldItalic": require("./assets/fonts/Tinos-BoldItalic.ttf"),
  });

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar barStyle="dark-content" />
      <RootNavigation />
    </QueryClientProvider>
  );
}
