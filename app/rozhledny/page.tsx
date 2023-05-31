"use client";
import React, { useState } from "react";
import Filter from "./Filter";
import Results from "./Results";

const initFilter = {
    searchTerm: "",
};

function TowersPage() {
    const [filter, setFilter] = useState(initFilter);
    return (
        <div className="flex">
            <Results filter={filter} />
            <Filter applyFilter={setFilter} />
        </div>
    );
}

export default TowersPage;
