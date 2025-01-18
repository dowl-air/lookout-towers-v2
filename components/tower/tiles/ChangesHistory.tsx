import { getChangesByTower } from "@/actions/changes/change.get";
import { getUser } from "@/actions/members/members.action";
import ApprovedIcon from "@/components/tower/tiles/changesHistory/ApprovedIcon";
import NewIcon from "@/components/tower/tiles/changesHistory/NewIcon";
import RejectedIcon from "@/components/tower/tiles/changesHistory/RejectedIcon";
import { ChangeState } from "@/types/Change";
import { Tower } from "@/typings";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/date";
import { editableParameters } from "@/utils/editableParameters";
import { formatParameterValue } from "@/utils/formatValue";
import { getOpeningHoursTypeName } from "@/utils/openingHours";

const ChangesHistory = async ({ tower }: { tower: Tower }) => {
    const towerChanges = await getChangesByTower(tower.id, "", 50); //todo? implement pagination
    const uniqueUserIDs = [...new Set(towerChanges.map((change) => change.user_id))];
    const users = await Promise.all(uniqueUserIDs.map((id) => getUser(id)));
    //todo add different types of changes (admission...)
    if (towerChanges.length === 0) return null;
    return (
        <div className="card card-compact sm:card-normal shadow-xl w-full mb-5">
            <div className="card-body gap-0">
                <h2 className="card-title text-base sm:text-lg md:text-xl text-nowrap">Historie změn</h2>
                <div className="overflow-x-auto flex flex-col gap-1">
                    {towerChanges.map((change, idx) => {
                        console.log(change);
                        let parameter = editableParameters.find((param) => param.name === change.field);
                        if (change.field === "openingHours") parameter = { label: "Otevírací doba", type: "object", name: "openingHours" };
                        const user = users.find((user) => user.id === change.user_id);
                        const isApproved = change.state === ChangeState.Approved;
                        const isRejected = change.state === ChangeState.Rejected;
                        const isNew = change.state === ChangeState.New;
                        return (
                            <div
                                key={change.id}
                                className={cn("flex gap-1", {
                                    "mt-7": idx === 0,
                                })}
                            >
                                <time className="text-gray-400 mr-1 text-nowrap">{formatDate({ date: change.created, long: false })}</time>
                                <div className="mx-1">
                                    {isApproved ? <ApprovedIcon /> : null}
                                    {isNew ? <NewIcon /> : null}
                                    {isRejected ? <RejectedIcon /> : null}
                                </div>
                                <div className="text-nowrap">{`${user.name} ${isApproved ? "změnil/a parametr" : "navrhl/a změnu parametru"}`}</div>
                                <span className="text-nowrap">
                                    <span className="font-bold">{parameter.label}</span>.
                                </span>
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
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ChangesHistory;
