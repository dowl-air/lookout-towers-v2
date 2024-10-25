export const formatDate = ({ date, long = false }: { date: Date | string; long?: boolean }) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("cs", {
        timeZone: "Europe/Prague",
        day: "numeric",
        month: long ? "long" : "numeric",
        year: "numeric",
    });
};
