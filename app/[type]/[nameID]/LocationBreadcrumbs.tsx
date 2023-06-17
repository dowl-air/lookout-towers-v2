import { Tower } from "@/typings";
import React from "react";

type Props = {
    tower: Tower;
};

function LocationBreadcrumbs({ tower }: Props) {
    return (
        <div>
            <div className="prose text-md lg:text-sm breadcrumbs">
                <ul className="pl-4">
                    <li>
                        <a className="link">{tower.country}</a>
                    </li>
                    <li>
                        <a className="link">{tower.province}</a>
                    </li>
                    <li>
                        <a className="link">{tower.county}</a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default LocationBreadcrumbs;
