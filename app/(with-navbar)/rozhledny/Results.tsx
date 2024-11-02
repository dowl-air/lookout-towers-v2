"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Filter, Tower } from "@/typings";
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
    const [towers, setTowers] = useState<Tower[]>([]);
    const [ratings, setRatings] = useState<{ avg: number; count: number; id: string }[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [offset, setOffset] = useState<number>(0);

    const fetchData = useCallback(
        async (new_filter: boolean = false) => {
            setIsLoading(true);
            try {
                const { towers: new_towers, ratings } = await searchTowers({
                    q: filter.searchTerm,
                    limit: LIMIT,
                    offset: new_filter ? 0 : offset,
                    sort_by: "name:asc",
                    include_ratings: true,
                });
                if (new_towers.length == 0) return;

                new_filter ? setTowers(new_towers) : setTowers((prevItems) => [...prevItems, ...new_towers]);
                new_filter ? setOffset(new_towers.length) : setOffset(offset + new_towers.length);

                setRatings((prevItems) => [...prevItems, ...ratings]);
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
            {towers &&
                towers.map((item, idx) => {
                    const rating = ratings.find((elm) => elm.id === item.id);
                    return (
                        <TowerCard key={idx} tower={item} avg={rating.avg} count={rating.count} photoUrl={item.mainPhotoUrl} /> //todo rework
                    );
                })}
        </div>
    );
}

export default Results;
