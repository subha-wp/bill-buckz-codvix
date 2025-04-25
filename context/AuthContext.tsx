import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  setUserFromLogin: (user: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  signOut: async () => {},
  setUserFromLogin: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)/login");
        }
      } catch (e) {
        console.error("Error parsing stored user:", e);
        router.replace("/(auth)/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const setUserFromLogin = async (userData: any) => {
    await SecureStore.setItemAsync("user", JSON.stringify(userData));
    setUser(userData);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync("user");
    router.replace("/(auth)/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signOut,
        setUserFromLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
