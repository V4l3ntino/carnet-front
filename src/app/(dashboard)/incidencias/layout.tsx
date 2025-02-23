import { ItemProvider } from "@/context/itemsContext/ItemProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            <ItemProvider>
                {children}
            </ItemProvider>
        </section>
    );
}