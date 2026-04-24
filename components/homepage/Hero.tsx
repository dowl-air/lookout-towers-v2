import Link from "next/link";

import { getLastModifiedTowerDate } from "@/data/tower/last-modified-tower-date";
import { getTotalTowersCount } from "@/data/tower/total-count";
import { getTotalUsersCount } from "@/data/user/total-count";
import { formatDate } from "@/utils/date";

async function Hero() {
    const [towersNumber, usersNumber, towersDate] = await Promise.all([
        getTotalTowersCount(),
        getTotalUsersCount(),
        getLastModifiedTowerDate(),
    ]);

    const numberFormatter = new Intl.NumberFormat("cs-CZ");
    const proofItems = [
        `${numberFormatter.format(towersNumber)} míst v databázi`,
        `${numberFormatter.format(usersNumber)} účtů v komunitě`,
        `aktualizováno ${formatDate({ date: towersDate })}`,
    ];

    return (
        <section className="relative flex min-h-[400px] w-full flex-col items-center justify-center overflow-hidden bg-[url('/img/rozhledna_bukovka.jpg')] bg-cover bg-top bg-no-repeat px-4 pb-16 pt-20 text-white md:min-h-[500px] md:bg-[url('/img/rozhledna_bukovka_cr.jpg')] md:pb-20 md:pt-24">
            <div className="absolute inset-0 bg-linear-to-b from-black/65 via-black/50 to-black/75" />
            <div className="relative flex max-w-4xl flex-col items-center gap-5 text-center md:gap-6">
                <h1 className="text-4xl font-semibold [text-shadow:0_8px_28px_rgba(0,0,0,0.38)] sm:text-5xl md:text-5xl lg:text-[4.15rem] lg:leading-[1.05]">
                    Rozhledny, věže a vyhlídky
                </h1>
                <p className="max-w-2xl text-balance text-base font-medium leading-7 text-white/88 md:text-lg">
                    Objevujte místa s výhledem, plánujte další výlet a vracejte se k rozhlednám,
                    které stojí za návštěvu.
                </p>
                <div className="rounded-full border border-white/15 bg-black/18 px-4 py-2 text-sm font-medium text-white/78 backdrop-blur md:px-5 md:text-[0.95rem]">
                    <span className="font-semibold text-white">{proofItems[0]}</span>
                    <span className="px-2 text-white/35">•</span>
                    <span>{proofItems[1]}</span>
                    <span className="px-2 text-white/35">•</span>
                    <span>{proofItems[2]}</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
                    <Link
                        href="/rozhledny"
                        className="btn btn-primary btn-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
                    >
                        Procházet rozhledny
                    </Link>
                    <Link
                        href="/mapa"
                        className="inline-flex items-center gap-2 text-base font-semibold text-white/85 underline-offset-4 transition hover:text-white hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
                    >
                        Prozkoumat mapu
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default Hero;
