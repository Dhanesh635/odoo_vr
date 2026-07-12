import type { Metadata } from "next";
import DashboardLayout from "@/components/layout/DashboardLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "TransitOps",
  description: "Smart Transport Operations Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-950 text-slate-100">
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
