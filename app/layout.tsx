import Link from "next/link";
import "./globals.css";
import ThemeChanger from "./ThemeChanger";
import NavbarUser from "./NavbarUser";
import { NextAuthProvider } from "./providers";

export const revalidate = 3600;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="cs" className="font-sans">
            <head />
            <body>
                <NextAuthProvider>
                    <div className="navbar bg-base-100 border-b border-base-300 py-3 px-9">
                        <div className="navbar-start">
                            <div className="dropdown">
                                <label tabIndex={0} className="btn btn-ghost md:hidden">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                                    </svg>
                                </label>
                                <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                                    <li>
                                        <Link href="/rozhledny">Rozhledny</Link>
                                    </li>
                                    <li>
                                        <Link href="/mapa">Mapa</Link>
                                    </li>
                                    <li>
                                        <Link href="/komunita">Komunita</Link>
                                    </li>
                                </ul>
                            </div>
                            <Link href="/" className="btn btn-ghost normal-case text-lg md:text-xl lg:text-3xl ml-[-0.5rem]">
                                ROZHLEDNOVÝ SVĚT
                            </Link>
                        </div>
                        <div className="navbar-center hidden md:flex">
                            <ul className="menu menu-horizontal px-1">
                                <li>
                                    <Link className="active:bg-secondary" href="/rozhledny">
                                        Rozhledny
                                    </Link>
                                </li>
                                <li>
                                    <Link className="active:bg-secondary" href="/mapa">
                                        Mapa
                                    </Link>
                                </li>
                                <li>
                                    <Link className="active:bg-secondary" href="/komunita">
                                        Komunita
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="navbar-end flex gap-3">
                            <ThemeChanger />

                            <NavbarUser />
                        </div>
                    </div>
                    {children}
                </NextAuthProvider>
            </body>
        </html>
    );
}
