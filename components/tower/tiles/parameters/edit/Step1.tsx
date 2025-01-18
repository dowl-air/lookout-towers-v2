import { Tower } from "@/types/Tower";
import { editableParameters } from "@/utils/editableParameters";

const Step1 = ({ setParameter }: { setParameter: (p: keyof Tower | "default") => void }) => {
    return (
        <div className="flex justify-center w-full flex-col">
            <h2 className="text-center font-bold mb-4 mt-6">Vyberte parametr</h2>
            <div className="grid grid-cols-2 gap-3">
                {editableParameters.map((param) => (
                    <div key={param.name} className="btn btn-sm" onClick={() => setParameter(param.name)}>
                        {param.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Step1;
