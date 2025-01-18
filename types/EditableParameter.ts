import { Tower } from "@/types/Tower";

export type EditableParameterType = "text" | "select" | "number" | "array" | "date" | "object";

export type EditableParameter = {
    name: keyof Tower;
    label: string;
    type: EditableParameterType;
    typeOptions?: string[];
};
