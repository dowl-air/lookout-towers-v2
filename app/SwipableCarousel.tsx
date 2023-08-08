"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { Tower } from "@/typings";
import TowerCard from "./TowerCard";

type PageProps = {
    towers: Tower[];
};

export default function ImageSlider({ towers }: PageProps) {
    return (
        <Swiper
            centeredSlides
            grabCursor
            loop
            spaceBetween={10}
            modules={[Autoplay]}
            autoplay={{
                delay: 2500,
                disableOnInteraction: true,
            }}
            //modules={[Autoplay]}
            breakpoints={{
                0: {
                    slidesPerView: 1,
                },
                460: {
                    slidesPerView: 2,
                },
                700: {
                    slidesPerView: 3,
                },
                1000: {
                    slidesPerView: 4,
                },
                1150: {
                    slidesPerView: 5,
                },
            }}
            className="max-w-[min(1280px,99vw)] mt-3"
        >
            {towers.map((item, index) => (
                <SwiperSlide key={index} className="mt-5">
                    <TowerCard tower={item} priority={index < 5} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
