import { getOpeningHoursTypeName, OpeningHoursForbiddenType, OpeningHoursType } from "@/types/OpeningHours";
import { useEffect } from "react";

type OpeningHours = {
    detailText: string;
    handleDetailTextChange: (text: string) => void;
    detailUrl: string;
    handleDetailUrlChange: (url: string) => void;
    type: OpeningHoursType;
    forbiddenType?: OpeningHoursForbiddenType;
    handleForbiddenTypeChange: (type: OpeningHoursForbiddenType) => void;
    setErrorText: (text: string) => void;
};

const Step3Detail = ({
    type,
    detailText,
    detailUrl,
    handleDetailTextChange,
    handleDetailUrlChange,
    forbiddenType,
    handleForbiddenTypeChange,
    setErrorText,
}: OpeningHours) => {
    const isForbidden = type === OpeningHoursType.Forbidden;

    useEffect(() => {
        if (isForbidden) {
            if (forbiddenType !== undefined && forbiddenType !== null) return setErrorText("");
        }
    }, [isForbidden, forbiddenType]);

    return (
        <div className="flex flex-col gap-3 items-center">
            <h3 className="font-bold">{getOpeningHoursTypeName(type)}</h3>

            {isForbidden ? (
                <div className="flex flex-col">
                    <label className="label cursor-pointer justify-start gap-3">
                        <input
                            type="radio"
                            className="radio checked:bg-blue-500"
                            checked={forbiddenType === OpeningHoursForbiddenType.Reconstruction}
                            onChange={() => handleForbiddenTypeChange(OpeningHoursForbiddenType.Reconstruction)}
                        />
                        <span className="label-text text-base">V rekonstrukci</span>
                    </label>
                    <label className="label cursor-pointer justify-start gap-3">
                        <input
                            type="radio"
                            className="radio checked:bg-orange-500"
                            checked={forbiddenType == OpeningHoursForbiddenType.Temporary}
                            onChange={() => handleForbiddenTypeChange(OpeningHoursForbiddenType.Temporary)}
                        />
                        <span className="label-text text-base">Dočasně uzavřeno z jiných důvodů</span>
                    </label>
                    <label className="label cursor-pointer justify-start gap-3">
                        <input
                            type="radio"
                            className="radio checked:bg-red-500"
                            checked={forbiddenType === OpeningHoursForbiddenType.Banned}
                            onChange={() => handleForbiddenTypeChange(OpeningHoursForbiddenType.Banned)}
                        />
                        <span className="label-text text-base">Trvale uzavřeno</span>
                    </label>
                    <label className="label cursor-pointer justify-start gap-3 w-64 sm:w-80">
                        <input
                            type="radio"
                            className="radio checked:bg-red-500"
                            checked={forbiddenType === OpeningHoursForbiddenType.Gone}
                            onChange={() => handleForbiddenTypeChange(OpeningHoursForbiddenType.Gone)}
                        />
                        <span className="label-text text-base">Zaniklý objekt</span>
                    </label>
                </div>
            ) : null}

            <label>
                <div className="label">
                    <span className="label-text">Detailní popis</span>
                </div>
                <textarea
                    className="textarea w-64 sm:w-80 textarea-primary"
                    placeholder={isForbidden ? "Okolnosti uzavření, důvody..." : "Informace o otevření, kdy je možné navštívit..."}
                    maxLength={500}
                    value={detailText}
                    onChange={(e) => handleDetailTextChange(e.target.value)}
                ></textarea>
            </label>
            <label>
                <div className="label">
                    <span className="label-text">URL adresa</span>
                </div>
                <input
                    type="text"
                    className="input input-primary w-64 sm:w-80"
                    placeholder="Odkaz na více informací"
                    maxLength={500}
                    value={detailUrl}
                    onChange={(e) => handleDetailUrlChange(e.target.value)}
                ></input>
            </label>
        </div>
    );
};

export default Step3Detail;
