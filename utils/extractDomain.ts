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

export const extractDomainAndPath = (url: string): string => {
    try {
        if (!url) return "Neznámá doména";
        const parsedUrl = new URL(url);
        let hostname = parsedUrl.hostname;
        const pathname = parsedUrl.pathname;
        hostname = hostname.startsWith("www.") ? hostname.slice(4) : hostname;
        return `${hostname}${pathname}`.replace(".html", "").replace(".php", "").replace(".htm", "");
    } catch (error) {
        return url;
    }
};
