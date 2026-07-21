import type { Tower } from "@/types/Tower";
import { getOpeningHoursValidationError } from "@/utils/openingHours";

const isValidUrl = (value: string) => {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};

export const getTowerContactValidationError = (contact: Tower["contact"]): string | null => {
    if (contact?.officialWebsite && !isValidUrl(contact.officialWebsite)) {
        return "Oficiální web musí být platná HTTP nebo HTTPS URL.";
    }
    if (contact?.email && !/^\S+@\S+\.\S+$/.test(contact.email)) {
        return "E-mailová adresa nemá platný formát.";
    }

    return null;
};

export const getTowerValidationError = (tower: Partial<Tower>, photosCount?: number) => {
    if (!tower.name?.trim() || !tower.type || !tower.country || !tower.gps) {
        return "Vyplňte prosím všechna povinná pole.";
    }
    if (photosCount !== undefined && photosCount === 0) {
        return "Nahrajte alespoň jednu fotografii.";
    }
    if (
        tower.gps.latitude < -90 ||
        tower.gps.latitude > 90 ||
        tower.gps.longitude < -180 ||
        tower.gps.longitude > 180
    ) {
        return "Zadejte prosím platné GPS souřadnice.";
    }
    if (
        (tower.height ?? 0) < 0 ||
        (tower.viewHeight ?? 0) < 0 ||
        (tower.observationDecksCount ?? 0) < 0 ||
        (tower.stairs ?? 0) < 0
    ) {
        return "Zadejte prosím kladné hodnoty pro výšku, počet plošin a schodů.";
    }
    if ((tower.elevation ?? 0) < -500) {
        return "Zadejte prosím platnou nadmořskou výšku.";
    }
    if (tower.material && tower.material.length === 0) {
        return "Vyberte alespoň jeden materiál.";
    }
    if (tower.opened) {
        const openedTimestamp = new Date(tower.opened).getTime();
        if (Number.isNaN(openedTimestamp) || openedTimestamp > Date.now()) {
            return "Zadejte prosím platné datum zpřístupnění.";
        }
    }
    if (tower.urls?.some((url) => !isValidUrl(url))) {
        return "Každý odkaz musí být platná HTTP nebo HTTPS URL.";
    }
    const contactValidationError = getTowerContactValidationError(tower.contact);
    if (contactValidationError) return contactValidationError;
    if (tower.admission) {
        const invalidTariff = Object.values(tower.admission.tariffes).some(
            (tariff) => !Number.isFinite(tariff?.price) || tariff.price < 0
        );
        if (invalidTariff) return "Ceník vstupného obsahuje neplatnou cenu.";
    }
    if (tower.openingHours) {
        const openingHoursError = getOpeningHoursValidationError(tower.openingHours);
        if (openingHoursError) return openingHoursError;
    }

    return null;
};
