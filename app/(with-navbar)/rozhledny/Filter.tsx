"use client";
import { Filter } from "@/typings";
import { countyShortList, provincesList, provincesMappedCounty } from "@/utils/constants";
import React, { useEffect, useState } from "react";

type ComponentProps = {
    applyFilter: Function;
    initFilter: Filter;
};

const emptyFilter: Filter = {
    searchTerm: "",
    province: "",
    county: "",
};

function Filter_({ applyFilter, initFilter }: ComponentProps) {
    const createFilterObject = (): Filter => {
        return {
            searchTerm: searchTerm,
            province: provinceSelected === "Všechny kraje" ? "" : provinceSelected,
            county: countySelected === "Všechny okresy" ? "" : countySelected,
        };
    };

    const removeFilter = () => {
        setCountySelected("Všechny okresy");
        setProvinceSelected("Všechny kraje");
        setSearchTerm("");
        setCountySelectable(countyShortList);
    };

    const [searchTerm, setSearchTerm] = useState<string>(initFilter.searchTerm);
    const [provinceSelected, setProvinceSelected] = useState<string>(initFilter.province);
    const [countySelected, setCountySelected] = useState<string>(initFilter.county);
    const [countySelectable, setCountySelectable] = useState<string[]>(countyShortList);

    // province and county management
    useEffect(() => {
        if (
            provinceSelected !== "Všechny kraje" &&
            !countyShortList.filter((elm) => provincesMappedCounty[elm] === provinceSelected).includes(countySelected)
        ) {
            setCountySelected("Všechny okresy");
        }

        if (provinceSelected !== "Všechny kraje")
            setCountySelectable(countyShortList.filter((elm) => provincesMappedCounty[elm] === provinceSelected));

        if (provinceSelected === "Hlavní město Praha") setCountySelected("Praha");

        if (provinceSelected === "Všechny kraje") setCountySelectable(countyShortList);

        if (provinceSelected === "Všechny kraje" && countySelected !== "Všechny okresy") {
            setProvinceSelected(provincesMappedCounty[countySelected]);
        }
    }, [provinceSelected, countySelected]);

    useEffect(() => {
        applyFilter({
            searchTerm: searchTerm,
            province: provinceSelected === "Všechny kraje" ? "" : provinceSelected,
            county: countySelected === "Všechny okresy" ? "" : countySelected,
        });
    }, [searchTerm, provinceSelected, countySelected, applyFilter]);

    return (
        <div className="card card-compact sm:card-normal sm:w-80 bg-base-100 shadow-xl">
            <div className="card-body">
                <div className="flex gap-2 justify-between items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-6 w-6 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <input
                        placeholder="Biskupská kupa..."
                        value={searchTerm}
                        className="input max-w-[220px] input-ghost input-bordered text-primary focus:text-primary focus:bg-transparent flex-grow"
                        onChange={(t) => setSearchTerm(t.target.value)}
                    ></input>
                </div>
                <select
                    className={`select select-bordered w-full max-w-[94vw] ${provinceSelected !== "Všechny kraje" && "text-primary"}`}
                    value={provinceSelected}
                    onChange={(e) => setProvinceSelected(e.target.value)}
                >
                    <option>Všechny kraje</option>
                    {provincesList.map((item, idx) => (
                        <option key={idx}>{item}</option>
                    ))}
                </select>
                <select
                    className={`select select-bordered w-full max-w-[94vw] ${countySelected !== "Všechny okresy" && "text-primary"}`}
                    value={countySelected}
                    onChange={(e) => setCountySelected(e.target.value)}
                >
                    <option>Všechny okresy</option>
                    {countySelectable.map((item, idx) => (
                        <option key={idx}>{item}</option>
                    ))}
                </select>
                <div className="card-actions justify-start mt-2">
                    {JSON.stringify(emptyFilter) !== JSON.stringify(createFilterObject()) && (
                        <button className="btn btn-error" onClick={() => removeFilter()}>
                            Vymazat filtry
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Filter_;
