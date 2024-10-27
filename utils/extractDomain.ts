export const extractDomain = (url: string): string => {
    try {
        if (!url) return "Neznámá doména";
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname;
        return hostname.startsWith("www.") ? hostname.slice(4) : hostname;
    } catch (error) {
        return url;
    }
};
