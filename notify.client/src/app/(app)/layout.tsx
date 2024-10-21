import { Layout } from "@/src/components/layout/layout";
import "@/src/app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
