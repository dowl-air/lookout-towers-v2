import VisitedIcon from "@/components/tower/tiles/changesHistory/VisitedIcon";
import { User } from "@/types/User";
import { Visit } from "@/types/Visit";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/date";

const VisitLine = ({ visit, idx, user }: { visit: Visit; idx: number; user: User }) => {
    return (
        <div
            className={cn("flex gap-1", {
                "mt-7": idx === 0,
            })}
        >
            <time className="text-gray-400 mr-1 text-nowrap min-w-[75px] sm:min-w-[88px] text-right">
                {formatDate({ date: visit.date, long: false })}
            </time>
            <div className="mx-1">
                <VisitedIcon />
            </div>
            <div className="text-nowrap">
                <span className="text-nowrap">{user.name}</span> zaznamenal/a návštěvu.
            </div>
        </div>
    );
};

export default VisitLine;
