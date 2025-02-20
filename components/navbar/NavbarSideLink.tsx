"use client";
import Link, { LinkProps } from "next/link";

import { closeDrawer } from "@/utils/closeDrawer";

interface NavbarSideLinkProps extends LinkProps {
    children: React.ReactNode;
}

const NavbarSideLink = ({ href, children }: NavbarSideLinkProps) => {
    return (
        <Link onClick={closeDrawer} href={href} className="text-xl">
            {children}
        </Link>
    );
};

export default NavbarSideLink;
