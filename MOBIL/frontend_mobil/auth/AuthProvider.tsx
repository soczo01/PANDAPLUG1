import React, { createContext, useState, useContext, ReactNode } from "react";
import { Alert } from "react-native";
import { api, setAccessToken } from "../api/api.js";

type UserType = {
  id: number;
  username: string;
  email?: string;
  role?: string;
  szerep?: string;
};

interface AuthContextType {
  user: UserType | null;
  login: (username: string, jelszo: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);

  const fetchUserProfile = async (token: string) => {
    const res = await api.get("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.user;
  };

  const login = async (username: string, jelszo: string) => {
  try {
    console.log("AuthProvider login elindult");
    console.log("kuldott username:", username);
    console.log("kuldott jelszo:", jelszo);
    console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);

    const res = await api.post("/auth/login", {
      username,
      password: jelszo
    });

    console.log("login response status:", res.status);
    console.log("login response data:", res.data);

    const token = res.data.accessToken;
    console.log("kapott token:", token);

    setAccessToken(token);

    const profileRes = await api.get("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("profile response status:", profileRes.status);
    console.log("profile response data:", profileRes.data);

    setUser(profileRes.data.user);
    return true;
  } catch (error: any) {
    console.error("Login hiba teljesen:", error);
    console.error("Login hiba response:", error?.response?.data);
    console.error("Login hiba status:", error?.response?.status);
    console.error("Login hiba message:", error?.message);
    return false;
  }
};

  const logout = async () => {
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);