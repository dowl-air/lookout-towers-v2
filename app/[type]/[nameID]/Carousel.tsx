"use client";
import { Tower } from "@/typings";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type PageProps = {
    images: string[];
};

function Carousel({ images }: PageProps) {
    const [index, setIndex] = useState(0);
    const router = useRouter();

    const moveForvard = () => {
        setIndex(index !== images.length - 1 ? index + 1 : index);
        console.log("current " + index.toString());
    };
    const moveBackwards = () => {
        setIndex(index !== 0 ? index - 1 : 0);
        console.log("current " + index.toString());
    };

    return (
        <div className="max-w-screen-sm flex flex-col flex-1">
            <figure className="h-96">
                <a
                    href={`#image_${index !== images.length - 1 ? index + 1 : index}`}
                    className={`btn btn-outline relative top-[calc(50%-24px+48px)] left-[85%] ${index === images.length - 1 && "btn-disabled"}`}
                    onClick={moveForvard}
                >
                    <svg fill="currentColor" height="20px" width="20px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g>
                            <g>
                                <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12" />
                            </g>
                        </g>
                    </svg>
                </a>
                <a
                    href={`#image_${index !== 0 ? index - 1 : 0}`}
                    className={`btn btn-outline relative top-[calc(50%-24px+48px)] right-[2%] ${index === 0 && "btn-disabled"}`}
                    onClick={moveBackwards}
                >
                    <svg fill="currentColor" height="20px" width="20px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g>
                            <g>
                                <polygon points="17.2,23.7 5.4,12 17.2,0.3 18.5,1.7 8.4,12 18.5,22.3" />
                            </g>
                        </g>
                    </svg>
                </a>
                <div className="h-full flex justify-center items-center">
                    <img alt={"tower_todo"} src={images[index]} className="block object-scale-down max-h-[384px] mx-auto my-auto rounded-lg" />
                </div>
            </figure>
            <div className="h-28  flex overflow-x-hidden max-w-screen-sm gap-2 scroll-smooth snap-center scroll-p-[280px] mt-16 mb-3">
                {images.map((image, idx) => (
                    <img
                        key={idx}
                        id={`image_${idx}`}
                        src={image}
                        alt={"image"}
                        className={`block h-full object-scale-down rounded-lg border-solid border-2 p-1 cursor-pointer ${
                            idx === index ? "border-secondary" : "border-transparent"
                        }`}
                        onClick={() => {
                            setIndex(idx);
                            document?.getElementById(`image_${idx}`)?.scrollIntoView();
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default Carousel;
