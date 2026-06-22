import { Tower } from "@/types/Tower";
import { cn } from "@/utils/cn";
import { editableParameters } from "@/utils/editableParameters";
import { formatParameterValue, isUnknownParameterValue } from "@/utils/formatValue";

const Step1 = ({
    selectedParameter,
    setParameter,
    tower,
}: {
    selectedParameter: keyof Tower | "default";
    setParameter: (p: keyof Tower | "default") => void;
    tower: Tower;
}) => {
    return (
        <div className="w-full space-y-4">
            <h2 className="text-center font-bold">Vyberte údaj k úpravě</h2>
            <div className="grid gap-3 sm:grid-cols-2">
                {editableParameters.map((param) => (
                    <button
                        key={param.name}
                        type="button"
                        className={cn(
                            "cursor-pointer rounded-lg border border-base-300/70 bg-base-100 p-4 text-left transition hover:border-primary/50 hover:bg-base-200/45",
                            selectedParameter === param.name && "border-primary/60 bg-primary/5"
                        )}
                        onClick={() => setParameter(param.name)}
                    >
                        <span className="block text-sm font-semibold text-base-content/70">
                            {param.label}
                        </span>
                        <span
                            className={cn(
                                "mt-1 block wrap-anywhere text-base font-semibold text-base-content",
                                isUnknownParameterValue(tower[param.name], param.type) &&
                                    "text-error"
                            )}
                        >
                            {formatParameterValue(tower[param.name], param.type, param.typeOptions)}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Step1;
