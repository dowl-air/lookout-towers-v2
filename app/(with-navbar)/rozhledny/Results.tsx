"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Filter, SearchResult } from "@/typings";
import TowerCard from "../../../components/homepage/TowerCard";
import { searchTowers } from "@/actions/towers/tower.search";

const LIMIT = 20;

type ComponentProps = {
    filter: Filter;
};

const createFilterString = (filter: Filter): string => {
    let finalString = "";
    if (filter.province) finalString += `province = "${filter.province}"`;
    if (filter.county) finalString += `${finalString ? " AND " : ""}county = "${filter.county}"`;
    return finalString;
};

function Results({ filter }: ComponentProps) {
    const [towers, setTowers] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [offset, setOffset] = useState<number>(0);

    const fetchData = useCallback(
        async (new_filter: boolean = false) => {
            setIsLoading(true);
            try {
                const new_towers = await searchTowers(filter.searchTerm, LIMIT, new_filter ? 0 : offset, createFilterString(filter));
                if (new_towers.length == 0) return;

                new_filter ? setTowers(new_towers) : setTowers((prevItems) => [...prevItems, ...new_towers]);
                new_filter ? setOffset(new_towers.length) : setOffset(offset + new_towers.length);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        },
        [filter, offset]
    );

    useEffect(() => {
        fetchData(true);
    }, [filter]);

    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isLoading) {
            return;
        }
        fetchData();
    }, [isLoading, fetchData]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isLoading, handleScroll]);

    return (
        <div className="flex flex-wrap gap-3 flex-1 justify-center max-w-[1200px] mt-3 xl:mt-8 mb-12 min-h-[70vh]">
            {towers && towers.map((item, idx) => <TowerCard key={idx} tower_search={item} />)}
        </div>
    );
}

export default Results;
