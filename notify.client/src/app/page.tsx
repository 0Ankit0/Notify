"use client";

import { useAuth } from "@/hooks/use-auth";
import LoginForm from "@/components/login-form";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/loading-screen";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginPage() {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  // if (status === "loading") {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 bg-background">
  //       <div className="w-full max-w-md space-y-8">
  //         <Skeleton className="h-12 w-32 mx-auto" />
  //         <div className="space-y-6">
  //           <Skeleton className="h-10 w-full" />
  //           <Skeleton className="h-10 w-full" />
  //           <Skeleton className="h-10 w-full" />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return <LoginForm />;
}
