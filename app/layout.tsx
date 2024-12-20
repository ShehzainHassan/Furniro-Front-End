"use client";
import { AuthProvider } from "@/components/authContext/authContext";
import Navbar from "@/components/navbar/navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import "./globals.css";

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const _token = localStorage.getItem("JWT");
      setToken(_token);
    }
  }, []);
  const userRole = async () => {
    if (token) {
      try {
        const response = await axios.get(
          `${BACKEND_API}/auth/userInfo?token=${token}`
        );
        setRole(response.data.role);
      } catch (err) {
        console.error("Error setting user role", err);
      }
    }
  };

  useEffect(() => {
    if (token) {
      userRole();
    }
  }, [token]);

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
        />
      </head>
      <body>
        <AuthProvider>
          {token && <Navbar role={role} />}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
