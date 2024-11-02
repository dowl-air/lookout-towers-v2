import { materials, towerType } from "@/utils/constants";

export const editableParameters = [
    { name: "name", label: "Název", type: "text" },
    { name: "type", label: "Typ", type: "select", typeOptions: towerType },
    { name: "material", label: "Materiál", type: "array", typeOptions: materials },
    { name: "stairs", label: "Počet schodů", type: "number" },
    { name: "height", label: "Výška", type: "number" },
    { name: "elevation", label: "Nadmořská výška", type: "number" },
    { name: "opened", label: "Zpřístupnění", type: "date" },
];
