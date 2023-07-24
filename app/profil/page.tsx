"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { signIn } from "next-auth/react";
import DynamicMap from "./DynamicMap";
import ProfileBox from "./ProfileBox";
import { Rating, Tower, User, Visit } from "@/typings";
import TabsAndContent from "./TabsAndContent";

function Page() {
    const { data: session, status } = useSession();

    const [visits, setVisits] = useState<Visit[]>([]);
    const [favsIDs, setFavsIDs] = useState<string[]>([]);
    const [reviews, setReviews] = useState<Rating[]>([]);

    const [towers, setTowers] = useState<Tower[]>([]);

    const [loadCounter, setLoadCounter] = useState<number>(3);

    useEffect(() => {
        const getVisits = async (user: User): Promise<Visit[]> => {
            const result = await fetch(`/api/visits/get?user_id=${user?.id}`).then((res) => res.json());
            if (result.status == 200) return result.message as Visit[];
            return [];
        };
        const getFavs = async (user: User): Promise<string[]> => {
            const result = await fetch(`/api/favourites/user?user_id=${user?.id}`).then((res) => res.json());
            if (result.status == 200) return result.message as string[];
            return [];
        };
        const getRatings = async (user: User): Promise<Rating[]> => {
            const result = await fetch(`/api/reviews/get?user_id=${user?.id}`).then((res) => res.json());
            if (result.status == 200) return result.message as Rating[];
            return [];
        };
        if (status === "authenticated")
            getVisits(session?.user).then((res) => {
                setVisits(res);
                setLoadCounter((prev) => prev - 1);
            });
        if (status === "authenticated")
            getFavs(session?.user).then((res) => {
                setFavsIDs(res);
                setLoadCounter((prev) => prev - 1);
            });
        if (status === "authenticated")
            getRatings(session?.user).then((res) => {
                setReviews(res);
                setLoadCounter((prev) => prev - 1);
            });
    }, [status, session?.user]);

    useEffect(() => {
        function merge(array1: string[], array2: string[]): string[] {
            let arrayMerge = array1.concat(array2);
            return arrayMerge.filter((item, index) => arrayMerge.indexOf(item) == index);
        }

        const getTowers = async (): Promise<Tower[]> => {
            const visit_ids: string[] = merge(
                visits.map((e) => e.tower_id),
                favsIDs
            );
            const all_ids: string[] = merge(
                reviews.map((e) => e.tower_id),
                visit_ids
            );
            const result = await fetch(`/api/rozhledny/ids`, { method: "POST", body: JSON.stringify({ ids: all_ids }) }).then((res) => res.json());
            return result as Tower[];
        };
        if (loadCounter <= 0) getTowers().then((res) => setTowers(res));
    }, [loadCounter, favsIDs, visits, reviews]);

    useEffect(() => {
        if (status === "unauthenticated") signIn();
    }, [status]);

    if (status === "loading")
        return (
            <>
                <div className="flex flex-col items-center ">
                    <Navbar />
                    <span className="loading loading-dots loading-lg mt-10 text-primary"></span>
                </div>
            </>
        );

    return (
        <>
            <div className="flex flex-col items-center gap-3">
                <Navbar />
                <div className="flex max-w-[calc(min(99vw,80rem))] w-full items-center sm:items-start justify-center flex-col sm:flex-row sm:h-[687px] gap-3">
                    <ProfileBox
                        score={0}
                        changes={0}
                        favs={favsIDs.length}
                        ratings={reviews.length}
                        visits={visits.length}
                        loading={loadCounter > 0}
                    />
                    <div className="flex h-[170px] w-[97vw] flex-grow sm:h-full">
                        {loadCounter > 0 && <span className="loading loading-dots loading-lg absolute z-10 text-primary"></span>}
                        <DynamicMap
                            lat={49.8237572}
                            long={15.6086383}
                            towers={towers}
                            visits={visits.map((v) => v.tower_id)}
                            favs={favsIDs}
                            type={"neco"}
                        />
                    </div>
                </div>
                <TabsAndContent visits={visits} favs={favsIDs} towers={towers} />
            </div>
        </>
    );
}

export default Page;
