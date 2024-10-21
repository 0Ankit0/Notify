import { AuthLayoutWrapper } from "@/src/components/auth/authLayout";
import "@/src/app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayoutWrapper>{children}</AuthLayoutWrapper>;
}
