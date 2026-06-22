import { CalendarDays, Clock3, ExternalLink, Landmark, Layers, MapPin, Ticket } from "lucide-react";
import Link from "next/link";

import SuggestEditButton from "@/components/tower/edit/SuggestEditButton";
import { getAdmissionTariffTypeLabel, getAdmissionTypeDescription } from "@/constants/admission";
import { getTowerTypeName } from "@/constants/towerType";
import { AdmissionType } from "@/types/Admission";
import { OpeningHoursForbiddenType, OpeningHoursType } from "@/types/OpeningHours";
import { Tower } from "@/types/Tower";
import { cn } from "@/utils/cn";
import { MONTHS_CZECH } from "@/utils/constants";
import { getCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { formatCountryName, formatCountyName, formatProvinceName } from "@/utils/geography";
import {
    formatOpeningHour,
    getOpeningHoursStatusClassName,
    getOpeningHoursRanges,
    normalizeOpeningHours,
} from "@/utils/openingHours";
import { generateHeightText } from "@/utils/texts";

const statusText = (tower: Tower) => {
    const openingHours = normalizeOpeningHours(tower.openingHours);

    switch (openingHours.type) {
        case OpeningHoursType.NonStop:
            return openingHours.isLockedAtNight
                ? "Volně přístupná, zamyká se přes noc."
                : "Volně přístupná.";
        case OpeningHoursType.Forbidden:
            if (openingHours.forbiddenType === OpeningHoursForbiddenType.Reconstruction) {
                return "Právě v rekonstrukci.";
            }
            if (openingHours.forbiddenType === OpeningHoursForbiddenType.Temporary) {
                return "Dočasně uzavřena.";
            }
            return "Nepřístupná.";
        case OpeningHoursType.Occasionally:
            return "Přístupná příležitostně.";
        case OpeningHoursType.WillOpen:
            return "Zanedlouho bude zpřístupněna.";
        case OpeningHoursType.EveryMonth:
        case OpeningHoursType.SomeMonths:
            return "Otevřena podle uvedené otevírací doby.";
        case OpeningHoursType.Unknown:
        default:
            return "Otevírací dobu ověřte před návštěvou.";
    }
};

const openingHoursRows = (tower: Tower) => {
    const openingHours = normalizeOpeningHours(tower.openingHours);
    const ranges = getOpeningHoursRanges(openingHours);

    if (!ranges.length) return [];

    return ranges.slice(0, 3).map((range) => {
        const months =
            range.monthFrom === 0 && range.monthTo === 11
                ? "Celoročně"
                : range.monthFrom === range.monthTo
                  ? MONTHS_CZECH.at(range.monthFrom)
                  : `${MONTHS_CZECH.at(range.monthFrom)} - ${MONTHS_CZECH.at(range.monthTo)}`;

        return {
            label: months ?? "Období",
            value: `${formatOpeningHour(range.dayFrom)} - ${formatOpeningHour(range.dayTo)} h`,
        };
    });
};

const admissionText = (tower: Tower) => {
    if (!tower.admission?.type) return "Vstupné zatím není doplněno.";
    if (tower.admission.type === AdmissionType.UNKNOWN) return "Vstupné ověřte před návštěvou.";
    return getAdmissionTypeDescription(tower.admission.type);
};

const admissionStatusClassName = (tower: Tower) => {
    switch (tower.admission?.type) {
        case AdmissionType.FREE:
            return "text-success";
        case AdmissionType.PAID:
        case AdmissionType.DONATION:
            return "text-base-content";
        case AdmissionType.UNKNOWN:
        default:
            return "text-base-content/60";
    }
};

const admissionRows = (tower: Tower) => {
    if (tower.admission?.type !== AdmissionType.PAID || !tower.admission.tariffes) return [];

    return Object.entries(tower.admission.tariffes)
        .filter(([, tariff]) => tariff?.price && tariff.price > 0)
        .slice(0, 4)
        .map(([key, tariff]) => ({
            label: getAdmissionTariffTypeLabel(key),
            value: `${tariff.price} ${getCurrency(tower.country).symbol}`,
        }));
};

const InfoLine = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex items-baseline justify-between gap-4 border-b border-base-300/60 py-2 last:border-b-0">
        <dt className="text-sm text-base-content/60">{label}</dt>
        <dd className="text-right text-sm font-semibold text-base-content">{value}</dd>
    </div>
);

const SummaryInfoLine = ({
    isUnknown = false,
    label,
    value,
}: {
    isUnknown?: boolean;
    label: string;
    value: string | number;
}) => (
    <div className="flex items-baseline justify-between gap-4 border-b border-base-300/60 py-2 last:border-b-0">
        <dt className="text-sm text-base-content/60">{label}</dt>
        <dd
            className={cn(
                "text-right text-sm font-semibold text-base-content",
                isUnknown && "text-error"
            )}
        >
            {isUnknown ? "neznámé" : value}
        </dd>
    </div>
);

const PracticalInfo = ({ tower }: { tower: Tower }) => {
    const status = statusText(tower);

    return (
        <section className="w-full" aria-labelledby="practical-info-heading">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 id="practical-info-heading" className="text-xl font-bold sm:text-2xl">
                        Praktické informace
                    </h2>
                    <p className="text-sm text-base-content/65">
                        Rychlý souhrn pro rozhodnutí, kdy vyrazit a co čekat na místě.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
                <div className="rounded-lg border border-base-300/70 bg-base-100 shadow-sm">
                    <div className="divide-y divide-base-300/70">
                        <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 gap-y-3 p-5 md:grid-cols-[2.75rem_10rem_minmax(0,1fr)] md:items-center">
                            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Clock3 className="size-5" />
                            </span>
                            <h3 className="self-center text-lg font-semibold">Otevírací doba</h3>
                            <div className="col-span-2 space-y-3 md:col-span-1">
                                <p
                                    className={cn(
                                        "text-base font-semibold",
                                        getOpeningHoursStatusClassName(tower.openingHours)
                                    )}
                                >
                                    {status}
                                </p>
                                {openingHoursRows(tower).length ? (
                                    <dl className="rounded-lg bg-base-200/45 px-4 py-2">
                                        {openingHoursRows(tower).map((row) => (
                                            <InfoLine
                                                key={`${row.label}-${row.value}`}
                                                label={row.label}
                                                value={row.value}
                                            />
                                        ))}
                                    </dl>
                                ) : null}
                                {tower.openingHours?.detailUrl ? (
                                    <Link
                                        href={tower.openingHours.detailUrl}
                                        target="_blank"
                                        className="link inline-flex items-center gap-1 text-sm"
                                    >
                                        Oficiální otevírací doba
                                        <ExternalLink className="size-3.5" />
                                    </Link>
                                ) : null}
                            </div>
                        </div>

                        <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 gap-y-3 p-5 md:grid-cols-[2.75rem_10rem_minmax(0,1fr)] md:items-center">
                            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Ticket className="size-5" />
                            </span>
                            <h3 className="self-center text-lg font-semibold">Vstupné</h3>
                            <div className="col-span-2 space-y-3 md:col-span-1">
                                <p
                                    className={cn(
                                        "text-base font-semibold",
                                        admissionStatusClassName(tower)
                                    )}
                                >
                                    {admissionText(tower)}
                                </p>
                                {admissionRows(tower).length ? (
                                    <dl className="rounded-lg bg-base-200/45 px-4 py-2">
                                        {admissionRows(tower).map((row) => (
                                            <InfoLine
                                                key={row.label}
                                                label={row.label}
                                                value={row.value}
                                            />
                                        ))}
                                    </dl>
                                ) : null}
                            </div>
                        </div>

                        <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 gap-y-3 p-5 md:grid-cols-[2.75rem_10rem_minmax(0,1fr)] md:items-center">
                            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <MapPin className="size-5" />
                            </span>
                            <h3 className="self-center text-lg font-semibold">Doprava</h3>
                            <a
                                href="#mapa"
                                className="col-span-2 cursor-pointer text-sm leading-relaxed text-base-content/75 transition hover:text-base-content hover:underline md:col-span-1"
                            >
                                Souřadnice a navigaci najdete v mapové sekci níže.
                            </a>
                        </div>
                    </div>
                </div>

                <aside
                    className="rounded-lg border border-base-300/70 bg-base-100 shadow-sm"
                    aria-label="Souhrn údajů"
                >
                    <div className="border-b border-base-300/70 bg-base-200/45 px-5 py-4">
                        <div className="flex items-center gap-2">
                            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Landmark className="size-5" />
                            </span>
                            <div>
                                <h3 className="font-semibold">Souhrn údajů</h3>
                                <p className="text-xs text-base-content/55">
                                    Základní údaje o místě.
                                </p>
                            </div>
                        </div>
                    </div>
                    <dl className="px-5 py-3">
                        <SummaryInfoLine label="Typ" value={getTowerTypeName(tower.type)} />
                        <SummaryInfoLine
                            label="Výška"
                            value={generateHeightText(tower.height)}
                            isUnknown={tower.height == null || tower.height === 0}
                        />
                        <SummaryInfoLine
                            label="Schody"
                            value={tower.stairs >= 0 ? tower.stairs : "neznámé"}
                            isUnknown={tower.stairs == null || tower.stairs === 0}
                        />
                        <SummaryInfoLine
                            label="Nadmořská výška"
                            value={`${tower.elevation} m n. m.`}
                            isUnknown={tower.elevation == null || tower.elevation === 0}
                        />
                        <SummaryInfoLine
                            label="Zpřístupnění"
                            value={
                                tower.opened
                                    ? formatDate({ date: tower.opened, long: true })
                                    : "neznámé"
                            }
                            isUnknown={!tower.opened}
                        />
                        <SummaryInfoLine
                            label="Výška výhledu"
                            value={
                                tower.viewHeight ? generateHeightText(tower.viewHeight) : "neznámé"
                            }
                            isUnknown={tower.viewHeight == null || tower.viewHeight === 0}
                        />
                        <SummaryInfoLine
                            label="Plošiny"
                            value={tower.observationDecksCount ?? "neznámé"}
                            isUnknown={
                                tower.observationDecksCount == null ||
                                tower.observationDecksCount === 0
                            }
                        />
                        <SummaryInfoLine
                            label="Okres"
                            value={formatCountyName(tower.county)}
                            isUnknown={!tower.county}
                        />
                        <SummaryInfoLine
                            label="Kraj"
                            value={formatProvinceName(tower.country, tower.province)}
                            isUnknown={!tower.province}
                        />
                        <SummaryInfoLine
                            label="Stát"
                            value={formatCountryName(tower.country)}
                            isUnknown={!tower.country}
                        />
                    </dl>
                    <div className="flex flex-wrap gap-2 border-t border-base-300/70 px-5 py-4 text-sm">
                        <span className="inline-flex items-center gap-2 rounded-lg bg-base-200/70 px-3 py-2 font-medium">
                            <Layers className="size-4 text-primary" />
                            <span>
                                Materiál:{" "}
                                {tower.material?.length ? tower.material.join(", ") : "neznámý"}
                            </span>
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-lg bg-base-200/70 px-3 py-2 font-medium">
                            <CalendarDays className="size-4 text-primary" />
                            {tower.modified
                                ? `Aktualizováno ${formatDate({ date: tower.modified, long: false })}`
                                : "bez úprav"}
                        </span>
                    </div>
                    <div className="border-t border-base-300/70 px-5 py-4">
                        <SuggestEditButton compact className="w-full justify-center" />
                    </div>
                </aside>
            </div>
        </section>
    );
};

export default PracticalInfo;
