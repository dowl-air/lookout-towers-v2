"use client";
import Image from "next/image";
import React, { useState } from "react";

type PageProps = {
    images: string[];
    phone?: boolean;
};

function Carousel({ images, phone }: PageProps) {
    const [index, setIndex] = useState(0);

    const moveForvard = () => {
        const idx = index !== images.length - 1 ? index + 1 : index;
        setIndex(idx);
        document?.getElementById(`image_${idx}`)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    };
    const moveBackwards = () => {
        const idx = index !== 0 ? index - 1 : 0;
        setIndex(idx);
        document?.getElementById(`image_${idx}`)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    };

    return (
        <div className="max-w-screen-sm flex flex-col mb-7">
            <figure className="hidden lg:block h-64 lg:h-96 my-0">
                <div
                    className={`btn btn-outline relative top-[calc(50%-24px+48px)] right-[-80%] lg:left-[85%] ${
                        index === images.length - 1 && "btn-disabled"
                    }`}
                    onClick={moveForvard}
                >
                    <svg fill="currentColor" height="20px" width="20px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g>
                            <g>
                                <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12" />
                            </g>
                        </g>
                    </svg>
                </div>
                <div
                    className={`btn btn-outline relative top-[calc(50%-24px+48px)] lg:right-[2%] ${index === 0 && "btn-disabled"}`}
                    onClick={moveBackwards}
                >
                    <svg fill="currentColor" height="20px" width="20px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g>
                            <g>
                                <polygon points="17.2,23.7 5.4,12 17.2,0.3 18.5,1.7 8.4,12 18.5,22.3" />
                            </g>
                        </g>
                    </svg>
                </div>
                <label className="cursor-pointer" htmlFor={phone ? "phone-modal" : "my-modal-4"}>
                    <div className="h-full flex justify-center items-center">
                        <img
                            alt={"tower_todo"}
                            src={images[index]}
                            className="block object-scale-down max-h-[250px] lg:max-h-[384px]  mx-auto my-auto rounded-lg"
                        />
                    </div>
                </label>
            </figure>

            <div className="flex lg:hidden items-center gap-2">
                <div className={`btn btn-outline ${index === 0 && "btn-disabled"}`} onClick={moveBackwards}>
                    <svg fill="currentColor" height="20px" width="20px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g>
                            <g>
                                <polygon points="17.2,23.7 5.4,12 17.2,0.3 18.5,1.7 8.4,12 18.5,22.3" />
                            </g>
                        </g>
                    </svg>
                </div>
                <label className="cursor-pointer" htmlFor={phone ? "phone-modal" : "my-modal-4"}>
                    <div className="flex max-[380px]:w-44 max-[400px]:w-56 max-[500px]:w-64 max-[500px]:h-64 max-[580px]:w-80 max-[660px]:w-[26rem] max-[750px]:h-80 max-[750px]:w-[32rem] w-56 h-56 min-[930px]:w-80 min-[930px]:h-72 relative">
                        <Image
                            alt={"tower_todo"}
                            src={images[index]}
                            fill
                            priority
                            className="block object-cover"
                            sizes="(max-width: 450px) 100vw, (max-width: 800px) 33vw, 25vw"
                        />
                    </div>
                </label>
                <div className={`btn btn-outline ${index === images.length - 1 && "btn-disabled"}`} onClick={moveForvard}>
                    <svg fill="currentColor" height="20px" width="20px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g>
                            <g>
                                <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12" />
                            </g>
                        </g>
                    </svg>
                </div>
            </div>

            <div className="h-28 hidden lg:flex overflow-x-hidden max-w-screen-sm gap-2 scroll-smooth snap-center scroll-p-[280px] mt-16 mb-3">
                {images.map((image, idx) => (
                    <img
                        key={idx}
                        id={`image_${idx}`}
                        src={image}
                        alt={"image"}
                        className={`block h-full object-scale-down rounded-lg border-solid border-2 p-1 cursor-pointer ${
                            idx === index ? "border-primary-focus" : "border-transparent"
                        }`}
                        onClick={() => {
                            setIndex(idx);
                            document?.getElementById(`image_${idx}`)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                        }}
                    />
                ))}
            </div>

            <input type="checkbox" id={phone ? "phone-modal" : "my-modal-4"} className="modal-toggle" />
            <label htmlFor={phone ? "phone-modal" : "my-modal-4"} className="modal cursor-pointer">
                <img alt={"tower_todo"} src={images[index]}></img>
            </label>
        </div>
    );
}

export default Carousel;
