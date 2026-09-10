export const SUPPORT_ACCOUNT = "2900621338/2010";
export const SUPPORT_IBAN = "CZ1720100000002900621338";
export const SUPPORT_IBAN_FORMATTED = "CZ17 2010 0000 0029 0062 1338";
export const SUPPORT_MESSAGE = "Podpora Rozhlednoveho sveta";
export const SUPPORT_AMOUNTS = [50, 100, 250] as const;
export const SUPPORT_MAX_AMOUNT = 100_000;

export const createSupportPaymentPayload = (amount: number) =>
    `SPD*1.0*ACC:${SUPPORT_IBAN}*AM:${amount.toFixed(2)}*CC:CZK*MSG:${SUPPORT_MESSAGE}`;
