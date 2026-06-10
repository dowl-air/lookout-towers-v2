"use client";

import dynamic from "next/dynamic";

import ImageSliderSkeleton from "@/components/homepage/ImageSliderSkeleton";
import { Tower } from "@/types/Tower";

const ImageSlider = dynamic(() => import("@/components/homepage/ImageSlider"), {
    ssr: false,
    loading: () => <ImageSliderSkeleton />,
});

export default function ImageSliderNoSsr({
    towers,
    ratings,
}: {
    towers: Tower[];
    ratings: { avg: number; count: number }[];
}) {
    return <ImageSlider towers={towers} ratings={ratings} />;
}
