import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser, saveUserSession, getUserSession, clearUserSession } from "./auth";

interface User {
    id: string;
    username: string;
    email: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const sessionUser = getUserSession();
            if (sessionUser) {
                const user = getUserSession();
                setUser(user);
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
            const userData = await loginUser(username, password);
            if (userData) {
                saveUserSession(userData);
                setUser(userData);
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
            clearUserSession();
            setUser(null);
            router.push("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return { user, loading, login, logout };
}
