"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
const AuthContext = createContext<string>("");

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const jwtToken = Cookies.get("JWT");
    if (jwtToken) {
      setToken(jwtToken);
    }
  }, []);

  return <AuthContext.Provider value={token}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
