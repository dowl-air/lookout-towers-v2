"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";

import { Tower } from "@/typings";
import TowerCard from "./TowerCard";

type PageProps = {
    towers: Tower[];
};

export default function ImageSlider({ towers }: PageProps) {
    return (
        <Swiper
            centeredSlides={true}
            slidesPerView={"auto"}
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
                    spaceBetween: 10,
                },
                700: {
                    slidesPerView: 3,
                    spaceBetween: 20,
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
            className="max-w-[min(1280px,99vw)] mt-10"
        >
            {towers.map((item, index) => (
                <SwiperSlide key={index} className="mt-3">
                    <TowerCard tower={item} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
