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
        <div className="flex gap-4 justify-center mt-4">
            <Results filter={filter} />
            <Filter applyFilter={setFilter} />
        </div>
    );
}

export default TowersPage;
