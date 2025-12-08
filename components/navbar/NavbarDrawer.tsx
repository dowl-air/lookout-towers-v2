import { House, LayoutList, Map } from "lucide-react";

import LoginLink from "@/components/navbar/links/LoginLink";
import LogoutLink from "@/components/navbar/links/LogoutLink";
import ProfileLink from "@/components/navbar/links/ProfileLink";
import VisitedTowersLink from "@/components/navbar/links/VisitedTowersLink";
import NavbarSideLink from "@/components/navbar/NavbarSideLink";
import ThemeChangerPhone from "@/components/navbar/ThemeChangerPhone";

const NavbarDrawer = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="drawer">
            <input id="side-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col min-h-dvh">{children}</div>
            <div className="drawer-side z-10">
                <label htmlFor="side-drawer" className="drawer-overlay"></label>
                <ul tabIndex={0} className="menu p-4 w-80 h-full bg-base-200">
                    <li>
                        <NavbarSideLink href="/">
                            <House />
                            Domů
                        </NavbarSideLink>
                    </li>
                    <li>
                        <NavbarSideLink href="/rozhledny">
                            <LayoutList />
                            Rozhledny
                        </NavbarSideLink>
                    </li>
                    <li>
                        <NavbarSideLink href="/mapa">
                            <Map />
                            Mapa
                        </NavbarSideLink>
                    </li>

                    <VisitedTowersLink />
                    <ProfileLink />
                    <LogoutLink />
                    <LoginLink />

                    <ThemeChangerPhone />
                </ul>
            </div>
        </div>
    );
};

export default NavbarDrawer;
