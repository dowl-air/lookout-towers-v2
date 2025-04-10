import { CountryCode } from "@/constants/countries";
import { Tower } from "@/types/Tower";
import { getCountryByName, getProvinceByName, isValidCountryCode, isValidProvinceCode } from "@/utils/geography";
import Link from "next/link";

function LocationBreadcrumbs({ tower }: { tower: Tower }) {
    let countryCode: CountryCode = tower.country as CountryCode;
    let provinceCode = tower.province;
    if (!isValidCountryCode(countryCode)) {
        countryCode = getCountryByName(tower.country)?.code || "CZ";
    }
    if (!isValidProvinceCode(countryCode, provinceCode)) {
        provinceCode = getProvinceByName(countryCode, tower.province)?.code || "PR";
    }

    return (
        <div className="flex max-w-[94vw] justify-center lg:justify-start prose prose-sm lg:prose-xl text-md lg:text-sm breadcrumbs self-start">
            <ul className="flex pl-0! overflow-x-auto">
                <li>
                    <Link href={{ pathname: "/rozhledny" }}>{tower.country}</Link>
                </li>
                <li>
                    <Link href={{ pathname: "/rozhledny", query: { province: provinceCode } }}>{tower.province}</Link>
                </li>
                <li>
                    <Link href={{ pathname: "/rozhledny", query: { county: tower.county, province: provinceCode } }}>{tower.county}</Link>
                </li>
            </ul>
        </div>
    );
}

export default LocationBreadcrumbs;
