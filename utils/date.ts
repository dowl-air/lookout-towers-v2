export const formatDate = ({
    date,
    long = false,
}: {
    date: Date | string | number;
    long?: boolean;
}) => {
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

export const formatMonthYear = ({ date }: { date: Date | string | number }) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("cs", {
        timeZone: "Europe/Prague",
        month: "long",
        year: "numeric",
    });
};

export const toDateInputValue = (date: Date | string | number | undefined) => {
    if (!date) return "";

    const dateObject = new Date(date);
    if (Number.isNaN(dateObject.getTime())) return "";

    return dateObject.toISOString().split("T")[0];
};
