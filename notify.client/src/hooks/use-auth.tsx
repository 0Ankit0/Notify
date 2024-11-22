"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import CryptoJS from "crypto-js";

export interface SessionData {
  userId?: string;
  username?: string;
  Token?: string;
  isLoggedIn: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const encryptedSessionData = sessionStorage.getItem("sessionData");
      if (encryptedSessionData) {
        const bytes = CryptoJS.AES.decrypt(
          encryptedSessionData,
          process.env.NEXT_PUBLIC_SESSION_SECRET!
        );
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setUser(decryptedData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const userData = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/User/Login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );
      const response = await userData.json();
      if (userData.status == 200) {
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(response),
          process.env.NEXT_PUBLIC_SESSION_SECRET!
        ).toString();
        sessionStorage.setItem("sessionData", encryptedData);
        setUser(response);
        router.push("/dashboard");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      sessionStorage.removeItem("sessionData");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return { user, loading, login, logout };
}
