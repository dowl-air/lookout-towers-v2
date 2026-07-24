"use client";

import {
    ArrowDownAZ,
    ChevronDown,
    ChevronUp,
    LocateFixed,
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

import COUNTRIES, { CountryCode } from "@/constants/countries";
import { MATERIALS } from "@/constants/materials";
import PROVINCES_CZ from "@/constants/provinces/CZ";
import { towerTypes } from "@/constants/towerType";
import useLocation from "@/hooks/useLocation";
import { AdmissionType } from "@/types/Admission";
import { OpeningHoursType } from "@/types/OpeningHours";
import { TowersSearchParams } from "@/types/TowersSearchParams";
import { TowerTag } from "@/types/TowerTags";
import { cn } from "@/utils/cn";
import {
    getAllCountiesFromCountry,
    getAllCountiesFromCountryProvince,
    getAllCountryProvinces,
    getProvinceByCounty,
    isValidCountryCode,
} from "@/utils/geography";

type FilterOption = {
    label: string;
    value: string;
};

const OPENING_OPTIONS: FilterOption[] = [
    { label: "Volně přístupné", value: String(OpeningHoursType.NonStop) },
    { label: "Celoročně", value: String(OpeningHoursType.EveryMonth) },
    { label: "Sezónně", value: String(OpeningHoursType.SomeMonths) },
    { label: "Příležitostně", value: String(OpeningHoursType.Occasionally) },
    { label: "Uzavřeno", value: String(OpeningHoursType.Forbidden) },
];

const ADMISSION_OPTIONS: FilterOption[] = [
    { label: "Zdarma", value: AdmissionType.FREE },
    { label: "Dobrovolné", value: AdmissionType.DONATION },
    { label: "Placené", value: AdmissionType.PAID },
];

const TAG_OPTIONS: FilterOption[] = [
    { label: "Parkování", value: TowerTag.HasParking },
    { label: "Cyklisté", value: TowerTag.SuitableForCyclists },
    { label: "Restaurace", value: TowerTag.HasRestaurant },
    { label: "Občerstvení", value: TowerTag.HasSnacks },
    { label: "WC", value: TowerTag.HasToilet },
    { label: "Dalekohled", value: TowerTag.HasTelescope },
];

const SORT_OPTIONS: FilterOption[] = [
    { label: "Název A-Z", value: "name" },
    { label: "Název Z-A", value: "name_desc" },
    { label: "Nejblíže", value: "distance" },
    { label: "Nejvyšší rozhledna", value: "height_desc" },
    { label: "Nejvyšší plošina", value: "view_height_desc" },
    { label: "Nejvíce schodů", value: "stairs_desc" },
    { label: "Nejvyšší nadmořská výška", value: "elevation_desc" },
    { label: "Nejnovější otevřené", value: "opened_desc" },
    { label: "Nejstarší", value: "opened_asc" },
];

const HEIGHT_OPTIONS: FilterOption[] = [
    { label: "0-20 m", value: "0:20" },
    { label: "20-40 m", value: "20:40" },
    { label: "40-60 m", value: "40:60" },
    { label: "60+ m", value: "60:" },
];

const QUICK_ADMISSION_FILTERS = [AdmissionType.FREE];
const QUICK_OPENING_FILTERS = [String(OpeningHoursType.NonStop)];
const QUICK_TAG_FILTERS = [TowerTag.HasParking, TowerTag.SuitableForCyclists];

const toParamArray = (value?: string | string[]): string[] => {
    if (!value) return [];
    return Array.isArray(value) ? value.filter(Boolean) : [value].filter(Boolean);
};

const getParamValue = (value?: number | string | string[]): string => {
    if (Array.isArray(value)) return value[0] || "";
    return value ? String(value) : "";
};

const appendValues = (params: URLSearchParams, key: string, values: string[]) => {
    values.forEach((value) => {
        if (value) params.append(key, value);
    });
};

const toggleValue = (values: string[], value: string): string[] => {
    return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
};

const getInitialCountry = (searchParams: TowersSearchParams): CountryCode | "ALL" => {
    if (isValidCountryCode(searchParams.country || "")) return searchParams.country as CountryCode;
    if (searchParams.province || searchParams.county) return "CZ";
    return "ALL";
};

const getHeightOptionValue = (minHeight: string, maxHeight: string): string => {
    if (!minHeight && !maxHeight) return "";
    return `${minHeight}:${maxHeight}`;
};

const hasOnlyQuickValues = (values: string[], quickValues: string[]): boolean => {
    return values.every((value) => quickValues.includes(value));
};

const hasAdvancedOnlyFilters = (searchParams: TowersSearchParams): boolean => {
    if (
        searchParams.country ||
        searchParams.province ||
        searchParams.county ||
        searchParams.distance ||
        searchParams.type ||
        searchParams.material ||
        searchParams.minHeight ||
        searchParams.maxHeight
    ) {
        return true;
    }

    const admissionFilters = toParamArray(searchParams.admission);
    if (
        admissionFilters.length > 0 &&
        !hasOnlyQuickValues(admissionFilters, QUICK_ADMISSION_FILTERS)
    ) {
        return true;
    }

    const openingFilters = toParamArray(searchParams.opening);
    if (openingFilters.length > 0 && !hasOnlyQuickValues(openingFilters, QUICK_OPENING_FILTERS)) {
        return true;
    }

    const tagFilters = toParamArray(searchParams.tag);
    if (tagFilters.length > 0 && !hasOnlyQuickValues(tagFilters, QUICK_TAG_FILTERS)) {
        return true;
    }

    return false;
};

const EMPTY_FILTER_STATE = {
    country: "ALL" as const,
    county: "ALL",
    distance: "",
    heightRange: "",
    locationValue: "",
    province: "ALL",
    query: "",
    sort: "name",
};

const ChipCheckbox = ({
    checked,
    disabled = false,
    label,
    onChange,
}: {
    checked: boolean;
    disabled?: boolean;
    label: string;
    onChange: () => Promise<void> | void;
}) => (
    <button
        type="button"
        disabled={disabled}
        className={cn("btn btn-xs sm:btn-sm rounded-full", {
            "btn-primary": checked,
            "btn-outline": !checked,
        })}
        onClick={onChange}
    >
        {label}
    </button>
);

const CheckboxGroup = ({
    columns = false,
    options,
    values,
    onChange,
}: {
    columns?: boolean;
    options: FilterOption[];
    values: string[];
    onChange: (values: string[]) => void;
}) => (
    <div className={cn("grid gap-2", columns ? "sm:grid-cols-2" : "")}>
        {options.map((option) => (
            <label key={option.value} className="label cursor-pointer justify-start gap-2 py-1">
                <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={values.includes(option.value)}
                    onChange={() => onChange(toggleValue(values, option.value))}
                />
                <span className="label-text">{option.label}</span>
            </label>
        ))}
    </div>
);

const Filter = ({ searchParams }: { searchParams: TowersSearchParams }) => {
    const { replace } = useRouter();
    const pathname = usePathname();
    const { isLocating, location, permissionState, requestLocation } = useLocation();

    const [query, setQuery] = useState(getParamValue(searchParams.query));
    const [country, setCountry] = useState<CountryCode | "ALL">(() =>
        getInitialCountry(searchParams)
    );
    const [province, setProvince] = useState(searchParams.province ?? "ALL");
    const [county, setCounty] = useState(searchParams.county ?? "ALL");
    const [sort, setSort] = useState(searchParams.sort ?? "name");
    const [locationValue, setLocationValue] = useState(searchParams.location ?? "");
    const [distance, setDistance] = useState(searchParams.distance ?? "");
    const [selectedTypes, setSelectedTypes] = useState(toParamArray(searchParams.type));
    const [selectedOpenings, setSelectedOpenings] = useState(toParamArray(searchParams.opening));
    const [selectedAdmissions, setSelectedAdmissions] = useState(
        toParamArray(searchParams.admission)
    );
    const [selectedMaterials, setSelectedMaterials] = useState(toParamArray(searchParams.material));
    const [selectedTags, setSelectedTags] = useState(toParamArray(searchParams.tag));
    const [heightRange, setHeightRange] = useState(
        getHeightOptionValue(searchParams.minHeight ?? "", searchParams.maxHeight ?? "")
    );
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(() =>
        hasAdvancedOnlyFilters(searchParams)
    );

    useEffect(() => {
        setQuery(getParamValue(searchParams.query));
        setCountry(getInitialCountry(searchParams));
        setProvince(searchParams.province ?? "ALL");
        setCounty(searchParams.county ?? "ALL");
        setSort(searchParams.sort ?? "name");
        setLocationValue(searchParams.location ?? "");
        setDistance(searchParams.distance ?? "");
        setSelectedTypes(toParamArray(searchParams.type));
        setSelectedOpenings(toParamArray(searchParams.opening));
        setSelectedAdmissions(toParamArray(searchParams.admission));
        setSelectedMaterials(toParamArray(searchParams.material));
        setSelectedTags(toParamArray(searchParams.tag));
        setHeightRange(
            getHeightOptionValue(searchParams.minHeight ?? "", searchParams.maxHeight ?? "")
        );
        setShowAdvancedFilters(hasAdvancedOnlyFilters(searchParams));
    }, [searchParams]);

    const countryForLists: CountryCode = country === "ALL" ? "CZ" : country;
    const selectableProvinces = useMemo(() => {
        if (country === "ALL") return [];
        return getAllCountryProvinces(countryForLists);
    }, [country, countryForLists]);

    const selectableCounties = useMemo(() => {
        if (country === "ALL") return [];
        if (province === PROVINCES_CZ[0].code) return [];
        if (province !== "ALL") return getAllCountiesFromCountryProvince(countryForLists, province);
        return getAllCountiesFromCountry(countryForLists);
    }, [country, countryForLists, province]);

    const currentLocationValue =
        locationValue || (location ? `${location.latitude},${location.longitude}` : "");
    const isLocationUnavailable = permissionState === "denied" || permissionState === "unsupported";
    const canSortByDistance = Boolean(currentLocationValue);
    const isDistanceActive = Boolean(distance && currentLocationValue);

    const handleCountry = (countryCode: CountryCode | "ALL") => {
        setCountry(countryCode);
        setProvince("ALL");
        setCounty("ALL");
    };

    const handleProvince = (provinceCode: string) => {
        setProvince(provinceCode);
        setCounty("ALL");
    };

    const handleCounty = (nextCounty: string) => {
        setCounty(nextCounty);

        if (nextCounty === "ALL" || country === "ALL") return;

        const matchingProvince = getProvinceByCounty(countryForLists, nextCounty);
        if (matchingProvince) setProvince(matchingProvince.code);
    };

    const ensureLocation = async (): Promise<string | null> => {
        if (currentLocationValue) return currentLocationValue;
        if (isLocationUnavailable) return null;

        const nextLocation = await requestLocation().catch(() => null);
        if (!nextLocation) return null;

        const nextLocationValue = `${nextLocation.latitude},${nextLocation.longitude}`;
        setLocationValue(nextLocationValue);

        return nextLocationValue;
    };

    const handleCurrentLocation = async () => {
        const nextLocationValue = await ensureLocation();
        if (!nextLocationValue) return;

        setDistance((currentDistance) => currentDistance || "20");
    };

    const handleDistance = async (nextDistance: string) => {
        if (!nextDistance) {
            setDistance("");
            return;
        }

        const nextLocationValue = await ensureLocation();
        if (!nextLocationValue) {
            setDistance("");
            return;
        }

        setDistance(nextDistance);
    };

    const handleSort = async (nextSort: string) => {
        if (nextSort !== "distance") {
            setSort(nextSort);
            return;
        }

        const nextLocationValue = await ensureLocation();
        setSort(nextLocationValue ? "distance" : "name");
    };

    const handleNearestChip = async () => {
        if (sort === "distance") {
            setSort("name");
            return;
        }

        const nextLocationValue = await ensureLocation();
        if (nextLocationValue) setSort("distance");
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const params = new URLSearchParams();
        if (query.trim()) params.set("query", query.trim());
        if (country !== "ALL") params.set("country", country);
        if (province !== "ALL") params.set("province", province);
        if (county !== "ALL") params.set("county", county);
        if (sort !== "name" && (sort !== "distance" || canSortByDistance)) params.set("sort", sort);
        if ((distance || sort === "distance") && currentLocationValue) {
            params.set("location", currentLocationValue);
        }
        if (distance && currentLocationValue) params.set("distance", distance);

        appendValues(params, "type", selectedTypes);
        appendValues(params, "opening", selectedOpenings);
        appendValues(params, "admission", selectedAdmissions);
        appendValues(params, "material", selectedMaterials);
        appendValues(params, "tag", selectedTags);

        const [minHeight, maxHeight] = heightRange.split(":");
        if (minHeight) params.set("minHeight", minHeight);
        if (maxHeight) params.set("maxHeight", maxHeight);

        const queryString = params.toString();
        replace(queryString ? `${pathname}?${queryString}` : pathname);
    };

    const handleReset = () => {
        setQuery(EMPTY_FILTER_STATE.query);
        setCountry(EMPTY_FILTER_STATE.country);
        setProvince(EMPTY_FILTER_STATE.province);
        setCounty(EMPTY_FILTER_STATE.county);
        setSort(EMPTY_FILTER_STATE.sort);
        setLocationValue(EMPTY_FILTER_STATE.locationValue);
        setDistance(EMPTY_FILTER_STATE.distance);
        setSelectedTypes([]);
        setSelectedOpenings([]);
        setSelectedAdmissions([]);
        setSelectedMaterials([]);
        setSelectedTags([]);
        setHeightRange(EMPTY_FILTER_STATE.heightRange);
        setShowAdvancedFilters(false);
        replace(pathname);
    };

    return (
        <form className="card card-compact md:card-normal w-full shadow-xl" onSubmit={handleSubmit}>
            <div className="card-body gap-5">
                <div className="grid gap-3 lg:grid-cols-[minmax(16rem,1.4fr)_minmax(12rem,0.8fr)_auto] lg:items-end">
                    <label>
                        <div className="label">
                            <span className="label-text">Podrobné hledání</span>
                        </div>
                        <div className="input input-bordered flex items-center gap-2">
                            <Search className="h-4 w-4 opacity-70" aria-hidden="true" />
                            <input
                                type="text"
                                className="min-w-0 grow"
                                value={query}
                                placeholder="Vyhledat rozhlednu"
                                onChange={(event) => setQuery(event.target.value)}
                            />
                        </div>
                    </label>

                    <label>
                        <div className="label">
                            <span className="label-text">Řazení</span>
                        </div>
                        <div className="select select-bordered flex items-center gap-2">
                            <ArrowDownAZ className="h-4 w-4 opacity-70" aria-hidden="true" />
                            <select
                                className="min-w-0 grow"
                                value={sort}
                                onChange={(event) => handleSort(event.target.value)}
                            >
                                {SORT_OPTIONS.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                        disabled={
                                            option.value === "distance" && isLocationUnavailable
                                        }
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </label>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                        <button className="btn btn-primary" type="submit">
                            <Search className="h-4 w-4" aria-hidden="true" />
                            Vyhledat
                        </button>
                        <button className="btn btn-ghost" type="button" onClick={handleReset}>
                            <X className="h-4 w-4" aria-hidden="true" />
                            Vyčistit
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <ChipCheckbox
                        checked={sort === "distance"}
                        disabled={isLocationUnavailable || isLocating}
                        label="Nejblíž"
                        onChange={handleNearestChip}
                    />
                    <ChipCheckbox
                        checked={selectedAdmissions.includes(AdmissionType.FREE)}
                        label="Zdarma"
                        onChange={() =>
                            setSelectedAdmissions(
                                toggleValue(selectedAdmissions, AdmissionType.FREE)
                            )
                        }
                    />
                    <ChipCheckbox
                        checked={selectedTags.includes(TowerTag.SuitableForCyclists)}
                        label="Cyklisté"
                        onChange={() =>
                            setSelectedTags(toggleValue(selectedTags, TowerTag.SuitableForCyclists))
                        }
                    />
                    <ChipCheckbox
                        checked={selectedTags.includes(TowerTag.HasParking)}
                        label="Parkování"
                        onChange={() =>
                            setSelectedTags(toggleValue(selectedTags, TowerTag.HasParking))
                        }
                    />
                    <ChipCheckbox
                        checked={selectedOpenings.includes(String(OpeningHoursType.NonStop))}
                        label="Volně přístupné"
                        onChange={() =>
                            setSelectedOpenings(
                                toggleValue(selectedOpenings, String(OpeningHoursType.NonStop))
                            )
                        }
                    />
                </div>

                <div>
                    <button
                        className="btn btn-outline btn-sm"
                        type="button"
                        aria-expanded={showAdvancedFilters}
                        onClick={() => setShowAdvancedFilters((isShown) => !isShown)}
                    >
                        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                        Rozšířené filtry
                        {showAdvancedFilters ? (
                            <ChevronUp className="h-4 w-4" aria-hidden="true" />
                        ) : (
                            <ChevronDown className="h-4 w-4" aria-hidden="true" />
                        )}
                    </button>
                </div>

                {showAdvancedFilters ? (
                    <div className="grid gap-5">
                        <div className="grid gap-4 lg:grid-cols-4">
                            <label>
                                <div className="label">
                                    <span className="label-text">Stát</span>
                                </div>
                                <select
                                    className={cn("select select-bordered w-full", {
                                        "text-primary": country !== "ALL",
                                    })}
                                    value={country}
                                    onChange={(event) =>
                                        handleCountry(event.target.value as CountryCode | "ALL")
                                    }
                                >
                                    <option value="ALL">Všechny země</option>
                                    {COUNTRIES.map((item) => (
                                        <option key={item.code} value={item.code}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <div className="label">
                                    <span className="label-text">Kraj</span>
                                </div>
                                <select
                                    className={cn("select select-bordered w-full", {
                                        "text-primary": province !== "ALL",
                                    })}
                                    disabled={country === "ALL"}
                                    value={province}
                                    onChange={(event) => handleProvince(event.target.value)}
                                >
                                    <option value="ALL">Všechny kraje</option>
                                    {selectableProvinces.map((item) => (
                                        <option key={item.code} value={item.code}>
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
                                        "text-primary": county !== "ALL",
                                    })}
                                    disabled={country === "ALL"}
                                    value={county}
                                    onChange={(event) => handleCounty(event.target.value)}
                                >
                                    <option value="ALL">Všechny okresy</option>
                                    {selectableCounties.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <div className="label">
                                    <span className="label-text">Okruh od polohy</span>
                                </div>
                                <div className="join w-full">
                                    <select
                                        className={cn("select select-bordered join-item w-full", {
                                            "text-primary": isDistanceActive,
                                        })}
                                        disabled={isLocationUnavailable || isLocating}
                                        value={distance}
                                        onChange={(event) => handleDistance(event.target.value)}
                                    >
                                        <option value="">Bez okruhu</option>
                                        <option value="5">5 km</option>
                                        <option value="10">10 km</option>
                                        <option value="20">20 km</option>
                                        <option value="50">50 km</option>
                                        <option value="100">100 km</option>
                                    </select>
                                    <button
                                        className="btn join-item"
                                        type="button"
                                        disabled={isLocationUnavailable || isLocating}
                                        onClick={handleCurrentLocation}
                                    >
                                        <LocateFixed className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                </div>
                            </label>
                        </div>

                        <div className="grid gap-5 lg:grid-cols-4">
                            <fieldset>
                                <legend className="label-text mb-2 font-semibold">Typ</legend>
                                <CheckboxGroup
                                    options={towerTypes.map((towerType) => ({
                                        label: towerType.name,
                                        value: towerType.value,
                                    }))}
                                    values={selectedTypes}
                                    onChange={setSelectedTypes}
                                />
                            </fieldset>

                            <fieldset>
                                <legend className="label-text mb-2 font-semibold">
                                    Otevřenost
                                </legend>
                                <CheckboxGroup
                                    options={OPENING_OPTIONS}
                                    values={selectedOpenings}
                                    onChange={setSelectedOpenings}
                                />
                            </fieldset>

                            <fieldset className="grid gap-4 content-start">
                                <div>
                                    <legend className="label-text mb-2 font-semibold">
                                        Vstupné
                                    </legend>
                                    <CheckboxGroup
                                        options={ADMISSION_OPTIONS}
                                        values={selectedAdmissions}
                                        onChange={setSelectedAdmissions}
                                    />
                                </div>

                                <label>
                                    <div className="label px-0">
                                        <span className="label-text font-semibold">
                                            Výška rozhledny
                                        </span>
                                    </div>
                                    <select
                                        className={cn("select select-bordered w-full", {
                                            "text-primary": heightRange,
                                        })}
                                        value={heightRange}
                                        onChange={(event) => setHeightRange(event.target.value)}
                                    >
                                        <option value="">Libovolná</option>
                                        {HEIGHT_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </fieldset>

                            <fieldset className="grid gap-4 content-start">
                                <div>
                                    <legend className="label-text mb-2 font-semibold">
                                        Materiál
                                    </legend>
                                    <CheckboxGroup
                                        options={MATERIALS.map((material) => ({
                                            label: material,
                                            value: material,
                                        }))}
                                        values={selectedMaterials}
                                        onChange={setSelectedMaterials}
                                    />
                                </div>

                                <div>
                                    <legend className="label-text mb-2 font-semibold">
                                        Vybavení
                                    </legend>
                                    <CheckboxGroup
                                        columns
                                        options={TAG_OPTIONS}
                                        values={selectedTags}
                                        onChange={setSelectedTags}
                                    />
                                </div>
                            </fieldset>
                        </div>

                        <div className="flex gap-2 sm:hidden">
                            <button className="btn btn-primary flex-1" type="submit">
                                <Search className="h-4 w-4" aria-hidden="true" />
                                Vyhledat
                            </button>
                            <button
                                className="btn btn-ghost flex-1"
                                type="button"
                                onClick={handleReset}
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                                Vyčistit
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </form>
    );
};

export default Filter;
