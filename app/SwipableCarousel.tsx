"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
// swiper bundle styles
import "swiper/swiper-bundle.min.css";
// swiper core styles
import "swiper/swiper.min.css";

import { Tower } from "@/typings";
import TowerCard from "./TowerCard";

type PageProps = {
    towers: Tower[];
};

export default function ImageSlider({ towers }: PageProps) {
    return (
        <Swiper
            slidesPerView="auto"
            spaceBetween={20}
            pagination={{
                clickable: true,
            }}
            grabCursor={true}
            loop={true}
            autoplay={{
                delay: 2500,
                disableOnInteraction: true,
            }}
            modules={[Autoplay]}
            breakpoints={{
                500: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                700: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                },
                1000: {
                    slidesPerView: 4,
                    spaceBetween: 50,
                },
                1150: {
                    slidesPerView: 5,
                    spaceBetween: 50,
                },
            }}
            className="max-w-screen-xl mt-10"
        >
            {towers.map((item, index) => (
                <SwiperSlide key={index} className="mt-3">
                    <TowerCard tower={item} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
