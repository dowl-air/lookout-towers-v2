export const getDefaultIcon = (L: typeof import("leaflet")) =>
    L.icon({
        iconUrl: "/img/marker_red.png",
        shadowUrl: "/img/marker-shadow.png",
        iconSize: [23, 32],
        iconAnchor: [11, 32],
        shadowSize: [41, 41],
        shadowAnchor: [13, 41],
    });

export const getVisitedIcon = (L: typeof import("leaflet")) =>
    L.icon({
        iconUrl: "/img/marker_green.png",
        shadowUrl: "/img/marker-shadow.png",
        iconSize: [23, 32],
        iconAnchor: [11, 32],
        shadowSize: [41, 41],
        shadowAnchor: [13, 41],
    });

export const getFavouriteIcon = (L: typeof import("leaflet")) =>
    L.icon({
        iconUrl: "/img/marker_yellow.png",
        shadowUrl: "/img/marker-shadow.png",
        iconSize: [23, 32],
        iconAnchor: [11, 32],
        shadowSize: [41, 41],
        shadowAnchor: [13, 41],
    });
