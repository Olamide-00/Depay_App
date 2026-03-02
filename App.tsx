import { useEffect } from "react";
import { useGoogleSignIn } from "./src/hooks/useGoogleSignIn";
import RootNavigation from "./src/navigation/root";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  const { configureGoogleSignIn } = useGoogleSignIn();

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigation />
    </QueryClientProvider>
  );
}
