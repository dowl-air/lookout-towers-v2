import { ImageResponse } from "next/og";

import { HOMEPAGE_SHARE_IMAGE_ALT } from "@/app/(with-navbar)/(with-footer)/homepageSeo";

export const shareImageAlt = HOMEPAGE_SHARE_IMAGE_ALT;
export const shareImageSize = {
    width: 1200,
    height: 630,
};
export const shareImageContentType = "image/png";

export function createHomepageShareImage() {
    return new ImageResponse(
        <div
            style={{
                alignItems: "stretch",
                background:
                    "radial-gradient(circle at top right, rgba(241, 196, 88, 0.9), transparent 28%), linear-gradient(135deg, #11251f 0%, #1b4332 45%, #245b52 100%)",
                color: "#f8f3e8",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between",
                padding: "56px 64px",
                position: "relative",
                width: "100%",
            }}
        >
            <div
                style={{
                    alignSelf: "flex-start",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    borderRadius: 999,
                    display: "flex",
                    fontSize: 26,
                    fontWeight: 600,
                    letterSpacing: 1,
                    padding: "14px 24px",
                }}
            >
                ROZHLEDNOVY SVET
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                    maxWidth: 820,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        fontSize: 78,
                        fontWeight: 800,
                        letterSpacing: -2,
                        lineHeight: 1.02,
                        textWrap: "balance",
                    }}
                >
                    Rozhledny, veze a vyhlidky po Cesku
                </div>
                <div
                    style={{
                        color: "rgba(248, 243, 232, 0.86)",
                        display: "flex",
                        fontSize: 34,
                        lineHeight: 1.25,
                        maxWidth: 760,
                    }}
                >
                    Mapa, inspirace na vylety a komunitni databaze mist s vyhledem.
                </div>
            </div>

            <div
                style={{
                    alignItems: "flex-end",
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                    }}
                >
                    <div style={{ display: "flex", fontSize: 32, fontWeight: 700 }}>
                        Rozhlednovy svet
                    </div>
                    <div
                        style={{
                            color: "rgba(248, 243, 232, 0.72)",
                            display: "flex",
                            fontSize: 24,
                        }}
                    >
                        rozhlednovysvet.cz
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: 18,
                    }}
                >
                    {["Komunitni databaze", "Planovani vyletu", "Mista s vyhledem"].map((label) => (
                        <div
                            key={label}
                            style={{
                                background: "rgba(255, 255, 255, 0.08)",
                                border: "1px solid rgba(255, 255, 255, 0.14)",
                                borderRadius: 24,
                                display: "flex",
                                fontSize: 22,
                                fontWeight: 600,
                                padding: "16px 20px",
                            }}
                        >
                            {label}
                        </div>
                    ))}
                </div>
            </div>
        </div>,
        shareImageSize
    );
}
