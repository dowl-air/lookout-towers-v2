import { EditableParameter, EditableParameterType } from "@/types/EditableParameter";
import { formatDate } from "@/utils/date";

export const formatParameterValue = (
    value: any,
    type?: EditableParameterType,
    typeOptions?: EditableParameter["typeOptions"]
): string => {
    switch (type) {
        case "date":
            return formatDate({ date: value });
        case "array":
            return value.join(", ");
        case "select": {
            const option = typeOptions?.find(
                (typeOption) => typeof typeOption !== "string" && typeOption.value === value
            );

            return typeof option === "string" ? option : (option?.name ?? value);
        }
        case "object":
            return null;
        case "number":
            return value ? value.toString() : "Neznámé";
        case "text":
            return value ? value : "Neznámé";
        default:
            return value;
    }
};
