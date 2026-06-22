"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { cn } from "@/utils/cn";

const CopyGpsButton = ({ className, coordinates }: { className?: string; coordinates: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(coordinates);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    };

    return (
        <button
            type="button"
            className={cn("btn btn-outline btn-sm sm:btn-md", className)}
            onClick={handleCopy}
        >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Zkopírováno" : "Kopírovat"}
        </button>
    );
};

export default CopyGpsButton;
