"use client";

import { Copy, Mail, MessageCircle, Send, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Tower } from "@/types/Tower";
import { cn } from "@/utils/cn";

type ShareButtonProps = {
    tower: Tower;
    className?: string;
};

function ShareButton({ tower, className }: ShareButtonProps) {
    const sharePath = `/${tower.type}/${tower.nameID}`;
    const shareText = `Mrkněte na ${tower.name} na Rozhlednovém světě.`;
    const [shareUrl, setShareUrl] = useState(sharePath);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setShareUrl(new URL(sharePath, window.location.origin).toString());
    }, [sharePath]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    };

    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    const encodedEmailSubject = encodeURIComponent(`${tower.name} | Rozhlednový svět`);
    const encodedEmailBody = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    const shareLinks = [
        {
            label: "Facebook",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            icon: <span className="text-sm font-bold">f</span>,
        },
        {
            label: "X",
            href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
            icon: <span className="text-xs font-bold">X</span>,
        },
        {
            label: "WhatsApp",
            href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
            icon: <MessageCircle className="size-4" />,
        },
        {
            label: "Messenger",
            href: `fb-messenger://share?link=${encodedUrl}`,
            icon: <span className="text-xs font-bold">M</span>,
        },
        {
            label: "Telegram",
            href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
            icon: <Send className="size-4" />,
        },
        {
            label: "E-mail",
            href: `mailto:?subject=${encodedEmailSubject}&body=${encodedEmailBody}`,
            icon: <Mail className="size-4" />,
        },
    ];

    return (
        <div className="dropdown dropdown-end dropdown-top shrink-0">
            <button
                type="button"
                tabIndex={0}
                className={cn("btn btn-outline btn-sm sm:btn-md whitespace-nowrap", className)}
            >
                <Share2 className="size-4" />
                <span>Sdílet</span>
            </button>
            <div
                tabIndex={0}
                className="dropdown-content z-50 mb-2 w-64 rounded-box border border-base-300 bg-base-100 p-3 shadow-sm"
            >
                <div className="flex items-center gap-2">
                    {shareLinks.map(({ label, href, icon }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Sdílet na ${label}`}
                            title={label}
                            className="btn btn-outline btn-circle btn-sm"
                        >
                            {icon}
                        </a>
                    ))}
                </div>
                <button
                    type="button"
                    className="btn btn-outline btn-sm mt-3 w-full justify-start whitespace-nowrap"
                    onClick={handleCopy}
                >
                    <Copy className="size-4" />
                    {copied ? "Zkopírováno" : "Kopírovat odkaz"}
                </button>
            </div>
        </div>
    );
}

export default ShareButton;
