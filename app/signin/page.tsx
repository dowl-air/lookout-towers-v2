"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
    const [providers, setProviders] = useState<unknown>({});
    const [callbackUrl, setCallbackUrl] = useState<string>("/profil");
    const searchParams = useSearchParams();

    useEffect(() => {
        async function loadProviders() {
            const authProviders = await getProviders();
            setProviders(authProviders);
        }
        loadProviders();
    }, []);

    useEffect(() => {
        if (searchParams) {
            const callbackUrl = searchParams.get("callbackUrl");
            if (callbackUrl) setCallbackUrl(callbackUrl);
        }
    }, [searchParams]);

    return (
        <main className="flex flex-col items-center md:justify-center h-screen">
            <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 mt-12 md:mt-0">
                <div className="card-body">
                    <div className="flex w-full justify-center mb-5 mt-5">
                        <Image src="/img/logo.png" alt="Logo" width={100} height={100} />
                    </div>
                    <h1 className="font-bold text-2xl md:text-3xl mb-10 text-center">Rozhlednový svět</h1>
                    <div className="flex flex-col gap-2">
                        {Object.values(providers).map((provider) => (
                            <button
                                type="submit"
                                key={provider.id}
                                className="btn btn-primary w-full text-md"
                                onClick={() => signIn(provider.id, { callbackUrl })}
                            >
                                {provider.name === "Google" && (
                                    <svg fill="currentColor" height="20px" width="20px" viewBox="0 0 210 210">
                                        <path d="M0,105C0,47.103,47.103,0,105,0c23.383,0,45.515,7.523,64.004,21.756l-24.4,31.696C133.172,44.652,119.477,40,105,40  c-35.841,0-65,29.159-65,65s29.159,65,65,65c28.867,0,53.398-18.913,61.852-45H105V85h105v20c0,57.897-47.103,105-105,105  S0,162.897,0,105z" />
                                    </svg>
                                )}
                                {provider.name === "Seznam.cz" && (
                                    <svg fill="currentColor" width="20px" height="20px" viewBox="0 0 36 36">
                                        <path d="M1.787 36c6.484 0 32.915-3.09 32.915-11.363 0-5.04-6.752-7.444-9.526-8.25-5.286-1.533-9.574-3.115-9.574-4.502 0-1.386 3.004-1.677 6.229-2.39 4.295-.95 6.102-1.474 6.102-3.758 0-1.488-1.143-3.304-1.724-4.086C25.195.288 25.034 0 24.703 0c-.716 0-.15.927-8.231 2.29-5.119.863-11.932 3.168-11.932 7.836 0 4.667 6.092 6.833 12.192 9.041 6.286 2.275 11.542 3.106 11.542 6.735 0 5.788-24.84 9.441-26.45 9.709-.753.125-.63.389-.038.389z" />
                                    </svg>
                                )}
                                <span className="ml-2">Přihlásit se pomocí {provider.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
