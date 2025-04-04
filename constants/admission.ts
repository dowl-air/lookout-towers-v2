import { AdmissionType } from "@/types/Admission";

export const ADMISSION_TYPES = [
    { value: AdmissionType.UNKNOWN, label: "Neznámé", description: "Vstupné není známé." },
    { value: AdmissionType.FREE, label: "Bezplatný vstup", description: "Vstupné je zdarma." },
    { value: AdmissionType.PAID, label: "Zpoplatněno", description: "Vstupné je zpoplatněno." },
    { value: AdmissionType.DONATION, label: "Dobrovolný příspěvek", description: "Vstupné je za dobrovolný příspěvek." },
];

export const getAdmissionTypeDescription = (type: string) => {
    const admissionType = ADMISSION_TYPES.find((admission) => admission.value === type);
    return admissionType ? admissionType.description : "Vstupné není známé.";
};

export const getAdmissionTypeLabel = (type: string) => {
    const admissionType = ADMISSION_TYPES.find((admission) => admission.value === type);
    return admissionType ? admissionType.label : "Neznámé";
};

export const ADMISSION_TARIFF_TYPES = [
    { value: "adult", label: "Dospělý" },
    { value: "child", label: "Dítě" },
    { value: "student", label: "Student" },
    { value: "senior", label: "Senior" },
    { value: "family", label: "Rodina" },
];

export const getAdmissionTariffTypeLabel = (type: string) => {
    const admissionTariffType = ADMISSION_TARIFF_TYPES.find((admission) => admission.value === type);
    return admissionTariffType ? admissionTariffType.label : "Neznámý";
};
