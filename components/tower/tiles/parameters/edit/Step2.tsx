import { Tower } from "@/types/Tower";
import { cn } from "@/utils/cn";
import { editableParameters } from "@/utils/editableParameters";
import { formatParameterValue, isUnknownParameterValue } from "@/utils/formatValue";

const getDateInputValue = (value: any) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toISOString().slice(0, 10);
};

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
    const currentValue = tower[parameter as keyof Tower];
    const arrayValue = Array.isArray(newValue) ? newValue : [];
    const dateValue = getDateInputValue(newValue);

    return (
        <div className="space-y-5">
            <div>
                <h3 className="text-lg font-bold">{label}</h3>
                <div className="mt-3 rounded-lg border border-base-300/70 bg-base-100 px-4 py-3">
                    <div className="text-sm text-base-content/60">Aktuální hodnota</div>
                    <div
                        className={cn(
                            "mt-1 wrap-anywhere font-semibold text-base-content",
                            isUnknownParameterValue(currentValue, type) && "text-error"
                        )}
                    >
                        {formatParameterValue(currentValue, type, typeOptions)}
                    </div>
                </div>
            </div>

            <div className="form-control w-full">
                <span className="label-text mb-2 block">Nová hodnota</span>
                <div>
                    {type === "text" && (
                        <input
                            type="text"
                            value={newValue || ""}
                            className="input input-bordered w-full rounded-lg bg-base-100"
                            onChange={(e) => setNewValue(e.target.value)}
                        />
                    )}
                    {type === "number" && (
                        <input
                            type="number"
                            value={newValue || ""}
                            className="input input-bordered w-full rounded-lg bg-base-100"
                            onChange={(e) => setNewValue(e.target.value)}
                        />
                    )}
                    {type === "date" && (
                        <input
                            type="date"
                            value={dateValue}
                            className="input input-bordered w-full rounded-lg bg-base-100"
                            onChange={(e) => setNewValue(e.target.value)}
                        />
                    )}
                    {type === "select" && (
                        <select
                            value={newValue}
                            className="select select-bordered w-full rounded-lg bg-base-100"
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
                        <div className="grid gap-2 rounded-lg border border-base-300/70 bg-base-100 p-4 sm:grid-cols-2">
                            {typeOptions?.map((option) => (
                                <div key={option} className="form-control">
                                    <label className="label cursor-pointer flex-nowrap gap-1">
                                        <input
                                            type="checkbox"
                                            checked={arrayValue.includes(option)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setNewValue(
                                                        [...arrayValue, option].filter((val) =>
                                                            typeOptions?.includes(val)
                                                        )
                                                    );
                                                } else {
                                                    setNewValue(
                                                        arrayValue
                                                            .filter((val) => val !== option)
                                                            .filter((val) =>
                                                                typeOptions?.includes(val)
                                                            )
                                                    );
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
                </div>
            </div>
        </div>
    );
};
export default Step2;
