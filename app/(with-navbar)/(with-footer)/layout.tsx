import Footer from "@/components/footer/Footer";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Footer />
        </>
    );
}
