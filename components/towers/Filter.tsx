"use client";

import { cn } from "@/utils/cn";
import { countyShortList, provincesList, provincesMappedCounty } from "@/utils/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const Filter = () => {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    const defaultProvince = searchParams.get("province") || "Všechny kraje";
    const defaultCounty = searchParams.get("county") || "Všechny okresy";
    const defaultSearchTerm = searchParams.get("query") || "";

    let selectableCounties = countyShortList;
    if (defaultProvince === "Hlavní město Praha") {
        selectableCounties = ["Praha"];
    } else if (defaultProvince !== "Všechny kraje") {
        selectableCounties = countyShortList.filter((county) => provincesMappedCounty[county] === defaultProvince);
    } else {
        selectableCounties = countyShortList;
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

    const handleProvince = (province: string) => {
        const params = new URLSearchParams(searchParams);
        if (province !== "Všechny kraje") {
            params.set("province", province);
            params.delete("page");
            params.delete("county");
        } else {
            params.delete("province");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const handleCounty = (county: string) => {
        const params = new URLSearchParams(searchParams);
        if (county !== "Všechny okresy") {
            params.set("county", county);
            params.set("province", provincesMappedCounty[county]);
            params.delete("page");
        } else {
            params.delete("county");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="card w-full shadow-xl">
            <div className="card-body">
                <div className="flex flex-wrap gap-3 items-start justify-between">
                    <label className="w-full max-w-lg">
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
                    <div className="flex gap-3 w-full max-w-lg">
                        <label className="w-full">
                            <div className="label">
                                <span className="label-text">Kraj</span>
                            </div>
                            <select
                                className={cn("select select-bordered w-full", {
                                    "text-primary": defaultProvince !== "Všechny kraje",
                                })}
                                value={defaultProvince}
                                onChange={(e) => handleProvince(e.target.value)}
                            >
                                <option>Všechny kraje</option>
                                {provincesList.map((item, idx) => (
                                    <option key={idx} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="w-full">
                            <div className="label">
                                <span className="label-text">Okres</span>
                            </div>
                            <select
                                className={cn("select select-bordered w-full", {
                                    "text-primary": defaultCounty !== "Všechny okresy",
                                })}
                                value={defaultCounty}
                                onChange={(e) => handleCounty(e.target.value)}
                            >
                                <option>Všechny okresy</option>
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
