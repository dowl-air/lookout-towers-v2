import { Tower } from "@/typings";
import { formatDate } from "@/utils/date";
import { editableParameters } from "@/utils/editableParameters";

export const formatValue = (value: any, type: string) => {
    switch (type) {
        case "date":
            return formatDate({ date: value });
        case "array":
            return value.join(", ");
        default:
            return value;
    }
};

const Step1 = ({
    parameter,
    setParameter,
    tower,
}: {
    parameter: keyof Tower | "default";
    setParameter: (p: keyof Tower | "default") => void;
    tower: Tower;
}) => {
    return (
        <>
            <div className="flex justify-center w-full">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Vyberte parametr</span>
                    </div>
                    <select
                        value={parameter}
                        className="select select-bordered select-primary w-full max-w-xs mx-auto"
                        onChange={(e) => setParameter(e.target.value as keyof Tower)}
                    >
                        <option value="default" disabled>
                            Jaký parametr chcete upravit?
                        </option>
                        {editableParameters.map((param) => (
                            <option key={param.name} value={param.name}>
                                {param.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            {parameter !== "default" && (
                <div className="flex w-full justify-center gap-1 flex-wrap">
                    <p>Aktuální hodnota: </p>
                    <div className="font-bold ">
                        {formatValue(tower[parameter as keyof Tower], editableParameters.find((p) => p.name === parameter)?.type as string)}
                    </div>
                </div>
            )}
        </>
    );
};

export default Step1;
