import { Tower } from "@/typings";

export type EditableParameter = {
    name: keyof Tower;
    label: string;
    type: "text" | "select" | "number" | "array" | "date";
    typeOptions?: string[];
};
