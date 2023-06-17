import { Tower } from "@/typings";
import React from "react";

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function Legend({ tower }: { tower: Tower }) {
    return (
        <legend>{`${capitalizeFirstLetter(tower.type)} je vysoká ${tower.height === -1 ? "neznámo" : tower.height} metrů a vede na ni ${
            tower.stairs === -1 ? "neznámo" : "přesně " + tower.stairs
        } schodů. Nachází se v nadmořské výšce ${tower.elevation} metrů a ${tower.openingHours === "volně přístupná" ? "je volně přístupná" : ""}${
            tower.openingHours === "dlouhodobě uzavřená" ? "je bohužel dlouhodobě uzavřená" : ""
        }${
            "dlouhodobě uzavřená" !== tower.openingHours && tower.openingHours !== "volně přístupná" ? "její otevírací doba není známa" : ""
        }.`}</legend>
    );
}

export default Legend;
