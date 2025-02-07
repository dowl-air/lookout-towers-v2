import L from "leaflet";

export const defaultIcon = L.icon({
    iconUrl: "/img/marker_red.png",
    shadowUrl: "/img/marker-shadow.png",
    iconSize: [23, 32],
    iconAnchor: [11, 32],
    shadowSize: [41, 41],
    shadowAnchor: [13, 41],
});

export const visitedIcon = L.icon({
    iconUrl: "/img/marker_green.png",
    shadowUrl: "/img/marker-shadow.png",
    iconSize: [23, 32],
    iconAnchor: [11, 32],
    shadowSize: [41, 41],
    shadowAnchor: [13, 41],
});

export const favouriteIcon = L.icon({
    iconUrl: "/img/marker_yellow.png",
    shadowUrl: "/img/marker-shadow.png",
    iconSize: [23, 32],
    iconAnchor: [11, 32],
    shadowSize: [41, 41],
    shadowAnchor: [13, 41],
});
