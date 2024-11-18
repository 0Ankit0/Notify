import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, logout } from "@/app/api/auth/route";

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
      const sessionUser = await getSession();
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
      const response = await userData.json();
      if (response.success) {
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
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return { user, loading, login, logout };
}
