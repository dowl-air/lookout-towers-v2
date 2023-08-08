import React from "react";

function Hero() {
    return (
        <div className="flex flex-col gap-6 md:gap-8 font-semibold text-white justify-center items-center mt-[-70px] w-full h-[350px] md:h-[450px] bg-cover bg-no-repeat bg-top bg-[url('/img/rozhledna_bukovka.jpg')] md:bg-[url('/img/rozhledna_bukovka_cr.jpg')]">
            <p className="[text-shadow:7px_9px_5px_rgba(0,0,0,0.6)] text-center mt-16 md:mt-12 text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                Rozhledny, věže a vyhlídky
            </p>
            <p className="[text-shadow:7px_9px_5px_rgba(0,0,0,0.6)] text-center text-2xl sm:text-4xl md:text-5xl lg:text-6xl">
                Jedinečné příběhy ve výškách
            </p>
        </div>
    );
}

export default Hero;
