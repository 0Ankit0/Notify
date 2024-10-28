"use client";

import { useAuth } from "@/hooks/use-auth";
import LoginForm from "@/components/login-form";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return <LoginForm />;
}
