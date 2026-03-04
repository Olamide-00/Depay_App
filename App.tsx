import { useEffect } from "react";
import { useGoogleSignIn } from "./src/hooks/useGoogleSignIn";
import RootNavigation from "./src/navigation/root";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "react-native";

const queryClient = new QueryClient();

export default function App() {
  const { configureGoogleSignIn } = useGoogleSignIn();

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar barStyle="dark-content" />
      <RootNavigation />
    </QueryClientProvider>
  );
}
