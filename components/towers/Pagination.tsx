import Link from "next/link";
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

    return (
        <div className="join my-4 lg:my-8 w-full justify-center">
            <Link
                href={createPageURL(currentPage === 1 ? 1 : currentPage - 1)}
                className="join-item btn btn-sm sm:btn-md"
            >
                «
            </Link>
            <button className="join-item btn btn-sm sm:btn-md">
                Strana {currentPage}/{totalPages}
            </button>
            <Link
                href={createPageURL(currentPage === totalPages ? totalPages : currentPage + 1)}
                className="join-item btn btn-sm sm:btn-md"
            >
                »
            </Link>
        </div>
    );
};

export default Pagination;
