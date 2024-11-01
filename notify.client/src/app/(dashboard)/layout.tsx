import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AuthWrapper from "./auth-wrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
