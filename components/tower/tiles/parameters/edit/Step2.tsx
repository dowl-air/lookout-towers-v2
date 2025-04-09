import { Tower } from "@/types/Tower";
import { editableParameters } from "@/utils/editableParameters";
import { formatParameterValue } from "@/utils/formatValue";

const Step2 = ({
    newValue,
    setNewValue,
    parameter,
    tower,
}: {
    newValue: any;
    setNewValue: (p: any) => void;
    tower: Tower;
    parameter: keyof Tower | "default";
}) => {
    const { label, type, typeOptions } = editableParameters.find((p) => p.name === parameter) || {};

    return (
        <>
            <h3 className="flex w-full justify-center text-lg font-bold">{label}</h3>
            <div className="flex w-full justify-center gap-1 flex-wrap">
                <p>Aktuální hodnota: </p>
                <div className="font-bold">{formatParameterValue(tower[parameter as keyof Tower], type)}</div>
            </div>
            <div className="flex justify-center w-full">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Zadejte novou hodnotu</span>
                    </div>
                    {type === "text" && (
                        <input
                            type="text"
                            value={newValue || ""}
                            className="input input-bordered input-primary w-full max-w-xs mx-auto"
                            onChange={(e) => setNewValue(e.target.value)}
                        />
                    )}
                    {type === "number" && (
                        <input
                            type="number"
                            value={newValue || ""}
                            className="input input-primary input-bordered w-full max-w-xs mx-auto"
                            onChange={(e) => setNewValue(e.target.value)}
                        />
                    )}
                    {type === "date" && (
                        <input
                            type="date"
                            value={newValue}
                            className="input input-primary input-bordered w-full max-w-xs mx-auto"
                            onChange={(e) => setNewValue(e.target.value)}
                        />
                    )}
                    {type === "select" && (
                        <select
                            value={newValue}
                            className="select select-primary select-bordered w-full max-w-xs mx-auto"
                            onChange={(e) => setNewValue(e.target.value)}
                        >
                            {parameter === "type"
                                ? typeOptions?.map((option) => (
                                      <option key={option.value} value={option.value}>
                                          {option.name}
                                      </option>
                                  ))
                                : typeOptions?.map((option) => (
                                      <option key={option} value={option}>
                                          {option}
                                      </option>
                                  ))}
                        </select>
                    )}
                    {type === "array" && (
                        <div className="flex w-full flex-wrap gap-2">
                            {typeOptions?.map((option) => (
                                <div key={option} className="form-control">
                                    <label className="label cursor-pointer flex-nowrap gap-1">
                                        <input
                                            type="checkbox"
                                            checked={newValue.includes(option)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setNewValue([...newValue, option].filter((val) => typeOptions?.includes(val)));
                                                } else {
                                                    setNewValue(newValue.filter((val) => val !== option).filter((val) => typeOptions?.includes(val)));
                                                }
                                            }}
                                            className="checkbox checkbox-primary"
                                        />
                                        <span className="label-text">{option}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </label>
            </div>
        </>
    );
};
export default Step2;
