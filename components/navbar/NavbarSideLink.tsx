"use client";
import Link, { LinkProps } from "next/link";

interface NavbarSideLinkProps extends LinkProps {
    children: React.ReactNode;
    unsign?: boolean;
}

const NavbarSideLink = ({ href, children, unsign }: NavbarSideLinkProps) => {
    const closeDrawer = () => {
        const elm = document.querySelector("#side-drawer") as HTMLInputElement;
        if (elm !== undefined) elm.checked = false;
    };

    return (
        <Link
            onClick={() => {
                unsign ? null : closeDrawer();
            }}
            href={href}
        >
            {children}
        </Link>
    );
};

export default NavbarSideLink;
