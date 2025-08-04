import { EditableParameterType } from "@/types/EditableParameter";

const ChangeValueAdmin = ({ type, value }: { type: EditableParameterType; value: any }) => {
    if (type === "text") {
        return <span>{value}</span>;
    } else if (type === "select") {
        return <span>{value}</span>;
    } else if (type === "number") {
        return <span>{value}</span>;
    } else if (type === "array") {
        return value && value.length > 0 ? (
            <div className="flex flex-col">
                {value.map((item: any, index: number) => (
                    <span key={index}>{item}</span>
                ))}
            </div>
        ) : (
            <span>Žádné položky</span>
        );
    } else if (type === "date") {
        return <span>{new Date(value).toLocaleDateString()}</span>;
    } else if (type === "object") {
        return <span>{JSON.stringify(value)}</span>;
    }
};

export default ChangeValueAdmin;
