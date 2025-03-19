import { MATERIALS } from "@/constants/materials";
import { towerTypes } from "@/constants/towerType";
import { EditableParameter } from "@/types/EditableParameter";

export const editableParameters: EditableParameter[] = [
    { name: "name", label: "Název", type: "text" },
    { name: "type", label: "Typ", type: "select", typeOptions: towerTypes },
    { name: "height", label: "Výška", type: "number" },
    { name: "stairs", label: "Počet schodů", type: "number" },
    { name: "material", label: "Materiál", type: "array", typeOptions: MATERIALS },
    { name: "elevation", label: "Nadmořská výška", type: "number" },
    { name: "opened", label: "Datum zpřístupnění", type: "date" },
];
