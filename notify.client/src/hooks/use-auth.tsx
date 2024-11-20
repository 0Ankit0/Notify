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
      console.log("sessionUser", sessionUser);
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
      const res = await fetch("/api/Session/RemoveSession", {
        method: "POST",
      });
      // const response = await res.json();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return { user, loading, login, logout };
}
