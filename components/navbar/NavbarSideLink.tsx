"use client";

import Link, { LinkProps } from "next/link";

import { closeDrawer } from "@/utils/closeDrawer";

interface NavbarSideLinkProps extends LinkProps {
    children: React.ReactNode;
}

const NavbarSideLink = ({ href, children }: NavbarSideLinkProps) => {
    return (
        <Link
            onClick={closeDrawer}
            href={href}
            className="text-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-200"
        >
            {children}
        </Link>
    );
};

export default NavbarSideLink;
