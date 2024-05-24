import { signIn, providerMap } from "@/auth";
import Image from "next/image";

export default async function SignInPage() {
    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                <div className="card-body">
                    <div className="flex w-full justify-center mb-10 mt-5">
                        <Image src="/img/logo.png" alt="Logo" width={100} height={100} />
                    </div>
                    <div className="flex flex-col gap-2">
                        {Object.values(providerMap).map((provider) => (
                            <form
                                key={provider.id}
                                action={async () => {
                                    "use server";
                                    await signIn(provider.id);
                                }}
                                className="w-full"
                            >
                                <button type="submit" className="btn btn-primary w-full text-md">
                                    {provider.name === "Google" && (
                                        <svg fill="currentColor" height="20px" width="20px" version="1.1" id="Capa_1" viewBox="0 0 210 210">
                                            <path d="M0,105C0,47.103,47.103,0,105,0c23.383,0,45.515,7.523,64.004,21.756l-24.4,31.696C133.172,44.652,119.477,40,105,40  c-35.841,0-65,29.159-65,65s29.159,65,65,65c28.867,0,53.398-18.913,61.852-45H105V85h105v20c0,57.897-47.103,105-105,105  S0,162.897,0,105z" />
                                        </svg>
                                    )}
                                    <span>Sign in with {provider.name}</span>
                                </button>
                            </form>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
