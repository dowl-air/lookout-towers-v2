import { getTowerOfTheDay, getTowerRatingAndCount, getTowerVisitsCount } from "@/actions/towers/towers.action";
import { towerTypeMappedUrl } from "@/utils/constants";
import Link from "next/link";
import ThemedRating from "../shared/ThemedRating";
import { formatDate } from "@/utils/date";
import { getMostRecentTowerVisit } from "@/actions/visits/visits.action";
import { User } from "next-auth";
import { getUser } from "@/actions/members/members.action";

export const revalidate = 3600;

const TowerOfTheDay = async () => {
    const tower = await getTowerOfTheDay();
    let user: User = {};
    const [{ avg, count }, { count: visitsCount }, towerRecentVisit] = await Promise.all([
        getTowerRatingAndCount(tower.id),
        getTowerVisitsCount(tower.id),
        getMostRecentTowerVisit(tower.id),
    ]);
    if (towerRecentVisit) user = await getUser(towerRecentVisit.user_id);

    return (
        <div className="max-w-[1070px] w-full mx-auto px-4 mt-10 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">Rozhledna dne </h2>
            <p className="text-center text-lg md:text-xl mb-6">Dnes je {formatDate({ date: new Date(), long: true })}.</p>
            <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-4">
                <div className="flex-1">
                    <div className="flex flex-col bg-base-100 rounded-xl p-6 items-center md:items-end">
                        <h2 className="text-2xl mb-3 text-center md:text-right">
                            Byla vybrána {towerTypeMappedUrl[tower.type] ?? tower.type}{" "}
                            <Link className="font-bold underline underline-offset-2 whitespace-nowrap" href={`${tower.type}/${tower.nameID}`}>
                                {tower.name}
                            </Link>
                            .
                        </h2>
                        <div className="flex items-center gap-2 mb-2">
                            <ThemedRating size={32} value={avg} />
                            <div>{count ? `${count}x` : ""}</div>
                        </div>
                        <p className="mb-1 mt-3 text-lg text-center md:text-right">
                            {visitsCount
                                ? `Celkem navštíveno ${visitsCount} ${visitsCount > 1 ? "uživateli" : "uživatelem"}.`
                                : `Žádné zaznamenané návštěvy.`}
                        </p>
                        {towerRecentVisit ? (
                            <p className="text-lg text-center md:text-right">
                                Naposledy navštíveno{" "}
                                <span className="font-semibold text-nowrap">{formatDate({ date: towerRecentVisit.date, long: true })}</span>{" "}
                                uživatelem <span className="font-semibold whitespace-nowrap">{user.name}</span>.
                            </p>
                        ) : null}
                        <p className="mb-2 hidden md:block mt-5">Lokalita: {tower.county}</p>
                        <p className="mb-2 hidden md:block">Výška: {tower.height} m</p>
                        <p className="mb-2 hidden md:block">Počet schodů: {tower.stairs}</p>
                        <p className="mb-2 hidden md:block">Rok otevření: {new Date(tower.opened).getFullYear()}</p>
                    </div>
                </div>
                <div className="flex-1 max-h-[22rem] h-[22rem] w-full min-[450px]:w-auto min-[450px]:h-80 min-[450px]:max-h-80">
                    <Link href={`${tower.type}/${tower.nameID}`}>
                        <img
                            src={tower.mainPhotoUrl}
                            alt={tower.name}
                            className="rounded-xl object-cover object-top w-full min-[450px]:object-contain min-[450px]:w-auto max-h-[22rem] min-[450px]:max-h-80"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TowerOfTheDay;
