"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { createVisitPageUrl } from "@/utils/visitPagination";

type VisitPaginationProps = {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextCursor?: string;
    previousCursor?: string;
};

const VisitPagination = ({
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextCursor,
    previousCursor,
}: VisitPaginationProps) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    if (totalPages <= 1) {
        return null;
    }

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

    const previousPageUrl = previousCursor
        ? createVisitPageUrl({ before: previousCursor, page: currentPage - 1 })
        : undefined;
    const nextPageUrl = nextCursor
        ? createVisitPageUrl({ after: nextCursor, page: currentPage + 1 })
        : undefined;

    return (
        <nav className="join my-4 w-full justify-center lg:my-8" aria-label="Stránkování návštěv">
            {hasPreviousPage && previousPageUrl ? (
                <Link
                    href={previousPageUrl}
                    aria-disabled={isPending}
                    className="join-item btn btn-sm sm:btn-md"
                    aria-label="Předchozí stránka"
                    title="Předchozí stránka"
                    onClick={(event) => handleNavigation(event, previousPageUrl)}
                >
                    {isPending ? (
                        <span className="loading loading-spinner loading-sm" />
                    ) : (
                        <ChevronLeft />
                    )}
                </Link>
            ) : (
                <span className="join-item btn btn-sm btn-disabled sm:btn-md">
                    <ChevronLeft />
                </span>
            )}
            <span className="join-item btn btn-sm pointer-events-none sm:btn-md" aria-live="polite">
                {isPending ? "Načítám..." : `Strana ${currentPage}/${totalPages}`}
            </span>
            {hasNextPage && nextPageUrl ? (
                <Link
                    href={nextPageUrl}
                    aria-disabled={isPending}
                    className="join-item btn btn-sm sm:btn-md"
                    aria-label="Další stránka"
                    title="Další stránka"
                    onClick={(event) => handleNavigation(event, nextPageUrl)}
                >
                    {isPending ? (
                        <span className="loading loading-spinner loading-sm" />
                    ) : (
                        <ChevronRight />
                    )}
                </Link>
            ) : (
                <span className="join-item btn btn-sm btn-disabled sm:btn-md">
                    <ChevronRight />
                </span>
            )}
        </nav>
    );
};

export default VisitPagination;
