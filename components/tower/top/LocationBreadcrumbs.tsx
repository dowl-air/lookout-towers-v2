import Link from "next/link";

import { Tower } from "@/typings";

function LocationBreadcrumbs({ tower }: { tower: Tower }) {
    return (
        <div className="flex max-w-[94vw] justify-center lg:justify-start prose prose-sm lg:prose-xl text-md lg:text-sm breadcrumbs self-start">
            <ul className="flex !pl-0 overflow-x-auto">
                <li>
                    <Link href={{ pathname: "/rozhledny" }}>{tower.country}</Link>
                </li>
                <li>
                    <Link href={{ pathname: "/rozhledny", query: { province: tower.province } }}>{tower.province}</Link>
                </li>
                <li>
                    <Link href={{ pathname: "/rozhledny", query: { county: tower.county, province: tower.province } }}>{tower.county}</Link>
                </li>
            </ul>
        </div>
    );
}

export default LocationBreadcrumbs;
