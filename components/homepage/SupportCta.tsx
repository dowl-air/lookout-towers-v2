import { ArrowRight, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function SupportCta() {
    return (
        <section className="relative mt-16 min-h-[420px] overflow-hidden sm:min-h-[380px]">
            <Image
                src="/img/rozhledna_bukovka_cr.jpg"
                alt="Výhled k rozhledně Bukovka"
                fill
                sizes="100vw"
                className="object-cover object-[68%_center]"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-black/15" />
            <div className="relative mx-auto flex min-h-[420px] w-full max-w-7xl items-center px-5 py-12 text-white sm:min-h-[380px] sm:px-8">
                <div className="max-w-2xl">
                    <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-white/70">
                        <Heart aria-hidden="true" size={18} fill="currentColor" />
                        Nezávislý komunitní projekt
                    </p>
                    <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                        Pomozte Rozhlednovému světu růst
                    </h2>
                    <p className="mt-4 max-w-xl text-lg leading-8 text-white/80">
                        Web je zdarma pro všechny. Dobrovolným příspěvkem můžete podpořit jeho
                        provoz, nové funkce a další rozšiřování databáze.
                    </p>
                    <Link
                        href="/podporit"
                        className="btn mt-7 h-12 rounded-lg border-0 bg-white px-5 text-neutral hover:bg-white/90"
                    >
                        Podpořit projekt
                        <ArrowRight aria-hidden="true" size={19} />
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default SupportCta;
