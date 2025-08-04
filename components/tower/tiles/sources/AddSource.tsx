"use client";

import { createChange } from "@/actions/changes/change.create";
import { checkAuth } from "@/actions/checkAuth";
import { Tower } from "@/types/Tower";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AddSource = ({ tower }: { tower: Tower }) => {
    const [url, setUrl] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleAddSource = async () => {
        if (!(await checkAuth())) {
            return router.push("/signin");
        }
        if (url.length > 5 && url.startsWith("http")) {
            setLoading(true);

            await createChange({
                field: "urls",
                tower_id: tower.id,
                type: "array",
                old_value: tower.urls,
                new_value: [...(tower.urls || []), url],
            });

            setUrl("");

            setMessage("Návrh byl úspěšně přidán.");
            setTimeout(() => {
                setMessage("");
            }, 4000);
        } else {
            setMessage("Zadejte prosím platný odkaz.");
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-2 relative">
            <div className="flex gap-2 items-center">
                <input
                    type="text"
                    placeholder="Vložit nový odkaz"
                    className="input input-sm input-bordered w-full"
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value);
                        setMessage("");
                    }}
                />
                <button className="btn btn-sm" onClick={handleAddSource}>
                    {loading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        <>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M5 12h14" />
                                <path d="M12 5v14" />
                            </svg>
                            Přidat
                        </>
                    )}
                </button>
            </div>
            {message && <div className="text-xs mt-2 absolute top-7 left-2 text-error">{message}</div>}
        </div>
    );
};

export default AddSource;
