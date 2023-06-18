"use client";
import { Filter } from "@/typings";
import { countyShortList, provincesList, provincesMappedCounty } from "@/utils/constants";
import React, { useEffect, useState } from "react";

type ComponentProps = {
    applyFilter: Function;
    initFilter: Filter;
};

function Filter({ applyFilter, initFilter }: ComponentProps) {
    const createFilterObject = (): Filter => {
        return {
            searchTerm: searchTerm,
            province: provinceSelected === "Všechny kraje" ? "" : provinceSelected,
            county: countySelected === "Všechny okresy" ? "" : countySelected,
        };
    };

    const removeFilter = () => {
        setCountySelected("");
        setProvinceSelected("");
        setSearchTerm("");
        applyFilter(initFilter);
    };

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [provinceSelected, setProvinceSelected] = useState<string>("Všechny kraje");
    const [countySelected, setCountySelected] = useState<string>("Všechny okresy");
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

    return (
        <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
                <div className="flex gap-2 justify-between">
                    <input
                        placeholder="Vyhledat"
                        value={searchTerm}
                        className="input input-ghost input-bordered text-primary focus:text-primary rounded-full focus:bg-transparent flex-grow"
                        onChange={(t) => setSearchTerm(t.target.value)}
                    ></input>
                    <button
                        aria-label="button component"
                        className="btn btn-ghost mask mask-squircle btn-square focus:bg-base-content hidden border-none focus:bg-opacity-50 md:flex"
                        onClick={() => applyFilter(createFilterObject())}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-6 w-6 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </button>
                </div>
                <select
                    className="select select-bordered w-full max-w-xs"
                    value={provinceSelected}
                    onChange={(e) => setProvinceSelected(e.target.value)}
                >
                    <option>Všechny kraje</option>
                    {provincesList.map((item, idx) => (
                        <option key={idx}>{item}</option>
                    ))}
                </select>
                <select className="select select-bordered w-full max-w-xs" value={countySelected} onChange={(e) => setCountySelected(e.target.value)}>
                    <option>Všechny okresy</option>
                    {countySelectable.map((item, idx) => (
                        <option key={idx}>{item}</option>
                    ))}
                </select>
                <div className="card-actions justify-end">
                    {JSON.stringify(initFilter) !== JSON.stringify(createFilterObject()) && (
                        <button className="btn btn-error" onClick={() => removeFilter()}>
                            Vymazat
                        </button>
                    )}
                    <button className="btn btn-primary" onClick={() => applyFilter(createFilterObject())}>
                        Použít
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Filter;
