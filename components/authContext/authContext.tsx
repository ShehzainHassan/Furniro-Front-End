"use client";
import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext<string>("");

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const jwtToken = localStorage.getItem("JWT");
    if (jwtToken) {
      setToken(jwtToken);
    }
  }, []);

  return <AuthContext.Provider value={token}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
