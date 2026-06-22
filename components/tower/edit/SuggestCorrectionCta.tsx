import { CircleAlert } from "lucide-react";

import SuggestEditButton from "@/components/tower/edit/SuggestEditButton";

const SuggestCorrectionCta = () => (
    <section
        className="w-full border-t border-base-300/70 py-10 sm:py-14"
        aria-label="Navrhnout opravu údajů"
    >
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <div className="relative flex size-16 items-center justify-center text-base-content/30 sm:size-20">
                <CircleAlert className="size-14 stroke-[1.4] sm:size-18" />
                <span className="absolute bottom-2 right-2 size-3 rounded-full bg-primary sm:bottom-3 sm:right-3" />
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-bold text-base-content sm:text-2xl">
                    Našli jste chybu?
                </h2>
                <p className="mx-auto max-w-xl text-sm leading-relaxed text-base-content/65 sm:text-base">
                    Pomozte udržet údaje aktuální. Navrhněte opravu názvu, parametrů, otevírací
                    doby, vstupného nebo zdrojů.
                </p>
            </div>
            <SuggestEditButton label="Navrhnout opravu" className="btn-primary" />
        </div>
    </section>
);

export default SuggestCorrectionCta;
