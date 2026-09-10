"use client";

import { Check, Copy, QrCode, Share2 } from "lucide-react";
import Image from "next/image";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

import {
    createSupportPaymentPayload,
    SUPPORT_ACCOUNT,
    SUPPORT_AMOUNTS,
    SUPPORT_IBAN_FORMATTED,
    SUPPORT_MAX_AMOUNT,
} from "@/constants/support";
import { createShareableQrFile } from "@/utils/shareQrCode";

const DEFAULT_AMOUNT = SUPPORT_AMOUNTS[1];

function SupportPayment() {
    const [amount, setAmount] = useState<number>(DEFAULT_AMOUNT);
    const [customAmount, setCustomAmount] = useState("");
    const [qrCode, setQrCode] = useState("");
    const [qrError, setQrError] = useState(false);
    const [accountCopied, setAccountCopied] = useState(false);
    const [shareData, setShareData] = useState<{ amount: number; file: File } | null>(null);
    const [shareError, setShareError] = useState(false);

    useEffect(() => {
        let isCurrent = true;
        setShareData(null);
        setShareError(false);

        QRCode.toDataURL(createSupportPaymentPayload(amount), {
            width: 320,
            margin: 2,
            errorCorrectionLevel: "M",
            color: {
                dark: "#10271b",
                light: "#ffffff",
            },
        })
            .then(async (dataUrl) => {
                if (!isCurrent) return;

                setQrCode(dataUrl);
                setQrError(false);

                if (
                    typeof navigator.share !== "function" ||
                    typeof navigator.canShare !== "function"
                )
                    return;

                try {
                    const file = await createShareableQrFile(dataUrl, `qr-platba-${amount}-kc.png`);

                    if (isCurrent && navigator.canShare({ files: [file] })) {
                        setShareData({ amount, file });
                    }
                } catch {
                    setShareData(null);
                }
            })
            .catch(() => {
                if (!isCurrent) return;

                setQrError(true);
            });

        return () => {
            isCurrent = false;
        };
    }, [amount]);

    const selectPreset = (selectedAmount: number) => {
        setAmount(selectedAmount);
        setCustomAmount("");
    };

    const selectCustomAmount = (value: string) => {
        setCustomAmount(value);

        const parsedAmount = Number(value);
        if (
            Number.isInteger(parsedAmount) &&
            parsedAmount >= 1 &&
            parsedAmount <= SUPPORT_MAX_AMOUNT
        ) {
            setAmount(parsedAmount);
        }
    };

    const shareQrCode = async () => {
        if (shareData?.amount !== amount || typeof navigator.share !== "function") return;

        try {
            await navigator.share({
                files: [shareData.file],
                title: "QR platba pro Rozhlednový svět",
                text: `QR platba ve výši ${amount} Kč na podporu Rozhlednového světa.`,
            });
            setShareError(false);
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") return;
            setShareError(true);
        }
    };

    const copyAccount = async () => {
        try {
            await navigator.clipboard.writeText(SUPPORT_ACCOUNT);
            setAccountCopied(true);
            window.setTimeout(() => setAccountCopied(false), 1800);
        } catch {
            setAccountCopied(false);
        }
    };

    const hasValidCustomAmount =
        customAmount === "" ||
        (Number.isInteger(Number(customAmount)) &&
            Number(customAmount) >= 1 &&
            Number(customAmount) <= SUPPORT_MAX_AMOUNT);

    return (
        <section
            id="qr-platba"
            aria-labelledby="payment-heading"
            className="grid overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-xl shadow-base-content/5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]"
            style={{ scrollMarginTop: "5rem" }}
        >
            <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
                <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-content">
                    <QrCode aria-hidden="true" size={26} />
                </div>
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-primary">
                    QR platba
                </p>
                <h2 id="payment-heading" className="text-3xl font-bold sm:text-4xl">
                    Vyberte částku
                </h2>
                <p className="mt-3 max-w-xl text-base leading-7 text-base-content/70">
                    Zvolte jednu z možností nebo zadejte vlastní částku. QR kód se přepočítá
                    okamžitě a platbu potom dokončíte ve své bankovní aplikaci.
                </p>

                <div className="mt-7 grid grid-cols-3 gap-2" aria-label="Doporučené částky">
                    {SUPPORT_AMOUNTS.map((preset) => (
                        <button
                            key={preset}
                            type="button"
                            onClick={() => selectPreset(preset)}
                            className={`btn h-12 rounded-lg ${
                                amount === preset && customAmount === ""
                                    ? "btn-primary"
                                    : "btn-outline border-base-300"
                            }`}
                            aria-pressed={amount === preset && customAmount === ""}
                        >
                            {preset} Kč
                        </button>
                    ))}
                </div>

                <label className="mt-5 block" htmlFor="support-custom-amount">
                    <span className="mb-2 block text-sm font-semibold">Vlastní částka</span>
                    <span className="input input-bordered flex h-12 w-full items-center gap-2 rounded-lg bg-base-100 focus-within:outline-2 focus-within:outline-primary">
                        <input
                            id="support-custom-amount"
                            type="number"
                            min={1}
                            max={SUPPORT_MAX_AMOUNT}
                            step={1}
                            inputMode="numeric"
                            value={customAmount}
                            onChange={(event) => selectCustomAmount(event.target.value)}
                            className="grow"
                            placeholder="Například 150"
                            aria-invalid={!hasValidCustomAmount}
                            aria-describedby="support-amount-hint"
                        />
                        <span className="font-semibold text-base-content/60">Kč</span>
                    </span>
                    <span
                        id="support-amount-hint"
                        className={`mt-2 block text-xs ${
                            hasValidCustomAmount ? "text-base-content/55" : "text-error"
                        }`}
                    >
                        {hasValidCustomAmount
                            ? "Celé koruny."
                            : "Zadejte kladnou částku v celých korunách."}
                    </span>
                </label>

                <div className="mt-7 border-t border-base-300 pt-6">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-base-content/50">
                        Bankovní převod
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                        <span className="font-mono text-lg font-bold">{SUPPORT_ACCOUNT}</span>
                        <button
                            type="button"
                            onClick={copyAccount}
                            className="btn btn-ghost btn-sm rounded-lg"
                            aria-label="Zkopírovat číslo účtu"
                            title="Zkopírovat číslo účtu"
                        >
                            {accountCopied ? (
                                <Check aria-hidden="true" size={17} />
                            ) : (
                                <Copy aria-hidden="true" size={17} />
                            )}
                            {accountCopied ? "Zkopírováno" : "Kopírovat"}
                        </button>
                    </div>
                    <p className="mt-1 text-sm text-base-content/55">
                        IBAN {SUPPORT_IBAN_FORMATTED}
                    </p>
                </div>
            </div>

            <div className="flex min-h-107.5 flex-col items-center justify-center bg-primary px-6 py-10 text-primary-content sm:px-10">
                <div className="w-full max-w-[320px] rounded-lg bg-white p-4 shadow-2xl shadow-black/20">
                    {qrError ? (
                        <div
                            role="alert"
                            className="flex aspect-square items-center justify-center p-6 text-center text-sm text-neutral"
                        >
                            QR kód se nepodařilo vytvořit. Použijte prosím číslo účtu.
                        </div>
                    ) : qrCode ? (
                        <Image
                            src={qrCode}
                            alt={`QR platba ve výši ${amount} Kč na podporu Rozhlednového světa`}
                            width={320}
                            height={320}
                            unoptimized
                            className="aspect-square h-auto w-full"
                        />
                    ) : (
                        <div
                            className="skeleton aspect-square w-full"
                            aria-label="Vytvářím QR kód"
                        />
                    )}
                </div>
                <p className="mt-5 text-center text-sm text-primary-content/75">Aktuální částka</p>
                <p className="text-center text-3xl font-bold" aria-live="polite">
                    {amount.toLocaleString("cs-CZ")} Kč
                </p>
                {shareData?.amount === amount ? (
                    <button
                        type="button"
                        onClick={shareQrCode}
                        className="btn mt-5 rounded-lg border-primary-content/35 bg-primary-content text-primary shadow-lg shadow-black/10 md:hidden"
                    >
                        <Share2 aria-hidden="true" size={18} />
                        Sdílet QR kód
                    </button>
                ) : null}
                {shareError ? (
                    <p className="mt-3 text-center text-sm text-primary-content" role="alert">
                        QR kód se nepodařilo sdílet. Zkuste to prosím znovu.
                    </p>
                ) : null}
                <p className="mt-3 max-w-xs text-center text-sm leading-6 text-primary-content/70">
                    Před potvrzením vždy zkontrolujte částku a příjemce v bankovní aplikaci.
                </p>
            </div>
        </section>
    );
}

export default SupportPayment;
