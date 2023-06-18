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
        </div>
    );
}

export default LocationBreadcrumbs;
