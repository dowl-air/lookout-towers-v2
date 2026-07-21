import { TOWER_TAG_DETAILS } from "@/constants/towerTags";
import { EditableParameterType } from "@/types/EditableParameter";
import { Tower } from "@/types/Tower";
import { TowerTag } from "@/types/TowerTags";

const ChangeValueAdmin = ({
    field,
    type,
    value,
}: {
    field: keyof Tower;
    type: EditableParameterType;
    value: any;
}) => {
    if (field === "contact") {
        const contactItems = [
            ["Telefon", value?.phone],
            ["E-mail", value?.email],
            ["Oficiální web", value?.officialWebsite],
        ].filter(([, itemValue]) => itemValue);

        return contactItems.length ? (
            <div className="flex flex-col">
                {contactItems.map(([label, itemValue]) => (
                    <span key={label}>{`${label}: ${itemValue}`}</span>
                ))}
            </div>
        ) : (
            <span>Kontakt není vyplněn</span>
        );
    }

    if (field === "tags") {
        return Array.isArray(value) && value.length ? (
            <div className="flex flex-col">
                {value.map((tag: TowerTag) => (
                    <span key={tag}>{TOWER_TAG_DETAILS[tag]?.label ?? tag}</span>
                ))}
            </div>
        ) : (
            <span>Žádné tagy</span>
        );
    }

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
