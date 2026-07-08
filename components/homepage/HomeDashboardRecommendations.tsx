"use client";

import { getDistance } from "geolib";
import { Bike, Flame, Heart, MapPin, MapPinned, Navigation, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { searchTowers } from "@/actions/towers/tower.search";
import {
    HomeDashboardRecommendation,
    HomeDashboardRecommendationReason,
} from "@/data/homepage/home-dashboard";
import useLocation from "@/hooks/useLocation";
import { Tower } from "@/types/Tower";
import { formatDistance } from "@/utils/geo";

type HomeDashboardRecommendationsProps = {
    recommendations: HomeDashboardRecommendation[];
    visitedTowerIds: string[];
};

const LOCATION_RECOMMENDATIONS_LIMIT = 4;

const reasonIcons: Record<HomeDashboardRecommendationReason, typeof Sparkles> = {
    "cycling-friendly": Bike,
    "favourite-match": Heart,
    "last-visit-nearby": Navigation,
    "near-user": MapPin,
    "newly-opened": Flame,
    random: Sparkles,
};

const toUserLocationRecommendation = (
    tower: Tower,
    location: { latitude: number; longitude: number }
): HomeDashboardRecommendation => ({
    description: "Nejbližší nenavštívený tip podle vaší uložené polohy v prohlížeči.",
    href: `/${tower.type || "rozhledna"}/${tower.nameID}`,
    id: tower.id,
    label: `${formatDistance(getDistance(location, tower.gps))} od vás`,
    photoUrl: tower.mainPhotoUrl || null,
    reason: "near-user",
    title: tower.name,
});

const shuffleRecommendations = (
    recommendations: HomeDashboardRecommendation[]
): HomeDashboardRecommendation[] => {
    const shuffledRecommendations = [...recommendations];

    for (let index = shuffledRecommendations.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [shuffledRecommendations[index], shuffledRecommendations[swapIndex]] = [
            shuffledRecommendations[swapIndex],
            shuffledRecommendations[index],
        ];
    }

    return shuffledRecommendations;
};

function HomeDashboardRecommendations({
    recommendations,
    visitedTowerIds,
}: HomeDashboardRecommendationsProps) {
    const [displayedRecommendations, setDisplayedRecommendations] = useState(
        recommendations.slice(0, 3)
    );
    const [locationRecommendations, setLocationRecommendations] = useState<
        HomeDashboardRecommendation[]
    >([]);
    const { location, permissionState } = useLocation();

    useEffect(() => {
        if (!location || permissionState !== "granted") {
            return;
        }

        let isCurrent = true;
        const excludedIds = new Set([
            ...visitedTowerIds,
            ...recommendations.map((recommendation) => recommendation.id),
        ]);

        searchTowers({
            q: "*",
            limit: 12,
            sort_by: `gps(${location.latitude}, ${location.longitude}):asc`,
        })
            .then(({ towers }) => {
                if (!isCurrent) {
                    return;
                }

                setLocationRecommendations(
                    towers
                        .filter((candidate) => !excludedIds.has(candidate.id))
                        .slice(0, LOCATION_RECOMMENDATIONS_LIMIT)
                        .map((tower) => toUserLocationRecommendation(tower, location))
                );
            })
            .catch(() => {
                if (isCurrent) {
                    setLocationRecommendations([]);
                }
            });

        return () => {
            isCurrent = false;
        };
    }, [location, permissionState, recommendations, visitedTowerIds]);

    const recommendationPool = useMemo(() => {
        const usedIds = new Set<string>();
        const mixedRecommendations = [...locationRecommendations, ...recommendations].filter(
            (recommendation): recommendation is HomeDashboardRecommendation =>
                Boolean(recommendation)
        );

        return mixedRecommendations.filter((recommendation) => {
            if (usedIds.has(recommendation.id)) {
                return false;
            }

            usedIds.add(recommendation.id);
            return true;
        });
    }, [locationRecommendations, recommendations]);

    useEffect(() => {
        setDisplayedRecommendations(shuffleRecommendations(recommendationPool).slice(0, 3));
    }, [recommendationPool]);

    if (displayedRecommendations.length === 0) {
        return null;
    }

    return (
        <article className="rounded-lg border border-base-300 bg-base-100 p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-primary">Doporučení</p>
                    <h3 className="mt-1 text-2xl font-bold">Kam dál?</h3>
                </div>
                <Sparkles aria-hidden="true" className="mt-1 text-primary" size={22} />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
                {displayedRecommendations.map((recommendation, index) => {
                    const ReasonIcon = reasonIcons[recommendation.reason];

                    return (
                        <Link
                            key={recommendation.id}
                            href={recommendation.href}
                            className={`group overflow-hidden rounded-lg border border-base-300 bg-base-200/45 transition hover:border-primary/50 hover:bg-base-200 ${
                                index > 1 ? "hidden md:block" : "block"
                            }`}
                        >
                            <div className="relative flex aspect-video items-center justify-center bg-base-300 text-base-content/45">
                                {recommendation.photoUrl ? (
                                    <Image
                                        src={recommendation.photoUrl}
                                        alt={recommendation.title}
                                        fill
                                        sizes="(min-width: 768px) 280px, 100vw"
                                        className="object-cover transition duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <MapPinned aria-hidden="true" size={30} />
                                )}
                            </div>
                            <div className="p-3">
                                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                                    <ReasonIcon aria-hidden="true" size={14} className="shrink-0" />
                                    <span>{recommendation.label}</span>
                                </p>
                                <h4 className="mt-1 line-clamp-2 text-base font-bold leading-tight">
                                    {recommendation.title}
                                </h4>
                                <p className="mt-2 line-clamp-2 text-sm text-base-content/65">
                                    {recommendation.description}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </article>
    );
}

export default HomeDashboardRecommendations;
