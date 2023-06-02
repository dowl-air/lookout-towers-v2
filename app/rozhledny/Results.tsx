"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Filter, Tower } from "@/typings";
import TowerCard from "../TowerCard";

const API_URL = "/rozhledny/api?";

const jsonDateRegexp = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z$/;

function jsonRetriever(key: string, value: any) {
    // let's try to detect input we dont have to parse early, so this function is as fast as possible
    if (typeof value !== "string") {
        return value;
    }

    const dateMatch = jsonDateRegexp.exec(value);

    if (!dateMatch) {
        return value;
    }

    return new Date(Date.UTC(+dateMatch[1], +dateMatch[2] - 1, +dateMatch[3], +dateMatch[4], +dateMatch[5], +dateMatch[6], +dateMatch[7]));
}

type ComponentProps = {
    filter: Filter;
};

const createParams = (filter: Filter, startItemId: string): string => {
    type obj = {
        startItemId?: string;
        searchTerm?: string;
    };
    const data: obj = { ...filter, startItemId: startItemId };

    if (!data.searchTerm) {
        delete data.searchTerm;
    }

    return new URLSearchParams(data).toString();
};

function Results({ filter }: ComponentProps) {
    const [towers, setTowers] = useState<Tower[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);
    const [start, setStart] = useState<string>("");

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const towers: Tower[] = JSON.parse(
                await fetch(API_URL + createParams(filter, start)).then((res) => res.text()),
                jsonRetriever
            ) as Tower[];
            setTowers((prevItems) => [...prevItems, ...towers]);
            setStart(towers[towers.length - 1].id);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [filter, start]);

    useEffect(() => {
        setTowers([]);
        setStart("");
        fetchData();
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
        <div className="flex flex-wrap gap-3 justify-center w-[1200px]">
            {towers && towers.map((item, idx) => <TowerCard key={idx} tower={item} />)}
        </div>
    );
}

export default Results;
