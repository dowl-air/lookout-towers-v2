"use client";
import React, { Suspense, useState } from "react";
import { Filter } from "@/typings";
import Results from "./Results";
import { useSearchParams } from "next/navigation";
import Filter_ from "./Filter";

function TowersPage() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q");
    const initialProvince = searchParams.get("province");
    const initialCounty = searchParams.get("county");

    const initFilter: Filter = {
        searchTerm: initialQuery || "",
        province: initialProvince || "Všechny kraje",
        county: initialCounty || "Všechny okresy",
    };

    const [filter, setFilter] = useState<Filter>(initFilter);
    return (
        <div className="flex flex-col xl:flex-row-reverse gap-4 justify-center items-center xl:items-start mt-4 max-w-7xl mx-auto">
            <Filter_ applyFilter={setFilter} initFilter={initFilter} />
            <Results filter={filter} />
        </div>
    );
}

const TowersPageWrapper = () => {
    return (
        <Suspense>
            <TowersPage />
        </Suspense>
    );
};

export default TowersPageWrapper;
