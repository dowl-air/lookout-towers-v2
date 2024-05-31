"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { Tower } from "@/typings";
import TowerCard from "../../app/TowerCard";

export default function ImageSlider({ towers }: { towers: Tower[] }) {
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
            breakpoints={{
                0: {
                    slidesPerView: 2,
                },
                437: {
                    slidesPerView: 3,
                },
                585: {
                    slidesPerView: 4,
                },
                925: {
                    slidesPerView: 5,
                },
                1024: {
                    slidesPerView: 4,
                },
                1150: {
                    slidesPerView: 5,
                },
            }}
            className="max-w-[min(1280px,99vw)] md:mt-3"
        >
            {towers.map((item, index) => (
                <SwiperSlide key={index} className="mt-5">
                    <TowerCard tower={item} priority={index < 5} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
