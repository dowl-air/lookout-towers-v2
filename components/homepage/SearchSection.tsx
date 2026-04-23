import Link from "next/link";

import HeroSearch from "@/components/homepage/HeroSearch";

const frequentSearches = [
    { label: "Rozhledny v Praze", href: "/rozhledny?country=CZ&province=PR" },
    { label: "Rozhledny na jižní Moravě", href: "/rozhledny?country=CZ&province=JM" },
    { label: "Rozhledny ve Slezsku", href: "/rozhledny?country=CZ&province=MO" },
];

function SearchSection() {
    return (
        <section className="mx-auto -mt-12 w-full max-w-[1070px] px-4 md:-mt-16">
            <div className="rounded-3xl border border-base-300/70 bg-base-100/95 p-6 shadow-2xl backdrop-blur md:p-8">
                <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
                    <h2 className="text-3xl font-bold md:text-4xl">Najít rozhlednu</h2>
                    <p className="text-base-content/70 max-w-2xl text-sm md:text-base">
                        Vyhledejte konkrétní místo podle názvu nebo se inspirujte častými
                        kategoriemi hledání.
                    </p>
                    <HeroSearch />
                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                        {frequentSearches.map((search) => (
                            <Link
                                key={search.href}
                                href={search.href}
                                className="btn btn-sm btn-ghost rounded-full border border-base-300 bg-base-200/60 px-4 hover:border-primary hover:bg-primary/10 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100"
                            >
                                {search.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SearchSection;
