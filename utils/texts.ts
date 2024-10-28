export const generateHeightText = (height?: number | null): string => {
    if (height == null) return "neznámá výška";
    if (height < 0) return "neznámá výška";

    switch (height) {
        case 0:
            return "0 metrů";
        case 1:
            return "1 metr";
        case 2:
        case 3:
        case 4:
            return `${height} metry`;
        default:
            return `${height} metrů`;
    }
};
