export const formatDate = ({ date, long = false }: { date: Date | string | number; long?: boolean }) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("cs", {
        timeZone: "Europe/Prague",
        day: "numeric",
        month: long ? "long" : "numeric",
        year: "numeric",
    });
};

export const formatDateYear = ({ date }: { date: Date | string | number }) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("cs", {
        timeZone: "Europe/Prague",
        year: "numeric",
    });
};
