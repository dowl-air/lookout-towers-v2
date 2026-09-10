"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { MouseEvent } from "react";

function SupportLink() {
    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        if (
            window.location.pathname !== "/podporit" ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return;
        }

        event.preventDefault();
        window.history.replaceState(
            null,
            "",
            `${window.location.pathname}${window.location.search}`
        );
        document.getElementById("qr-platba")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <Link
            href="/podporit"
            onClick={handleClick}
            className="support-heart group flex h-10 w-10 items-center justify-center rounded-full text-base-content transition-colors hover:bg-error/10 hover:text-error focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100"
            aria-label="Podpořit Rozhlednový svět"
            title="Podpořit Rozhlednový svět"
        >
            <Heart
                aria-hidden="true"
                size={28}
                strokeWidth={2.75}
                className="transition-[fill,transform] duration-200 group-hover:fill-current"
            />
        </Link>
    );
}

export default SupportLink;
