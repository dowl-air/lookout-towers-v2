"use client";

import { useState } from "react";

import { createChange } from "@/actions/changes/change.create";
import TowerModal from "@/components/shared/dialog/TowerModal";
import OpeningHoursStep1 from "@/components/tower/tiles/openingHours/steps/Step1";
import OpeningHoursStep2 from "@/components/tower/tiles/openingHours/steps/Step2";
import ParameterStep1 from "@/components/tower/tiles/parameters/edit/Step1";
import ParameterStep2 from "@/components/tower/tiles/parameters/edit/Step2";
import { ADMISSION_TARIFF_TYPES, ADMISSION_TYPES } from "@/constants/admission";
import { TOWER_TAG_DETAILS } from "@/constants/towerTags";
import { AdmissionType } from "@/types/Admission";
import {
    OpeningHours,
    OpeningHoursForbiddenType,
    OpeningHoursRange,
    OpeningHoursType,
} from "@/types/OpeningHours";
import { Tower, TowerContact } from "@/types/Tower";
import { TowerTag } from "@/types/TowerTags";
import { getCurrency } from "@/utils/currency";
import { editableParameters } from "@/utils/editableParameters";
import {
    createDefaultOpeningHoursRange,
    getOpeningHoursRanges,
    getOpeningHoursTypeFromRanges,
    getOpeningHoursValidationError,
    normalizeOpeningHours,
} from "@/utils/openingHours";
import { getTowerContactValidationError } from "@/utils/towerValidation";
import {
    findUrlWithSameDomain,
    getNormalizedHttpUrl,
    getUrlDomainFromInput,
    hasUrl,
} from "@/utils/url";

type EditSection =
    | "overview"
    | "parameters"
    | "openingHours"
    | "accessAndEquipment"
    | "admission"
    | "contact"
    | "sources";
type OpeningStep = "type" | "ranges";

type SuggestEditModalProps = {
    tower: Tower;
};

const sectionCards: { id: EditSection; title: string; text: string }[] = [
    {
        id: "parameters",
        title: "Základní údaje a parametry",
        text: "Název, typ, výška, schody, materiál, nadmořská výška nebo vlastník.",
    },
    {
        id: "openingHours",
        title: "Otevírací doba",
        text: "Stav přístupnosti, sezona, časy, detailní poznámka nebo oficiální odkaz.",
    },
    {
        id: "admission",
        title: "Vstupné",
        text: "Typ vstupného a základní tarify ve měně dané země.",
    },
    {
        id: "accessAndEquipment",
        title: "Přístup a vybavení",
        text: "Doprava, přístupnost, bezpečnostní upozornění a dostupné vybavení.",
    },
    {
        id: "contact",
        title: "Kontakt",
        text: "Telefon, e-mail a oficiální web provozovatele nebo místa.",
    },
    {
        id: "sources",
        title: "Odkazy a zdroje",
        text: "Oficiální web, databáze rozhleden nebo jiný veřejný zdroj.",
    },
];

const publicAdmissionTypes = ADMISSION_TYPES.filter(({ value }) => value !== AdmissionType.UNKNOWN);
const tagEditorGroups: { tags: TowerTag[]; title?: string }[] = [
    {
        tags: [
            TowerTag.HasTelescope,
            TowerTag.HasObservationBoards,
            TowerTag.IsNearTouristGuide,
        ],
    },
    {
        title: "Dostupnost",
        tags: [
            TowerTag.NeedToBorrowKey,
            TowerTag.NeedToBookVisit,
            TowerTag.SuitableForCyclists,
            TowerTag.HasParking,
            TowerTag.IsNearPublicTransport,
            TowerTag.WheelchairAccessible,
        ],
    },
    {
        title: "Zázemí",
        tags: [
            TowerTag.HasToilet,
            TowerTag.HasSnacks,
            TowerTag.HasRestaurant,
            TowerTag.HasWifi,
            TowerTag.CanPayByCard,
            TowerTag.HasShelter,
            TowerTag.HasBikeRepairStation,
            TowerTag.HasElectricCharger,
        ],
    },
    {
        title: "Bezpečnost",
        tags: [
            TowerTag.HasSlipperySurface,
            TowerTag.HasSteepStairs,
            TowerTag.HasSmallRailings,
            TowerTag.HasLadder,
        ],
    },
];

const getInitialAdmissionType = (tower: Tower) => {
    const currentType = tower.admission?.type;
    return currentType && currentType !== AdmissionType.UNKNOWN ? currentType : AdmissionType.FREE;
};

const hasOpeningHourRanges = (openingHours: OpeningHours) =>
    openingHours.type === OpeningHoursType.EveryMonth ||
    openingHours.type === OpeningHoursType.SomeMonths;

const normalizeContact = (contact?: TowerContact): TowerContact => ({
    email: contact?.email.trim() ?? "",
    officialWebsite: contact?.officialWebsite.trim() ?? "",
    phone: contact?.phone.trim() ?? "",
});

const areContactsEqual = (first?: TowerContact, second?: TowerContact) =>
    JSON.stringify(normalizeContact(first)) === JSON.stringify(normalizeContact(second));

const areTagsEqual = (first?: TowerTag[], second?: TowerTag[]) => {
    const firstTags = [...new Set(first ?? [])].sort();
    const secondTags = [...new Set(second ?? [])].sort();

    return (
        firstTags.length === secondTags.length &&
        firstTags.every((tag, index) => tag === secondTags[index])
    );
};

const getEditableParameter = (parameter: keyof Tower | "default") =>
    editableParameters.find((item) => item.name === parameter);

const getDateValue = (value: any) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toISOString().slice(0, 10);
};

const normalizeParameterValue = (value: any, parameter: keyof Tower | "default") => {
    const editableParameter = getEditableParameter(parameter);

    switch (editableParameter?.type) {
        case "array":
            return Array.isArray(value) ? value : [];
        case "date":
            return getDateValue(value);
        case "number":
            return value === "" || value == null ? null : Number(value);
        case "text":
            return typeof value === "string" ? value.trim() : value;
        default:
            return value;
    }
};

const areParameterValuesEqual = (
    oldValue: any,
    newValue: any,
    parameter: keyof Tower | "default"
) => {
    const editableParameter = getEditableParameter(parameter);
    const normalizedOldValue = normalizeParameterValue(oldValue, parameter);
    const normalizedNewValue = normalizeParameterValue(newValue, parameter);

    if (editableParameter?.type === "array") {
        const oldItems = [...normalizedOldValue].sort();
        const newItems = [...normalizedNewValue].sort();

        return (
            oldItems.length === newItems.length &&
            oldItems.every((item, index) => item === newItems[index])
        );
    }

    return normalizedOldValue === normalizedNewValue;
};

const SuggestEditModal = ({ tower }: SuggestEditModalProps) => {
    const [section, setSection] = useState<EditSection>("overview");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [parameter, setParameter] = useState<keyof Tower | "default">("default");
    const [parameterValue, setParameterValue] = useState<any>("");

    const [openingHours, setOpeningHours] = useState<OpeningHours>(tower.openingHours);
    const [openingStep, setOpeningStep] = useState<OpeningStep>("type");

    const [admissionType, setAdmissionType] = useState<AdmissionType>(
        getInitialAdmissionType(tower)
    );
    const [tariffes, setTariffes] = useState(tower.admission?.tariffes ?? {});

    const [contact, setContact] = useState<TowerContact>(normalizeContact(tower.contact));
    const [tags, setTags] = useState<TowerTag[]>(tower.tags ?? []);

    const [sourceUrl, setSourceUrl] = useState("");

    const resetFeedback = () => {
        setMessage(null);
        setError(null);
    };

    const selectSection = (nextSection: EditSection) => {
        resetFeedback();
        setSection(nextSection);
    };

    const resetAll = () => {
        setSection("overview");
        setMessage(null);
        setError(null);
        setLoading(false);
        setParameter("default");
        setParameterValue("");
        setOpeningHours(tower.openingHours);
        setOpeningStep("type");
        setAdmissionType(getInitialAdmissionType(tower));
        setTariffes(tower.admission?.tariffes ?? {});
        setContact(normalizeContact(tower.contact));
        setTags(tower.tags ?? []);
        setSourceUrl("");
    };

    const handleParameterSelect = (nextParameter: keyof Tower | "default") => {
        setParameter(nextParameter);
        setError(null);
        const currentValue = nextParameter === "default" ? "" : tower[nextParameter];
        setParameterValue(Array.isArray(currentValue) ? [...currentValue] : currentValue);
    };

    const handleParameterValueChange = (nextValue: any) => {
        setError(null);
        setParameterValue(nextValue);
    };

    const validateParameter = () => {
        const editableParameter = getEditableParameter(parameter);
        const normalizedValue = normalizeParameterValue(parameterValue, parameter);

        if (parameter === "default") return "Vyberte údaj, který chcete upravit.";
        if (!editableParameter) return "Vybraný údaj nelze upravit.";

        if (editableParameter.type === "text" && !normalizedValue) {
            return "Zadejte novou hodnotu.";
        }

        if (
            editableParameter.type === "number" &&
            (normalizedValue == null || !Number.isFinite(normalizedValue) || normalizedValue < 0)
        ) {
            return "Zadejte platné nezáporné číslo.";
        }

        if (editableParameter.type === "date" && !normalizedValue) {
            return "Zadejte platné datum.";
        }

        if (editableParameter.type === "select") {
            const isValidOption = editableParameter.typeOptions?.some((option) =>
                typeof option === "string"
                    ? option === normalizedValue
                    : option.value === normalizedValue
            );

            if (!isValidOption) return "Vyberte platnou hodnotu.";
        }

        if (editableParameter.type === "array") {
            const isValidArray =
                Array.isArray(normalizedValue) &&
                normalizedValue.length > 0 &&
                normalizedValue.every((value) => editableParameter.typeOptions?.includes(value));

            if (!isValidArray) return "Vyberte alespoň jednu platnou možnost.";
        }

        if (areParameterValuesEqual(tower[parameter], parameterValue, parameter)) {
            return "Nová hodnota se musí lišit od stávající.";
        }

        return null;
    };

    const submitParameter = async () => {
        const validationError = validateParameter();
        if (validationError) {
            setError(validationError);
            return;
        }

        const editableParameter = getEditableParameter(parameter);
        const newValue = normalizeParameterValue(parameterValue, parameter);

        setLoading(true);
        setError(null);
        try {
            await createChange({
                tower_id: tower.id,
                field: parameter as keyof Tower,
                type: editableParameter?.type || "text",
                old_value: tower[parameter as keyof Tower],
                new_value: newValue,
            });
            setMessage("Návrh úpravy parametru byl odeslán ke schválení.");
            setParameter("default");
            setParameterValue("");
            setSection("overview");
        } catch (submitError: any) {
            setError(submitError?.message ?? "Návrh se nepodařilo odeslat.");
        }
        setLoading(false);
    };

    const handleOpeningTypeChange = (type: OpeningHoursType) => {
        setOpeningHours((old) => {
            const isRangeType =
                type === OpeningHoursType.EveryMonth || type === OpeningHoursType.SomeMonths;

            if (old.type === type || (isRangeType && hasOpeningHourRanges(old))) {
                return old;
            }

            if (isRangeType) {
                const defaultRange = createDefaultOpeningHoursRange();

                return {
                    type: getOpeningHoursTypeFromRanges([defaultRange]),
                    ranges: [defaultRange],
                };
            }

            return {
                type,
                ...(type === OpeningHoursType.NonStop ? { isLockedAtNight: false } : {}),
            };
        });
    };

    const moveOpeningNext = () => {
        setError(null);

        if (openingStep === "type") {
            setOpeningStep("ranges");
            return;
        }

        const validationError = getOpeningHoursValidationError(openingHours);
        if (validationError) {
            setError(validationError);
            return;
        }

        void submitOpeningHours();
    };

    const moveOpeningBack = () => {
        setError(null);
        setOpeningStep("type");
    };

    const submitOpeningHours = async () => {
        if (
            openingHours.type === OpeningHoursType.Forbidden &&
            (openingHours.forbiddenType === undefined || openingHours.forbiddenType === null)
        ) {
            setError("Vyberte typ uzavření.");
            return;
        }

        const newOpeningHours = normalizeOpeningHours(openingHours);
        const validationError = getOpeningHoursValidationError(newOpeningHours);
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await createChange({
                tower_id: tower.id,
                field: "openingHours",
                type: "object",
                old_value: tower.openingHours,
                new_value: newOpeningHours,
            });
            setMessage("Návrh úpravy otevírací doby byl odeslán ke schválení.");
            setOpeningHours(tower.openingHours);
            setOpeningStep("type");
            setSection("overview");
        } catch {
            setError("Návrh se nepodařilo odeslat.");
        }
        setLoading(false);
    };

    const submitAdmission = async () => {
        setLoading(true);
        setError(null);
        try {
            await createChange({
                tower_id: tower.id,
                field: "admission",
                type: "object",
                old_value: tower.admission,
                new_value: {
                    type: admissionType,
                    tariffes,
                },
            });
            setMessage("Návrh úpravy vstupného byl odeslán ke schválení.");
            setSection("overview");
        } catch {
            setError("Návrh se nepodařilo odeslat.");
        }
        setLoading(false);
    };

    const submitContact = async () => {
        const newContact = normalizeContact(contact);
        const validationError = getTowerContactValidationError(newContact);
        if (validationError) {
            setError(validationError);
            return;
        }
        if (areContactsEqual(tower.contact, newContact)) {
            setError("Kontaktní údaje se musí lišit od stávajících.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await createChange({
                tower_id: tower.id,
                field: "contact",
                type: "object",
                old_value: normalizeContact(tower.contact),
                new_value: newContact,
            });
            setMessage("Návrh úpravy kontaktu byl odeslán ke schválení.");
            setContact(normalizeContact(tower.contact));
            setSection("overview");
        } catch (submitError: any) {
            setError(submitError?.message ?? "Návrh se nepodařilo odeslat.");
        }
        setLoading(false);
    };

    const submitTags = async () => {
        if (areTagsEqual(tower.tags, tags)) {
            setError("Vybrané tagy se musí lišit od stávajících.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await createChange({
                tower_id: tower.id,
                field: "tags",
                type: "array",
                old_value: tower.tags ?? [],
                new_value: tags,
            });
            setMessage("Návrh úpravy přístupu a vybavení byl odeslán ke schválení.");
            setTags(tower.tags ?? []);
            setSection("overview");
        } catch (submitError: any) {
            setError(submitError?.message ?? "Návrh se nepodařilo odeslat.");
        }
        setLoading(false);
    };

    const getSourceValidationError = () => {
        const normalizedUrl = getNormalizedHttpUrl(sourceUrl);
        const currentUrls = tower.urls ?? [];

        if (!sourceUrl.trim()) return "Zadejte odkaz, který chcete přidat.";
        if (!normalizedUrl) return "Zadejte platnou URL adresu začínající http:// nebo https://.";
        if (hasUrl(currentUrls, normalizedUrl)) return "Tento odkaz už je u rozhledny přidaný.";

        return null;
    };

    const submitSource = async () => {
        const validationError = getSourceValidationError();
        if (validationError) {
            setError(validationError);
            return;
        }

        const currentUrls = tower.urls ?? [];
        const normalizedUrl = getNormalizedHttpUrl(sourceUrl);
        if (!normalizedUrl) return;

        setLoading(true);
        setError(null);
        try {
            await createChange({
                tower_id: tower.id,
                field: "urls",
                type: "array",
                old_value: currentUrls,
                new_value: [...currentUrls, normalizedUrl],
            });
            setMessage("Návrh přidání odkazu byl odeslán ke schválení.");
            setSourceUrl("");
            setSection("overview");
        } catch (submitError: any) {
            setError(submitError?.message ?? "Návrh se nepodařilo odeslat.");
        }
        setLoading(false);
    };

    const renderOverview = () => (
        <div className="grid gap-3 md:grid-cols-2">
            {sectionCards.map((card) => (
                <button
                    key={card.id}
                    type="button"
                    className="cursor-pointer rounded-lg border border-base-300/80 bg-base-200/35 p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/60 hover:bg-base-200"
                    onClick={() => selectSection(card.id)}
                >
                    <span className="block font-semibold text-base-content">{card.title}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-base-content/65">
                        {card.text}
                    </span>
                </button>
            ))}
        </div>
    );

    const renderParameters = () => (
        <div className="space-y-5">
            <ParameterStep1
                selectedParameter={parameter}
                setParameter={handleParameterSelect}
                tower={tower}
            />
            {parameter !== "default" ? (
                <div className="rounded-lg border border-base-300/70 bg-base-200/30 p-4">
                    <ParameterStep2
                        newValue={parameterValue}
                        setNewValue={handleParameterValueChange}
                        parameter={parameter}
                        tower={tower}
                    />
                </div>
            ) : null}
        </div>
    );

    const renderOpeningHours = () => (
        <div className="space-y-5">
            {openingStep === "type" ? (
                <OpeningHoursStep1
                    currentType={openingHours.type}
                    detailText={openingHours.detailText ?? ""}
                    detailUrl={openingHours.detailUrl ?? ""}
                    forbiddenType={openingHours.forbiddenType}
                    isLockedAtNight={Boolean(openingHours.isLockedAtNight)}
                    handleDetailTextChange={(detailText) =>
                        setOpeningHours((old) => ({ ...old, detailText }))
                    }
                    handleDetailUrlChange={(detailUrl) =>
                        setOpeningHours((old) => ({ ...old, detailUrl }))
                    }
                    handleForbiddenTypeChange={(forbiddenType: OpeningHoursForbiddenType) =>
                        setOpeningHours((old) => ({ ...old, forbiddenType }))
                    }
                    handleTypeChange={handleOpeningTypeChange}
                    handleIsLockedAtNightChange={(isLockedAtNight) =>
                        setOpeningHours((old) => ({ ...old, isLockedAtNight }))
                    }
                    setErrorText={setError}
                />
            ) : null}

            {openingStep === "ranges" ? (
                <OpeningHoursStep2
                    ranges={getOpeningHoursRanges(openingHours)}
                    detailText={openingHours.detailText ?? ""}
                    detailUrl={openingHours.detailUrl ?? ""}
                    handleDetailTextChange={(detailText) =>
                        setOpeningHours((old) => ({ ...old, detailText }))
                    }
                    handleDetailUrlChange={(detailUrl) =>
                        setOpeningHours((old) => ({ ...old, detailUrl }))
                    }
                    handleRangesChange={(ranges: OpeningHoursRange[]) =>
                        setOpeningHours((old) => ({
                            ...old,
                            ranges,
                            type: getOpeningHoursTypeFromRanges(ranges),
                        }))
                    }
                    setErrorText={setError}
                />
            ) : null}
        </div>
    );

    const renderAdmission = () => (
        <div className="space-y-5">
            <div className="mb-5 w-full">
                <label htmlFor="suggest-admission-type" className="label-text mb-2 block">
                    Typ vstupného
                </label>
                <select
                    id="suggest-admission-type"
                    className="select select-bordered w-full"
                    value={admissionType}
                    onChange={(event) => setAdmissionType(event.target.value as AdmissionType)}
                >
                    {publicAdmissionTypes.map(({ label, value }) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            {admissionType === AdmissionType.PAID ? (
                <div className="rounded-lg border border-base-300/70 bg-base-200/30 p-4">
                    <div className="mb-3 text-sm text-base-content/65">
                        Ceny jsou pro tuto oblast ve měně {getCurrency(tower.country).code}.
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {ADMISSION_TARIFF_TYPES.map(({ label, value }) => (
                            <label key={value} className="form-control">
                                <span className="label-text mb-1">{label}</span>
                                <input
                                    type="number"
                                    className="input input-bordered"
                                    value={tariffes[value]?.price || ""}
                                    min={0}
                                    onChange={(event) =>
                                        setTariffes((oldTariffes) => ({
                                            ...oldTariffes,
                                            [value]: {
                                                ...oldTariffes[value],
                                                price: Number(event.target.value),
                                            },
                                        }))
                                    }
                                />
                            </label>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );

    const renderContact = () => (
        <div className="grid gap-4">
            <label className="form-control">
                <span className="label-text mb-1">Telefon</span>
                <input
                    type="tel"
                    className="input input-bordered w-full"
                    placeholder="+420 123 456 789"
                    value={contact.phone}
                    onChange={(event) => {
                        setContact((oldContact) => ({ ...oldContact, phone: event.target.value }));
                        setError(null);
                    }}
                />
            </label>
            <label className="form-control">
                <span className="label-text mb-1">E-mail</span>
                <input
                    type="email"
                    className="input input-bordered w-full"
                    placeholder="info@example.cz"
                    value={contact.email}
                    onChange={(event) => {
                        setContact((oldContact) => ({ ...oldContact, email: event.target.value }));
                        setError(null);
                    }}
                />
            </label>
            <label className="form-control">
                <span className="label-text mb-1">Oficiální web</span>
                <input
                    type="url"
                    className="input input-bordered w-full"
                    placeholder="https://example.cz"
                    value={contact.officialWebsite}
                    onChange={(event) => {
                        setContact((oldContact) => ({
                            ...oldContact,
                            officialWebsite: event.target.value,
                        }));
                        setError(null);
                    }}
                />
            </label>
        </div>
    );

    const renderAccessAndEquipment = () => (
        <div className="space-y-5">
            {tagEditorGroups.map(({ tags: groupTags, title }) => {
                return (
                    <section
                        key={title ?? "basic"}
                        className="rounded-lg border border-base-300/70 bg-base-200/30 p-4"
                    >
                        {title ? <h3 className="font-semibold">{title}</h3> : null}
                        <div className={title ? "mt-3 grid gap-2 sm:grid-cols-2" : "grid gap-2 sm:grid-cols-2"}>
                            {groupTags.map((tag) => {
                                const { Icon, label } = TOWER_TAG_DETAILS[tag];

                                return (
                                    <label
                                        key={tag}
                                        className="label cursor-pointer justify-start gap-3 rounded-lg px-2 py-2 hover:bg-base-100"
                                    >
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-primary"
                                            checked={tags.includes(tag)}
                                            onChange={(event) => {
                                                setTags((oldTags) =>
                                                    event.target.checked
                                                        ? [...oldTags, tag]
                                                        : oldTags.filter((oldTag) => oldTag !== tag)
                                                );
                                                setError(null);
                                            }}
                                        />
                                        <Icon className="size-4 shrink-0 text-primary" />
                                        <span className="label-text">{label}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </section>
                );
            })}
        </div>
    );

    const renderSources = () => {
        const currentUrls = tower.urls ?? [];
        const sameDomainUrl = findUrlWithSameDomain(currentUrls, sourceUrl);
        const normalizedUrl = getNormalizedHttpUrl(sourceUrl);
        const sourceDomain = getUrlDomainFromInput(sourceUrl);
        const showDomainWarning = Boolean(
            sourceUrl.trim() &&
            sourceDomain &&
            sameDomainUrl &&
            (!normalizedUrl || !hasUrl(currentUrls, normalizedUrl))
        );

        return (
            <div className="space-y-5">
                <div className="mb-5 w-full">
                    <label htmlFor="suggest-source-url" className="label-text mb-2 block">
                        Nový odkaz
                    </label>
                    <input
                        id="suggest-source-url"
                        type="url"
                        className="input input-bordered w-full"
                        placeholder="https://example.cz/rozhledna"
                        value={sourceUrl}
                        onChange={(event) => {
                            setSourceUrl(event.target.value);
                            setError(null);
                        }}
                    />
                </div>

                {showDomainWarning ? (
                    <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning-content">
                        Už existuje odkaz ze stejné domény {sourceDomain}. Zkontrolujte, jestli
                        nejde o stejný zdroj.
                    </div>
                ) : null}

                {currentUrls.length ? (
                    <div className="rounded-lg border border-base-300/70 bg-base-200/30 p-4">
                        <div className="mb-3 text-sm font-semibold text-base-content/70">
                            Aktuální odkazy
                        </div>
                        <ul className="space-y-2 text-sm text-base-content/70">
                            {currentUrls.map((url) => (
                                <li key={url} className="break-all">
                                    {url}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </div>
        );
    };

    const primaryAction = () => {
        if (section === "parameters") {
            const parameterValidationError = validateParameter();

            return {
                label: loading ? (
                    <span className="loading loading-spinner loading-sm" />
                ) : (
                    "Odeslat návrh"
                ),
                onClick: submitParameter,
                className: "btn-primary",
                disabled: loading || Boolean(parameterValidationError),
            };
        }

        if (section === "openingHours") {
            const shouldContinueToRanges =
                openingStep === "type" && hasOpeningHourRanges(openingHours);

            return {
                label: loading ? (
                    <span className="loading loading-spinner loading-sm" />
                ) : shouldContinueToRanges ? (
                    "Pokračovat"
                ) : (
                    "Odeslat návrh"
                ),
                onClick: shouldContinueToRanges ? moveOpeningNext : submitOpeningHours,
                className: "btn-primary",
                disabled: loading,
            };
        }

        if (section === "admission") {
            return {
                label: loading ? (
                    <span className="loading loading-spinner loading-sm" />
                ) : (
                    "Odeslat návrh"
                ),
                onClick: submitAdmission,
                className: "btn-primary",
                disabled: loading,
            };
        }

        if (section === "contact") {
            return {
                label: loading ? <span className="loading loading-spinner loading-sm" /> : "Odeslat návrh",
                onClick: submitContact,
                className: "btn-primary",
                disabled: loading || areContactsEqual(tower.contact, contact),
            };
        }

        if (section === "accessAndEquipment") {
            return {
                label: loading ? <span className="loading loading-spinner loading-sm" /> : "Odeslat návrh",
                onClick: submitTags,
                className: "btn-primary",
                disabled: loading || areTagsEqual(tower.tags, tags),
            };
        }

        if (section === "sources") {
            return {
                label: loading ? (
                    <span className="loading loading-spinner loading-sm" />
                ) : (
                    "Odeslat návrh"
                ),
                onClick: submitSource,
                className: "btn-primary",
                disabled: loading || !sourceUrl.trim(),
            };
        }

        return null;
    };

    const actions = primaryAction();

    return (
        <TowerModal
            id="suggest_edit_modal"
            title="Navrhnout úpravu údajů"
            description={`Všechny návrhy pro ${tower.name} pošleme ke schválení administrátorovi.`}
            onClose={resetAll}
            actions={actions ? [actions] : []}
            showCloseAction={section === "overview"}
            leadingActions={
                section === "overview"
                    ? []
                    : [
                          {
                              label:
                                  openingStep === "ranges" && section === "openingHours"
                                      ? "Zpět"
                                      : "Zpět na přehled",
                              onClick:
                                  section === "openingHours" && openingStep === "ranges"
                                      ? moveOpeningBack
                                      : () => selectSection("overview"),
                              className: "btn-outline btn-primary",
                              disabled: loading,
                          },
                      ]
            }
        >
            <div className="space-y-5">
                {message ? (
                    <div className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                        {message}
                    </div>
                ) : null}
                {error ? (
                    <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
                        {error}
                    </div>
                ) : null}

                {section === "overview" ? renderOverview() : null}
                {section === "parameters" ? renderParameters() : null}
                {section === "openingHours" ? renderOpeningHours() : null}
                {section === "admission" ? renderAdmission() : null}
                {section === "contact" ? renderContact() : null}
                {section === "accessAndEquipment" ? renderAccessAndEquipment() : null}
                {section === "sources" ? renderSources() : null}
            </div>
        </TowerModal>
    );
};

export default SuggestEditModal;
