import Navbar from "@/components/navbar/Navbar";
import NavbarDrawer from "@/components/navbar/NavbarDrawer";
import Footer from "@/components/footer/Footer";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NavbarDrawer>
                <Navbar />
                {children}
                <Footer />
            </NavbarDrawer>
        </>
    );
}
