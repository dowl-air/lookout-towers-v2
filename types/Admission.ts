export enum AdmissionType {
    UNKNOWN = "unknown",
    FREE = "free",
    PAID = "paid",
    DONATION = "donation",
}

export enum AdmissionTariffType {
    ADULT = "adult",
    CHILD = "child",
    STUDENT = "student",
    SENIOR = "senior",
    FAMILY = "family",
}

export type Admission = {
    type: AdmissionType;
    tariffes: {
        [key in AdmissionTariffType]?: {
            price: number;
        };
    };
    modified?: string;
};
