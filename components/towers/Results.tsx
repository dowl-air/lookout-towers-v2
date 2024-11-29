import TowerCard from "@/components/shared/TowerCard";
import { Tower } from "@/typings";

const Results = async ({ towers }: { towers: Tower[] }) => {
    return (
        <div className="grid grid-cols-2 min-[500px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-4 md:gap-y-6 gap-x-3 md:gap-x-4 min-h-[70vh]">
            {towers.map((item, idx) => {
                return <TowerCard key={idx} tower={item} priority={idx < 5} />;
            })}
        </div>
    );
};

export default Results;
