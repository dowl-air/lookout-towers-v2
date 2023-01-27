"use client";
import React, { useEffect, useState } from "react";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//import TowerCard from "./TowerCard";
//import { get8TopTowers } from "../../database/firestore";
//import { Box } from "@mui/material";

function ImageSlider() {
    const [state, setState] = useState([]);
    useEffect(() => {
        const getSliderData = async () => {
            //const dataa = await get8TopTowers();
            //setState(dataa);
        };
        getSliderData();
    }, []);

    const settings = {
        arrows: false,
        dots: true,
        slidesToShow: 5,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnDotsHover: true,
        responsive: [
            {
                breakpoint: 1272,
                settings: {
                    arrows: false,
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    arrows: false,
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 510,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <div
            id={"slider-wrapper"}
            style={{
                display: "block",
            }}
        >
            {state.length > 0 ? (
                <Slider {...settings}>
                    {state.map((item, i) => (
                        <div key={i}>{/*<TowerCard tower={item} key={i} />*/}</div>
                    ))}
                </Slider>
            ) : (
                <div style={{ width: "250px", height: "350px" }}></div>
            )}
        </div>
    );
}

export default ImageSlider;
