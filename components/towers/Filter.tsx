"use client";

import FilterDialog from "@/components/towers/FilterDialog";
import { CountryCode } from "@/constants/countries";
import PROVINCES_CZ from "@/constants/provinces/CZ";
import useLocation from "@/hooks/useLocation";
import { cn } from "@/utils/cn";
import { getAllCountiesFromCountry, getAllCountiesFromCountryProvince, getAllCountryProvinces, getProvinceByCounty } from "@/utils/geography";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

const Filter = () => {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();
    const { location } = useLocation();
    const dialogRef = useRef<HTMLDialogElement>(null);

    const defaultCountry = (searchParams.get("country") as CountryCode) ?? "CZ";
    const defaultProvince = searchParams.get("province") ?? "ALL";
    const defaultCounty = searchParams.get("county") ?? "ALL";
    const defaultSearchTerm = searchParams.get("query") ?? "";
    const defaultSort = searchParams.get("sort") ?? "name";

    //TODO refactor to support multiple countries

    let selectableCounties = getAllCountiesFromCountry(defaultCountry);
    if (defaultProvince === PROVINCES_CZ[0].code) {
        // Prague doesnt have counties
        selectableCounties = [];
    } else if (defaultProvince !== "ALL") {
        // Filter counties by selected province
        selectableCounties = getAllCountiesFromCountryProvince(defaultCountry, defaultProvince);
    }

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("query", term);
            params.delete("page");
        } else {
            params.delete("query");
        }
        replace(`${pathname}?${params.toString()}`);
    }, 400);

    const handleProvince = (provinceCode: string) => {
        const params = new URLSearchParams(searchParams);
        if (provinceCode !== "ALL") {
            params.set("province", provinceCode);
            params.delete("page");
            params.delete("county");
        } else {
            params.delete("province");
            params.delete("county");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const handleSort = (sort: string) => {
        document.getElementById("buttons-block").focus();
        const params = new URLSearchParams(searchParams);
        if (sort === "distance") {
            params.set("location", `${location.latitude},${location.longitude}`);
            params.set("sort", sort);
        } else {
            params.delete("location");
            params.delete("sort");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const handleCounty = (county: string) => {
        const params = new URLSearchParams(searchParams);
        if (county !== "ALL") {
            params.set("county", county);
            params.set("province", getProvinceByCounty(defaultCountry, county).code);
            params.delete("page");
        } else {
            params.delete("county");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const openModal = () => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
    };

    const closeModal = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
    };

    return (
        <div className="card card-compact md:card-normal w-full shadow-xl">
            <div className="card-body">
                <div className="flex flex-nowrap gap-3 items-start justify-between">
                    <div className="flex gap-3 flex-wrap justify-center">
                        <label className="">
                            <div className="label">
                                <span className="label-text">Podrobné hledání</span>
                            </div>
                            <div className="input input-bordered grow flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                                    <path
                                        fillRule="evenodd"
                                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <input
                                    type="text"
                                    className="text-primary"
                                    defaultValue={defaultSearchTerm}
                                    placeholder="Vyhledat rozhlednu"
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                        </label>

                        <div className="flex gap-3 flex-nowrap" id="buttons-block">
                            <button className="btn self-end btn-sm sm:btn-md" onClick={openModal}>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                </svg>
                                Filtrování
                            </button>

                            <div className="dropdown self-end">
                                <div tabIndex={0} role="button" className="btn btn-sm sm:btn-md flex-nowrap">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="m3 16 4 4 4-4" />
                                        <path d="M7 20V4" />
                                        <path d="M11 4h10" />
                                        <path d="M11 8h7" />
                                        <path d="M11 12h4" />
                                    </svg>
                                    <span className="whitespace-nowrap">Dle {defaultSort === "distance" ? "vzdálenosti" : "názvu"}</span>
                                </div>
                                <div tabIndex={0} className="menu dropdown-content bg-base-100 rounded-box z-[1] w-44 p-2 shadow">
                                    <li onClick={() => handleSort("name")}>
                                        <a>Podle názvu</a>
                                    </li>
                                    {location !== null ? (
                                        <li onClick={() => handleSort("distance")}>
                                            <a>Podle vzdálenosti</a>
                                        </li>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        <FilterDialog ref={dialogRef} closeDialog={closeModal} />
                    </div>

                    <div className="hidden gap-3 min-[1111px]:flex">
                        <label>
                            <div className="label">
                                <span className="label-text">Kraj</span>
                            </div>
                            <select
                                className={cn("select select-bordered w-full", {
                                    "text-primary": defaultProvince !== "ALL",
                                })}
                                value={defaultProvince}
                                onChange={(e) => handleProvince(e.target.value)}
                            >
                                <option value="ALL">Všechny kraje</option>
                                {getAllCountryProvinces("CZ").map((item, idx) => (
                                    <option key={idx} value={item.code}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            <div className="label">
                                <span className="label-text">Okres</span>
                            </div>
                            <select
                                className={cn("select select-bordered w-full", {
                                    "text-primary": defaultCounty !== "ALL",
                                })}
                                value={defaultCounty}
                                onChange={(e) => handleCounty(e.target.value)}
                            >
                                <option value="ALL">Všechny okresy</option>
                                {selectableCounties.map((item, idx) => (
                                    <option key={idx} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filter;
