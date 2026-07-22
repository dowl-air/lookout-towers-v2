"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { TowersSearchParams } from "@/types/TowersSearchParams";

const Pagination = ({
    totalPages,
    currentPage,
    pathname,
    searchParams,
}: {
    totalPages: number;
    currentPage: number;
    pathname: string;
    searchParams: TowersSearchParams;
}) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const getParams = () => {
        const params = new URLSearchParams();

        Object.entries(searchParams).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((item) => params.append(key, item));
                return;
            }

            if (value !== undefined && value !== null && value !== "") {
                params.set(key, String(value));
            }
        });

        return params;
    };

    const createPageURL = (pageNumber: number | string) => {
        const params = getParams();
        if (pageNumber === 1) {
            params.delete("page");
        } else {
            params.set("page", pageNumber.toString());
        }
        return `${pathname}?${params.toString()}`;
    };

    const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (isPending) {
            event.preventDefault();
            return;
        }

        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        event.preventDefault();
        startTransition(() => {
            router.push(href);
        });
    };

    const previousPageUrl = createPageURL(currentPage === 1 ? 1 : currentPage - 1);
    const nextPageUrl = createPageURL(currentPage === totalPages ? totalPages : currentPage + 1);

    return (
        <div className="join my-4 lg:my-8 w-full justify-center">
            <Link
                href={previousPageUrl}
                aria-disabled={isPending}
                className="join-item btn btn-sm sm:btn-md"
                onClick={(event) => handleNavigation(event, previousPageUrl)}
            >
                {isPending ? <span className="loading loading-spinner loading-sm" /> : "«"}
            </Link>
            <button className="join-item btn btn-sm sm:btn-md" disabled={isPending}>
                {isPending ? "Načítám..." : `Strana ${currentPage}/${totalPages}`}
            </button>
            <Link
                href={nextPageUrl}
                aria-disabled={isPending}
                className="join-item btn btn-sm sm:btn-md"
                onClick={(event) => handleNavigation(event, nextPageUrl)}
            >
                {isPending ? <span className="loading loading-spinner loading-sm" /> : "»"}
            </Link>
        </div>
    );
};

export default Pagination;
