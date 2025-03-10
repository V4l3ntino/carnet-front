import { AppSidebar } from "@/components/custom/app-sidebar";
import { MobileMenuButton } from "@/components/custom/mobile-button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/context/AuthProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            <AuthProvider>
                <SidebarProvider>
                    <MobileMenuButton />
                    <AppSidebar />
                    <SidebarInset>
                        <main className="mt-3 ml-2 p-10">{children}</main>
                    </SidebarInset>
                </SidebarProvider>
            </AuthProvider>
        </section>
    );
}