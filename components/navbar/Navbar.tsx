import { TextAlignStart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import NavbarUserDesktop from "@/components/navbar/NavbarUserDesktop";
import NavbarUserMobile from "@/components/navbar/NavbarUserMobile";
import ThemeChanger from "@/components/navbar/ThemeChanger";

function Navbar() {
    return (
        <header className="border-b border-base-300 w-full sticky top-0 z-10000 backdrop-blur-md bg-base-100 bg-opacity-70 border-opacity-60">
            <div className="navbar max-w-7xl mx-auto px-3">
                <div className="navbar-start">
                    <label
                        aria-label="Otevřít navigaci"
                        tabIndex={0}
                        htmlFor="side-drawer"
                        className="btn btn-ghost md:hidden flex flex-nowrap gap-1 p-0 min-[320px]:px-3 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100"
                    >
                        <TextAlignStart size={16} />
                        <span className="sr-only">Otevřít navigaci</span>
                        <NavbarUserMobile />
                    </label>
                    <Link
                        href="/"
                        className="flex items-center text-nowrap tracking-tight md:tracking-tighter gap-3 font-semibold text-base min-[450px]:text-xl lg:text-2xl"
                    >
                        <Image
                            src="/img/logo.png"
                            alt="Rozhlednový svět"
                            width={40}
                            height={40}
                            className="hidden md:block"
                        />
                        Rozhlednový svět
                    </Link>
                </div>

                <nav aria-label="Primary" className="navbar-center hidden md:flex">
                    <ul className="menu menu-horizontal gap-1 rounded-full border border-base-300/70 bg-base-100/70 px-2 py-1 shadow-sm">
                        <li>
                            <Link
                                className="rounded-full active:bg-secondary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100"
                                href="/rozhledny"
                            >
                                Rozhledny
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="rounded-full active:bg-secondary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100"
                                href="/mapa"
                            >
                                Mapa
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="rounded-full active:bg-secondary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100"
                                href="/komunita"
                            >
                                Komunita
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="navbar-end items-center gap-3 hidden md:flex">
                    <ThemeChanger />
                    <NavbarUserDesktop />
                </div>
            </div>
        </header>
    );
}

export default Navbar;
