"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

//todo somehow ssr this component, use different slider idk
import TowerCardClient from "./TowerCard";
import useLocation from "@/hooks/useLocation";
import { Tower } from "@/types/Tower";

export default function ImageSlider({
    towers,
    ratings,
}: {
    towers: Tower[];
    ratings: { avg: number; count: number }[];
}) {
    const { location } = useLocation();
    return (
        <Swiper
            centeredSlides
            grabCursor
            loop
            spaceBetween={14}
            modules={[Autoplay]}
            autoplay={{
                delay: 2500,
                disableOnInteraction: true,
            }}
            breakpoints={{
                0: {
                    slidesPerView: 1.15,
                },
                437: {
                    slidesPerView: 2.15,
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
            className="max-w-[min(1280px,99vw)] px-4 md:mt-3 md:px-0"
        >
            {towers.map((item, index) => (
                <SwiperSlide key={index} className="mt-5">
                    <TowerCardClient
                        tower={item}
                        priority={index < 5}
                        avg={ratings[index].avg}
                        count={ratings[index].count}
                        photoUrl={item.mainPhotoUrl}
                        userLocation={location}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
