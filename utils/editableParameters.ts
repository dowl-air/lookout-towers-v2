import { EditableParameter } from "@/types/EditableParameter";
import { materials, towerType } from "@/utils/constants";

export const editableParameters: EditableParameter[] = [
    { name: "name", label: "Název", type: "text" },
    { name: "type", label: "Typ", type: "select", typeOptions: towerType },
    { name: "height", label: "Výška", type: "number" },
    { name: "stairs", label: "Počet schodů", type: "number" },
    { name: "material", label: "Materiál", type: "array", typeOptions: materials },
    { name: "elevation", label: "Nadmořská výška", type: "number" },
    { name: "opened", label: "Datum zpřístupnění", type: "date" },
];
