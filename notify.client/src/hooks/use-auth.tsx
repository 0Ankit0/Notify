"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
      const response = await fetch("/api/Session");
      const sessionUser = await response.json();
      if (sessionUser.isLoggedIn) {
        setUser(sessionUser);
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
      const userData = await fetch("/api/auth/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      console.log(userData);
      const response = await userData.json();
      if (response.success) {
        setUser(response.user);
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
      const res = await fetch("/api/auth/Logout", {
        method: "POST",
      });
      const response = await res.json();
      if (response.success) {
        router.push("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return { user, loading, login, logout };
}
