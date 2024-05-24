export const formatDate = (date: Date | String) => {
    if (typeof date === "string") date = new Date(date);
    const d = date as Date;
    return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
}