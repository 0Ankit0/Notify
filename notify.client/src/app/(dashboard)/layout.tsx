"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useSession } from "next-auth/react";
import { LoadingScreen } from "@/components/loading-screen";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthWrapper from "./auth-wrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (!session) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto w-full">
          <SidebarTrigger />
          <div className="w-full h-full">
            <AuthWrapper>{children}</AuthWrapper>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
