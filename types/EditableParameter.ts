import { Tower } from "@/typings";

export type EditableParameterType = "text" | "select" | "number" | "array" | "date" | "object";

export type EditableParameter = {
    name: keyof Tower;
    label: string;
    type: EditableParameterType;
    typeOptions?: string[];
};
