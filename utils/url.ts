export const getNormalizedHttpUrl = (value: string): string | null => {
    try {
        const parsedUrl = new URL(value.trim());

        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") return null;

        parsedUrl.hash = "";
        parsedUrl.hostname = parsedUrl.hostname.toLowerCase();

        if (parsedUrl.pathname !== "/") {
            parsedUrl.pathname = parsedUrl.pathname.replace(/\/+$/, "");
        }

        const normalizedUrl = parsedUrl.toString();

        return parsedUrl.pathname === "/" && !parsedUrl.search
            ? normalizedUrl.replace(/\/$/, "")
            : normalizedUrl;
    } catch {
        return null;
    }
};

export const getUrlDomain = (value: string): string | null => {
    const normalizedUrl = getNormalizedHttpUrl(value);
    if (!normalizedUrl) return null;

    const hostname = new URL(normalizedUrl).hostname;

    return hostname.startsWith("www.") ? hostname.slice(4) : hostname;
};

export const getUrlDomainFromInput = (value: string): string | null => {
    const trimmedValue = value.trim();
    if (!trimmedValue) return null;

    const valueWithProtocol = /^https?:\/\//i.test(trimmedValue)
        ? trimmedValue
        : `https://${trimmedValue}`;

    try {
        const hostname = new URL(valueWithProtocol).hostname.toLowerCase();
        if (!hostname.includes(".")) return null;

        return hostname.startsWith("www.") ? hostname.slice(4) : hostname;
    } catch {
        return null;
    }
};

export const hasUrl = (urls: string[], value: string): boolean => {
    const normalizedUrl = getNormalizedHttpUrl(value);
    if (!normalizedUrl) return false;

    return urls.some((url) => getNormalizedHttpUrl(url) === normalizedUrl);
};

export const findUrlWithSameDomain = (urls: string[], value: string): string | null => {
    const domain = getUrlDomainFromInput(value);
    if (!domain) return null;

    return urls.find((url) => getUrlDomain(url) === domain) ?? null;
};
