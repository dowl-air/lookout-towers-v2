import { getTowerOfTheDay, getTowerRatingAndCount, getTowerVisitsCount } from "@/actions/towers/towers.action";
import { towerTypeMappedUrl } from "@/utils/constants";
import Link from "next/link";
import ThemedRating from "../shared/ThemedRating";

export const revalidate = 3600;

const TowerOfTheDay = async () => {
    const tower = await getTowerOfTheDay();
    const [{ avg, count }, { count: visitsCount }] = await Promise.all([getTowerRatingAndCount(tower.id), getTowerVisitsCount(tower.id)]);

    return (
        <div className="max-w-[1070px] w-full mx-auto px-4 mt-10 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">Rozhledna dne </h2>
            <p className="text-center text-lg md:text-xl mb-6">
                Dnes je {new Date().toLocaleDateString("cs", { month: "long", day: "numeric", year: "numeric" })}.
            </p>
            <div className="flex flex-col-reverse md:flex-row justify-center items-center md:items-start gap-4">
                <div className="flex-1">
                    <div className="flex flex-col bg-base-100 rounded-xl p-6 items-center md:items-end">
                        <h2 className="text-2xl mb-3 text-center md:text-right">
                            Byla vybrána {towerTypeMappedUrl[tower.type] ?? tower.type}{" "}
                            <Link className="font-bold" href={`${tower.type}/${tower.nameID}`}>
                                {tower.name}
                            </Link>
                            .
                        </h2>
                        <div className="flex items-center gap-2 mb-2">
                            <ThemedRating size={32} value={avg} />
                            <div>{count ? `${count}x` : ""}</div>
                        </div>
                        <p className="mb-1 mt-3 text-lg text-center md:text-right">
                            {visitsCount ? `${visitsCount} uživatelů navštívilo.` : `Žádné zaznamenané návštěvy.`}
                        </p>
                        {visitsCount > 0 ? <p className="text-lg text-center md:text-right">Naposledy navštíveno 28.2.2024 uživatelem Dowl</p> : null}
                        <p className="mb-2 hidden md:block mt-5">Lokalita: {tower.county}</p>
                        <p className="mb-2 hidden md:block">Výška: {tower.height} m</p>
                        <p className="mb-2 hidden md:block">Počet schodů: {tower.stairs}</p>
                        <p className="mb-2 hidden md:block">Rok otevření: {new Date(tower.opened).getFullYear()}</p>
                    </div>
                </div>
                <div className="flex-1 max-h-80 h-80">
                    <Link href={`${tower.type}/${tower.nameID}`}>
                        <img src={tower.mainPhotoUrl} alt={tower.name} className="rounded-xl object-contain max-h-80" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TowerOfTheDay;
