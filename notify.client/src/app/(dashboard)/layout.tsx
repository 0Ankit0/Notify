import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AuthWrapper from "./auth-wrapper";
import { AuthProvider } from "@/app/Providers";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
