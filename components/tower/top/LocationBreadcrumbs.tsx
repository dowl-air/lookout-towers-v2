import Link from "next/link";

import { Tower } from "@/types/Tower";
import {
    formatCountryName,
    formatCountyName,
    getAllCountryProvinces,
    getCountryByName,
    getCountryByValue,
    getProvinceByValue,
} from "@/utils/geography";

function LocationBreadcrumbs({ tower }: { tower: Tower }) {
    let country = getCountryByValue(tower.country);
    if (!country) {
        country = getCountryByName("Czechia");
    }

    let province = getProvinceByValue(country.code, tower.province);
    if (!province) {
        const defaultProvinces = getAllCountryProvinces(country.code);
        if (defaultProvinces.length > 0) {
            province = defaultProvinces[0];
        } else {
            province = {
                name: "Unknown Province",
                shortName: "unknown",
                code: "unknown",
                counties: [],
            };
        }
    }
    const countyLabel = formatCountyName(tower.county);

    return (
        <div className="flex max-w-[94vw] justify-center lg:justify-start prose prose-sm lg:prose-xl text-md lg:text-sm breadcrumbs self-start">
            <ul className="flex pl-0! overflow-x-auto">
                <li>
                    <Link href={{ pathname: "/rozhledny", query: { country: country.code } }}>
                        {formatCountryName(country.code)}
                    </Link>
                </li>
                <li>
                    <Link
                        href={{
                            pathname: "/rozhledny",
                            query: { country: country.code, province: province.code },
                        }}
                    >
                        {province.name}
                    </Link>
                </li>
                <li>
                    <Link
                        href={{
                            pathname: "/rozhledny",
                            query: {
                                country: country.code,
                                province: province.code,
                                county: tower.county,
                            },
                        }}
                    >
                        {countyLabel}
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default LocationBreadcrumbs;
