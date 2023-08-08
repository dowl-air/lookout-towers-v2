import { Tower } from "@/typings";
import React from "react";

type Props = {
    tower: Tower;
};

function LocationBreadcrumbs({ tower }: Props) {
    return (
        <div className="flex max-w-[94vw] justify-center lg:justify-start prose prose-sm lg:prose-xl text-md lg:text-sm breadcrumbs">
            <ul className="flex !pl-0 overflow-x-auto">
                <li>
                    <a className="link" href="/rozhledny">
                        {tower.country}
                    </a>
                </li>
                <li>
                    <a className="link" href="/rozhledny">
                        {tower.province}
                    </a>
                </li>
                <li>
                    <a className="link" href="/rozhledny">
                        {tower.county}
                    </a>
                </li>
            </ul>
        </div>
    );
}

export default LocationBreadcrumbs;
