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
            <div className="flex gap-4 justify-center mt-4">
                <Results filter={filter} />
                <Filter applyFilter={setFilter} initFilter={initFilter} />
            </div>
        </>
    );
}

export default TowersPage;
