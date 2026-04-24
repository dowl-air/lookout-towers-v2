import { getTotalChangesCount } from "@/data/change/total-count";
import { getTotalRatingsCount } from "@/data/rating/total-count";
import { getLastModifiedTowerDate } from "@/data/tower/last-modified-tower-date";
import { getTotalTowersCount } from "@/data/tower/total-count";
import { getTotalUsersCount } from "@/data/user/total-count";
import { formatDate } from "@/utils/date";

async function Stats() {
    const [changesNumber, ratingsNumber, usersNumber, towersNumber, towersDate] = await Promise.all(
        [
            getTotalChangesCount(),
            getTotalRatingsCount(),
            getTotalUsersCount(),
            getTotalTowersCount(),
            getLastModifiedTowerDate(),
        ]
    );

    const towersLabel = "Míst v databázi";
    const usersLabel = "Registrovaných uživatelů";
    const changesLabel = "Komunitních úprav";
    const ratingsLabel = "Sdílených hodnocení";
    const freshnessLabel = "Naposledy doplněno";
    const freshnessDescription = "Podle poslední změny v katalogu";

    return (
        <div className="max-w-[1070px] self-center flex flex-col w-full px-4 my-4">
            <div className="stats bg-primary text-primary-content stats-horizontal mt-5 hidden lg:inline-grid">
                <div className="stat">
                    <div className="stat-title text-primary-content">{towersLabel}</div>
                    <div className="stat-value">{towersNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">{usersLabel}</div>
                    <div className="stat-value">{usersNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">{changesLabel}</div>
                    <div className="stat-value">{changesNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">{ratingsLabel}</div>
                    <div className="stat-value">{ratingsNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">{freshnessLabel}</div>
                    <div className="stat-value">{formatDate({ date: towersDate })}</div>
                    <div className="stat-desc text-primary-content/80">{freshnessDescription}</div>
                </div>
            </div>

            <div className="stats bg-primary self-center text-primary-content stats-horizontal mt-10 hidden sm:inline-grid lg:hidden">
                <div className="stat">
                    <div className="stat-title text-primary-content">{towersLabel}</div>
                    <div className="stat-value">{towersNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">{usersLabel}</div>
                    <div className="stat-value">{usersNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">{changesLabel}</div>
                    <div className="stat-value">{changesNumber}</div>
                </div>
            </div>
            <div className="stats bg-primary mx-auto text-primary-content stats-horizontal mt-3 hidden sm:inline-grid lg:hidden">
                <div className="stat">
                    <div className="stat-title text-primary-content">{ratingsLabel}</div>
                    <div className="stat-value">{ratingsNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">{freshnessLabel}</div>
                    <div className="stat-value">{formatDate({ date: towersDate })}</div>
                    <div className="stat-desc text-primary-content/80">{freshnessDescription}</div>
                </div>
            </div>

            <div className="stats bg-primary text-primary-content stats-horizontal mt-10 hidden min-[430px]:inline-grid sm:hidden">
                <div className="stat">
                    <div className="stat-title text-primary-content">{towersLabel}</div>
                    <div className="stat-value">{towersNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">{usersLabel}</div>
                    <div className="stat-value">{usersNumber}</div>
                </div>
            </div>
            <div className="stats bg-primary text-primary-content stats-horizontal mt-3 hidden min-[430px]:inline-grid sm:hidden">
                <div className="stat">
                    <div className="stat-title text-primary-content">{changesLabel}</div>
                    <div className="stat-value">{changesNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">{ratingsLabel}</div>
                    <div className="stat-value">{ratingsNumber}</div>
                </div>
            </div>
            <div className="stats bg-primary text-primary-content stats-vertical hidden mt-3 min-[430px]:inline-grid sm:hidden">
                <div className="stat">
                    <div className="stat-title text-primary-content">{freshnessLabel}</div>
                    <div className="stat-value">{formatDate({ date: towersDate })}</div>
                    <div className="stat-desc text-primary-content/80">{freshnessDescription}</div>
                </div>
            </div>

            <div className="stats bg-primary text-primary-content stats-vertical w-full mt-3 inline-grid min-[430px]:hidden">
                <div className="flex">
                    <div className="stat">
                        <div className="stat-title text-primary-content text-center text-sm">
                            Místa
                        </div>
                        <div className="stat-value text-center text-2xl">{towersNumber}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title text-primary-content text-center text-sm">
                            Komunita
                        </div>
                        <div className="stat-value text-center text-2xl">{usersNumber}</div>
                    </div>
                </div>
                <div className="flex">
                    <div className="stat">
                        <div className="stat-title text-primary-content text-center text-sm">
                            Úpravy
                        </div>
                        <div className="stat-value text-center text-2xl">{changesNumber}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title text-primary-content text-center text-sm">
                            Hodnocení
                        </div>
                        <div className="stat-value text-center text-2xl">{ratingsNumber}</div>
                    </div>
                </div>
                <div className="flex">
                    <div className="stat">
                        <div className="stat-title text-primary-content text-center text-sm">
                            Doplněno
                        </div>
                        <div className="stat-value text-center text-2xl">
                            {formatDate({ date: towersDate })}
                        </div>
                        <div className="stat-desc text-center text-primary-content/80">
                            Poslední změna v katalogu
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Stats;
