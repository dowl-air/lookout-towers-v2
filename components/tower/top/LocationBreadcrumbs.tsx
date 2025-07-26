import { Tower } from "@/types/Tower";
import {
    getAllCountryProvinces,
    getCountryByCode,
    getCountryByName,
    getProvinceByCode,
    getProvinceByName,
    isValidCountryCode,
    isValidProvinceCode,
} from "@/utils/geography";
import Link from "next/link";

function LocationBreadcrumbs({ tower }: { tower: Tower }) {
    let country = isValidCountryCode(tower.country) ? getCountryByCode(tower.country) : getCountryByName(tower.country);
    if (!country) {
        country = getCountryByName("Czechia");
    }

    let province = isValidProvinceCode(country.code, tower.province)
        ? getProvinceByCode(country.code, tower.province)
        : getProvinceByName(country.code, tower.province);
    if (!province) {
        const defaultProvinces = getAllCountryProvinces(country.code);
        if (defaultProvinces.length > 0) {
            province = defaultProvinces[0];
        } else {
            province = { name: "Unknown Province", shortName: "unknown", code: "unknown", counties: [] };
        }
    }

    return (
        <div className="flex max-w-[94vw] justify-center lg:justify-start prose prose-sm lg:prose-xl text-md lg:text-sm breadcrumbs self-start">
            <ul className="flex pl-0! overflow-x-auto">
                <li>
                    <Link href={{ pathname: "/rozhledny", query: { country: country.code } }}>{country.name}</Link>
                </li>
                <li>
                    <Link href={{ pathname: "/rozhledny", query: { country: country.code, province: province.code } }}>{province.name}</Link>
                </li>
                <li>
                    <Link href={{ pathname: "/rozhledny", query: { country: country.code, province: province.code, county: tower.county } }}>
                        {tower.county}
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default LocationBreadcrumbs;
