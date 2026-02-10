import { TextAlignStart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import NavbarUserDesktop from "@/components/navbar/NavbarUserDesktop";
import NavbarUserMobile from "@/components/navbar/NavbarUserMobile";
import ThemeChanger from "@/components/navbar/ThemeChanger";

function Navbar() {
    return (
        <div className="border-b border-base-300 w-full sticky top-0 z-10000 backdrop-blur-md bg-base-100 bg-opacity-70 border-opacity-60">
            <div className="navbar max-w-7xl mx-auto px-3">
                <div className="navbar-start">
                    <label
                        tabIndex={0}
                        htmlFor="side-drawer"
                        className="btn btn-ghost md:hidden flex flex-nowrap gap-1 p-0 min-[320px]:px-3"
                    >
                        <TextAlignStart size={16} />
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
                    </ul>
                </div>

                <div className="navbar-end items-center gap-3 hidden md:flex">
                    <ThemeChanger />
                    <NavbarUserDesktop />
                </div>
            </div>
        </div>
    );
}

export default Navbar;
