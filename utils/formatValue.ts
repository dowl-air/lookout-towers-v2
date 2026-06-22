import { EditableParameter, EditableParameterType } from "@/types/EditableParameter";
import { formatDate } from "@/utils/date";

export const formatParameterValue = (
    value: any,
    type?: EditableParameterType,
    typeOptions?: EditableParameter["typeOptions"]
): string => {
    switch (type) {
        case "date":
            if (!value) return "Neznámé";
            return formatDate({ date: value });
        case "array":
            if (!Array.isArray(value) || value.length === 0) return "Neznámé";
            return value.join(", ");
        case "select": {
            if (!value) return "Neznámé";
            const option = typeOptions?.find(
                (typeOption) => typeof typeOption !== "string" && typeOption.value === value
            );

            return typeof option === "string" ? option : (option?.name ?? value);
        }
        case "object":
            return "Neznámé";
        case "number":
            return value ? value.toString() : "Neznámé";
        case "text":
            return value ? value : "Neznámé";
        default:
            return value ?? "Neznámé";
    }
};

export const isUnknownParameterValue = (value: any, type?: EditableParameterType): boolean => {
    if (type === "array") return !Array.isArray(value) || value.length === 0;
    if (type === "number") return value == null || Number(value) === 0;

    return value == null || value === "";
};
