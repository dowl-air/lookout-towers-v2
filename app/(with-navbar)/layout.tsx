import Navbar from "@/components/navbar/Navbar";
import NavbarDrawer from "@/components/navbar/NavbarDrawer";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <NavbarDrawer>
            <Navbar />
            {children}
        </NavbarDrawer>
    );
}
