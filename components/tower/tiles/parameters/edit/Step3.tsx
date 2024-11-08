import { Tower } from "@/typings";
import { editableParameters } from "@/utils/editableParameters";
import { formatParameterValue } from "@/utils/formatValue";

const Step3 = ({ tower, parameter, newValue }: { tower: Tower; parameter: string; newValue: any }) => {
    const { label, type } = editableParameters.find((p) => p.name === parameter) || {};

    return (
        <>
            <h3 className="flex w-full justify-center text-lg font-bold">{label}</h3>
            <div className="flex w-full justify-center">
                <div className="flex flex-col gap-1 items-center flex-1">
                    <p>Stará hodnota</p>
                    <div className="font-bold text-lg text-error line-through text-center">
                        {formatParameterValue(tower[parameter as keyof Tower], type)}
                    </div>
                </div>
                <div className="divider divider-horizontal" />
                <div className="flex flex-col gap-1 items-center flex-1">
                    <p>Nová hodnota</p>
                    <div className="font-bold text-lg text-success text-center">{formatParameterValue(newValue, type)}</div>
                </div>
            </div>
        </>
    );
};

export default Step3;
