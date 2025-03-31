import ApprovedIcon from "@/components/tower/tiles/changesHistory/ApprovedIcon";
import NewIcon from "@/components/tower/tiles/changesHistory/NewIcon";
import RejectedIcon from "@/components/tower/tiles/changesHistory/RejectedIcon";
import { Change, ChangeState } from "@/types/Change";
import { User } from "@/types/User";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/date";
import { editableParameters } from "@/utils/editableParameters";
import { extractDomainAndPath } from "@/utils/extractDomain";
import { formatParameterValue } from "@/utils/formatValue";
import { getOpeningHoursTypeName } from "@/utils/openingHours";

const ChangeLine = ({ change, idx, user }: { change: Change; idx: number; user: User }) => {
    const isApproved = change.state === ChangeState.Approved;
    const isRejected = change.state === ChangeState.Rejected;
    const isNew = change.state === ChangeState.New;

    let parameter = editableParameters.find((param) => param.name === change.field);
    if (change.field === "openingHours") parameter = { label: "Otevírací doba", type: "object", name: "openingHours" };
    if (change.field === "urls") parameter = { name: "urls", label: "Odkazům", type: "array" };

    return (
        <div
            className={cn("flex gap-1", {
                "mt-7": idx === 0,
            })}
        >
            <time className="text-gray-400 mr-1 text-nowrap min-w-[88px] text-right">{formatDate({ date: change.created, long: false })}</time>
            <div className="mx-1">
                {isApproved ? <ApprovedIcon /> : null}
                {isNew ? <NewIcon /> : null}
                {isRejected ? <RejectedIcon /> : null}
            </div>
            {change.field === "urls" ? (
                <div className="text-nowrap">{`${user.name} ${isApproved ? "přidal záznam k" : "navrhl/a přidání záznamu k"}`}</div>
            ) : (
                <div className="text-nowrap">{`${user.name} ${isApproved ? "změnil/a parametr" : "navrhl/a změnu parametru"}`}</div>
            )}
            <span className="text-nowrap">
                <span className="font-bold">{parameter.label}</span>.
            </span>
            {change.field === "urls" ? (
                <span className="text-neutral-500">{`[ ${extractDomainAndPath(change.new_value[change.new_value.length - 1])} ]`}</span>
            ) : (
                <span className="flex gap-2 ml-2 text-nowrap">
                    <span className={"text-neutral-500"}>
                        {"[ "}
                        <span className={cn({ "line-through": isApproved })}>
                            {formatParameterValue(change.old_value, parameter.type)}
                            {change.field === "openingHours" ? (
                                <span className="text-neutral-500">{getOpeningHoursTypeName(change.old_value.type)}</span>
                            ) : null}
                        </span>
                    </span>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-neutral-500"
                    >
                        <path d="M18 8L22 12L18 16" />
                        <path d="M2 12H22" />
                    </svg>
                    <div>
                        <span
                            className={cn("text-neutral-500", {
                                "text-success font-bold": isApproved,
                                "line-through": isRejected,
                            })}
                        >
                            {formatParameterValue(change.new_value, parameter.type)}
                            {change.field === "openingHours" ? (
                                <span className="text-neutral-500">{getOpeningHoursTypeName(change.new_value.type)}</span>
                            ) : null}
                        </span>

                        {" ]"}
                    </div>
                </span>
            )}
        </div>
    );
};

export default ChangeLine;
