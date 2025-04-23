import React, { createContext, useState, useContext, useEffect } from "react";
import { User, PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/config/firebase";
import * as SecureStore from "expo-secure-store";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  verificationId: string | null;
  phoneNumber: string | null;
  setVerificationId: (id: string | null) => void;
  setPhoneNumber: (number: string | null) => void;
  signInWithPhone: (phoneNumber: string) => Promise<void>;
  confirmCode: (code: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  verificationId: null,
  phoneNumber: null,
  setVerificationId: () => {},
  setPhoneNumber: () => {},
  signInWithPhone: async () => {},
  confirmCode: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithPhone = async (phoneNumber: string) => {
    try {
      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(
        phoneNumber,
        // @ts-ignore - RecaptchaVerifier is not needed for Expo
        null
      );
      setVerificationId(verificationId);
      setPhoneNumber(phoneNumber);
    } catch (error) {
      console.error("Error sending verification code:", error);
      throw error;
    }
  };

  const confirmCode = async (code: string) => {
    try {
      if (!verificationId) throw new Error("No verification ID");

      const credential = PhoneAuthProvider.credential(verificationId, code);
      const result = await signInWithCredential(auth, credential);
      setUser(result.user);

      // Clear verification state
      setVerificationId(null);
      setPhoneNumber(null);
    } catch (error) {
      console.error("Error confirming code:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      await SecureStore.deleteItemAsync("userToken");
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        verificationId,
        phoneNumber,
        setVerificationId,
        setPhoneNumber,
        signInWithPhone,
        confirmCode,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
