"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/loading-screen";
import { useAuth } from "@/hooks/use-auth";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!user) {
  //     router.replace("/");
  //   }
  // }, [user]);

  // if (loading) {
  //   return <LoadingScreen />;
  // }

  // if (!user) {
  //   return null;
  // }

  return <>{children}</>;
}
