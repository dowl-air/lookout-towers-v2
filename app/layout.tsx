import "./globals.css";
import { NextAuthProvider, NextThemeProvider } from "./providers";
import ClientLinkDrawerClose from "./ClientLinkDrawerClose";
import { Unsign } from "./personalisedLinks";

export const revalidate = 3600;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="cs" className="font-sans" data-theme="garden">
            <head />
            <body>
                <NextAuthProvider>
                    <NextThemeProvider>
                        <div className="drawer">
                            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                            <div className="drawer-content">{children}</div>
                            <div className="drawer-side">
                                <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
                                <ul tabIndex={0} className="menu p-4 w-80 h-full bg-base-200">
                                    <li>
                                        <ClientLinkDrawerClose text="Rozhledny" href="/rozhledny" />
                                    </li>
                                    <li>
                                        <ClientLinkDrawerClose text="Mapa" href="/mapa" />
                                    </li>
                                    <li>
                                        <ClientLinkDrawerClose text="Komunita" href="/komunita" />
                                    </li>
                                    <li>
                                        <Unsign />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </NextThemeProvider>
                </NextAuthProvider>
            </body>
        </html>
    );
}
