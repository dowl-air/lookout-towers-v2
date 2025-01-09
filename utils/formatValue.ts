import { EditableParameterType } from "@/types/EditableParameter";
import { formatDate } from "@/utils/date";

export const formatParameterValue = (value: any, type: EditableParameterType): string => {
    switch (type) {
        case "date":
            return formatDate({ date: value });
        case "array":
            return value.join(", ");
        case "object":
            return null;
        default:
            return value;
    }
};
