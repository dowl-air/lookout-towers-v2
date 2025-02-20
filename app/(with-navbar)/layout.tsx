import Navbar from "@/components/navbar/Navbar";
import NavbarDrawer from "@/components/navbar/NavbarDrawer";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NavbarDrawer>
                <div className="flex flex-col min-h-[100dvh]">
                    <Navbar />
                    {children}
                </div>
            </NavbarDrawer>
        </>
    );
}
