import type { Metadata } from "next";
import './globals.css'
import { AppSidebar } from "@/components/custom/app-sidebar";
import { SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import { MobileMenuButton } from "@/components/custom/mobile-button";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
