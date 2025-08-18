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

export const locationIcon = L.divIcon({
    className: "location-marker",
    html: `<div style="
        width: 16px; 
        height: 16px; 
        background-color: #3b82f6; 
        border: 3px solid white; 
        border-radius: 50%; 
        box-shadow: 0 0 0 2px #3b82f6;
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});
