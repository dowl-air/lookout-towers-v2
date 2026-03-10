import Link from "next/link";

import HeroSearch from "@/components/homepage/HeroSearch";
import LocationSearch from "@/components/homepage/LocationSearch";

function Hero() {
    return (
        <div className="relative flex min-h-[420px] w-full flex-col items-center justify-center overflow-hidden bg-[url('/img/rozhledna_bukovka.jpg')] bg-cover bg-top bg-no-repeat px-4 pb-10 pt-24 font-semibold text-white md:min-h-[520px] md:bg-[url('/img/rozhledna_bukovka_cr.jpg')]">
            <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/40 to-black/70" />
            <div className="relative flex max-w-5xl flex-col items-center gap-6 md:gap-8">
                <p className="text-center text-3xl [text-shadow:7px_9px_5px_rgba(0,0,0,0.6)] sm:text-5xl md:mt-4 md:text-6xl lg:text-7xl">
                    Rozhledny, věže a vyhlídky
                </p>
                <p className="text-center text-2xl [text-shadow:7px_9px_5px_rgba(0,0,0,0.6)] sm:text-4xl md:text-5xl lg:text-6xl">
                    Jedinečné příběhy ve výškách
                </p>
                <p className="max-w-3xl text-center text-base font-medium text-white/90 md:text-lg">
                    Objevujte rozhledny po celém Česku, plánujte výlety a ukládejte si místa, která
                    stojí za návštěvu.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link href="/mapa" className="btn btn-primary btn-lg">
                        Prozkoumat mapu
                    </Link>
                    <Link
                        href="/rozhledny"
                        className="btn btn-outline btn-lg border-white text-white hover:border-white hover:bg-white hover:text-base-content"
                    >
                        Procházet rozhledny
                    </Link>
                </div>
                <div className="flex flex-col-reverse gap-3 md:flex-row md:items-end md:gap-5">
                    <LocationSearch />
                    <HeroSearch />
                </div>
            </div>
        </div>
    );
}

export default Hero;
