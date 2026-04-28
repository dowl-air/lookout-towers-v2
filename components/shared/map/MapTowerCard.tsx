"use client";

import { useEffect, useState } from "react";

import { TowerMapDTO } from "@/data/tower/towers-map";
import { getOpeningHoursStateAndShortText } from "@/utils/openingHours";

import TowerCardBase from "../TowerCardBase";

interface MapTowerCardProps {
    tower: TowerMapDTO;
}

const MapTowerCard = ({ tower }: MapTowerCardProps) => {
    const [state, openingHoursText] = getOpeningHoursStateAndShortText(tower.openingHours);
    const [rating, setRating] = useState<{ avg: number; count: number } | null>(null);

    useEffect(() => {
        let isActive = true;

        const loadRating = async () => {
            const response = await fetch(`/api/towers/${tower.id}/rating`, {
                cache: "force-cache",
            });

            if (!response.ok || !isActive) {
                return;
            }

            const ratingData = (await response.json()) as { avg: number; count: number };

            if (isActive) {
                setRating(ratingData);
            }
        };

        loadRating();

        return () => {
            isActive = false;
        };
    }, [tower.id]);

    return (
        <TowerCardBase
            href={`/${tower.type || "rozhledna"}/${tower.nameID}`}
            scroll
            title={tower.name}
            photoUrl={tower.mainPhotoUrl}
            typeLabel={tower.type}
            placeLabel={tower.county ?? tower.province ?? tower.country}
            regionLabel={tower.province ?? tower.country}
            openingHoursLabel={openingHoursText || undefined}
            openingHoursState={state}
            ratingLabel={
                rating ? (rating.count ? rating.avg.toFixed(1) : "Bez recenzí") : undefined
            }
            ratingCount={rating?.count}
            distanceGps={tower.gps}
            cardClassName="w-60 rounded-3xl shadow-xl shadow-black/10 hover:shadow-black/15"
            imageClassName="object-top"
            contentClassName="p-3"
            overlayClassName="p-3"
            titleClassName="text-lg"
            footerClassName="text-xs"
            showVisited={tower.isVisited}
            showFavourite={tower.isFavourite}
        />
    );
};

export default MapTowerCard;
