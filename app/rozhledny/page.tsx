"use client";
import React, { useState } from "react";
import Filter from "./Filter";
import Results from "./Results";
import Navbar from "../Navbar";

const initFilter: Filter = {
    searchTerm: "",
    province: "",
    county: "",
};

function TowersPage() {
    const [filter, setFilter] = useState<Filter>(initFilter);
    return (
        <>
            <Navbar />
            <div className="flex flex-col xl:flex-row-reverse gap-4 justify-center items-center xl:items-start mt-4">
                <Filter applyFilter={setFilter} initFilter={initFilter} />
                <Results filter={filter} />
            </div>
        </>
    );
}

export default TowersPage;
