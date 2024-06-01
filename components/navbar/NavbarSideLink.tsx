"use client";
import Link, { LinkProps } from "next/link";

import { closeDrawer } from "@/utils/closeDrawer";

interface NavbarSideLinkProps extends LinkProps {
    children: React.ReactNode;
}

const NavbarSideLink = ({ href, children }: NavbarSideLinkProps) => {
    return (
        <Link onClick={closeDrawer} href={href}>
            {children}
        </Link>
    );
};

export default NavbarSideLink;
