// @ts-nocheck
import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { isAuthenticated } = useAuth();

  // Redirect to the appropriate screen based on authentication status
  return isAuthenticated ? (
    <Redirect href="/(auth)/login" />
  ) : (
    <Redirect href="/(tabs)" />
  );
}
