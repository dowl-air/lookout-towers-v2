"use client";
import Link from "next/link";
import React from "react";

type ComponentProps = {
    href: string;
    text: string;
};

function ClientLinkDrawerClose({ href, text }: ComponentProps) {
    return (
        <Link
            href={href}
            onClick={() => {
                const elm = document.querySelector("#my-drawer-3") as HTMLInputElement;
                if (elm != undefined) elm.checked = false;
            }}
        >
            {text}
        </Link>
    );
}

export default ClientLinkDrawerClose;
