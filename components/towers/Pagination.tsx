"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const Pagination = ({ totalPages }: { totalPages: number }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        if (pageNumber === 1) {
            params.delete("page");
        } else {
            params.set("page", pageNumber.toString());
        }
        return `${pathname}?${params.toString()}`;
    };

    return (
        <div className="join my-4 lg:my-8 w-full justify-center">
            <Link href={createPageURL(currentPage === 1 ? 1 : currentPage - 1)} className="join-item btn">
                «
            </Link>
            <button className="join-item btn">
                Strana {currentPage}/{totalPages}
            </button>
            <Link href={createPageURL(currentPage === totalPages ? totalPages : currentPage + 1)} className="join-item btn">
                »
            </Link>
        </div>
    );
};

export default Pagination;
