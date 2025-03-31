"use client";

import { createChange } from "@/actions/changes/change.create";
import { Tower } from "@/types/Tower";
import { useState } from "react";

const AddSource = ({ tower }: { tower: Tower }) => {
    const [open, setOpen] = useState(false);
    const [buttonText, setButtonText] = useState("Přidat");
    const [url, setUrl] = useState("");

    return (
        <div className="flex gap-2 items-center">
            <input
                type="text"
                placeholder="Přidat odkaz"
                className={`input input-sm input-bordered w-full ${open ? "block" : "hidden"}`}
                value={url}
                onChange={(e) => {
                    setUrl(e.target.value);
                    if (e.target.value.length > 5) {
                        setButtonText("Uložit");
                    } else {
                        setButtonText("Přidat");
                    }
                }}
            />
            <button
                className="btn btn-sm"
                onClick={async () => {
                    if (open && url.length > 5) {
                        await createChange({
                            field: "urls",
                            tower_id: tower.id,
                            type: "array",
                            old_value: tower.urls,
                            new_value: [...tower.urls, url],
                        });
                        setUrl("");
                        setButtonText("Ke kontrole");
                        setOpen(false);
                    }
                    setOpen(true);
                }}
            >
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
                {buttonText}
            </button>
        </div>
    );
};

export default AddSource;
