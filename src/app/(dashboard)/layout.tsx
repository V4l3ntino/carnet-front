import { AppSidebar } from "@/components/custom/app-sidebar";
import { MobileMenuButton } from "@/components/custom/mobile-button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            <SidebarProvider>
                <MobileMenuButton />
                <AppSidebar />
                <SidebarInset>
                    <main className="mt-3 ml-2">{children}</main>
                </SidebarInset>
            </SidebarProvider>
        </section>
    );
}