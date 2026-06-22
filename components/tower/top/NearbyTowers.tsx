import { Tower } from "@/types/Tower";

import NearbyTowerCard from "./NearbyTowerCard";

const NearbyTowers = ({ sourceTower, towers }: { sourceTower: Tower; towers: Tower[] }) => {
    if (towers.length === 0) {
        return null;
    }

    return (
        <section className="w-full max-w-7xl">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/60">
                Nejbližší rozhledny
            </h2>

            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-4 min-[500px]:grid-cols-3 md:grid-cols-4 md:gap-x-4 md:gap-y-6 lg:grid-cols-5">
                {towers.map((tower) => (
                    <NearbyTowerCard key={tower.id} sourceGps={sourceTower.gps} tower={tower} />
                ))}
            </div>
        </section>
    );
};

export default NearbyTowers;
