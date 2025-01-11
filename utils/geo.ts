export const formatDistance = (distance: number) => {
    if (distance < 1000) {
        return `${Math.round(distance)} m`;
    }

    if (distance < 10000) {
        return `${(distance / 1000).toFixed(1)} km`;
    }

    return `${Math.round(distance / 1000)} km`;
};
