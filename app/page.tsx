import React from "react";
import FilterSide from "./FilterSide";
import TowerCard from "./TowerCard";

function HomePage() {
    return (
        <div className="m-9 flex gap-4">
            <TowerCard />
            <FilterSide />
        </div>
    );
}

export default HomePage;
