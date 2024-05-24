"use client";
import { Tower, Visit } from "@/typings";
import React, { useState } from "react";
import VisitsTimeline from "./VisitsTimeline";

function TabsAndContent({ visits, favs, towers, loading }: { visits: Visit[]; favs: string[]; towers: Tower[]; loading: boolean }) {
    const [page, setPage] = useState<string>("visited");

    return (
        <div className="flex flex-col flex-1 gap-6">
            <div className="join mt-4 self-center">
                <input
                    className={`join-item btn ${page === "visited" && "btn-primary"}`}
                    type="radio"
                    name="options"
                    aria-label="Navštívené"
                    onClick={() => setPage("visited")}
                />
                <input
                    className={`join-item btn ${page === "favourites" && "btn-primary"}`}
                    type="radio"
                    name="options"
                    aria-label="Oblíbené"
                    onClick={() => setPage("favourites")}
                />
                <input
                    className={`join-item btn ${page === "achievements" && "btn-primary"}`}
                    type="radio"
                    name="options"
                    aria-label="Úspěchy"
                    onClick={() => setPage("achievements")}
                />
            </div>
            {page === "visited" && <VisitsTimeline visits={visits} loading={loading} loadingTowers={true} towers={towers} />}
            {page === "favourites" && <h2 className="prose prose-xl text-primary mt-5 mb-80">Tato sekce bude brzy dostupná. Probíhá vývoj.</h2>}
            {page === "achievements" && <h2 className="prose prose-xl text-primary mt-5 mb-80">Tato sekce bude brzy dostupná. Probíhá vývoj.</h2>}
        </div>
    );
}

export default TabsAndContent;
