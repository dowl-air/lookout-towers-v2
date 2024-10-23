import { getChangesCount, getLastModifiedTowerDate, getRatingsCount, getTowersCount, getUsersCount } from "@/actions/towers/tower.stats";

export const revalidate = 3600;

async function Stats() {
    const changesNumberPromise: Promise<number> = getChangesCount();
    const ratingsNumberPromise: Promise<number> = getRatingsCount();
    const usersNumberPromise: Promise<number> = getUsersCount();
    const towersNumberPromise: Promise<number> = getTowersCount();
    const towersDatePromise: Promise<Date> = getLastModifiedTowerDate();

    const [changesNumber, ratingsNumber, usersNumber, towersNumber, towersDate] = await Promise.all([
        changesNumberPromise,
        ratingsNumberPromise,
        usersNumberPromise,
        towersNumberPromise,
        towersDatePromise,
    ]);

    return (
        <div className="max-w-[1070px] self-center flex flex-col w-full px-4 my-4">
            <div className="stats bg-primary text-primary-content stats-horizontal mt-5 hidden lg:inline-grid">
                <div className="stat">
                    <div className="stat-title text-primary-content">Rozhleden v databázi</div>
                    <div className="stat-value">{towersNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">Aktivních uživatelů</div>
                    <div className="stat-value">{usersNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">Provedených úprav</div>
                    <div className="stat-value">{changesNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">Přidaných hodnocení</div>
                    <div className="stat-value">{ratingsNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">Poslední změna</div>
                    <div className="stat-value">{`${towersDate.getDate()}. ${towersDate.getMonth() + 1}. ${towersDate.getFullYear()}`}</div>
                </div>
            </div>

            <div className="stats bg-primary self-center text-primary-content stats-horizontal mt-10 hidden sm:inline-grid lg:hidden">
                <div className="stat">
                    <div className="stat-title text-primary-content">Rozhleden v databázi</div>
                    <div className="stat-value">{towersNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">Aktivních uživatelů</div>
                    <div className="stat-value">{usersNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">Provedených úprav</div>
                    <div className="stat-value">{changesNumber}</div>
                </div>
            </div>
            <div className="stats bg-primary mx-auto text-primary-content stats-horizontal mt-3 hidden sm:inline-grid lg:hidden">
                <div className="stat">
                    <div className="stat-title text-primary-content">Přidaných hodnocení</div>
                    <div className="stat-value">{ratingsNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">Poslední změna</div>
                    <div className="stat-value">{`${towersDate.getDate()}. ${towersDate.getMonth() + 1}. ${towersDate.getFullYear()}`}</div>
                </div>
            </div>

            <div className="stats bg-primary text-primary-content stats-horizontal mt-10 hidden min-[430px]:inline-grid sm:hidden">
                <div className="stat">
                    <div className="stat-title text-primary-content">Rozhleden v databázi</div>
                    <div className="stat-value">{towersNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">Aktivních uživatelů</div>
                    <div className="stat-value">{usersNumber}</div>
                </div>
            </div>
            <div className="stats bg-primary text-primary-content stats-horizontal mt-3 hidden min-[430px]:inline-grid sm:hidden">
                <div className="stat">
                    <div className="stat-title text-primary-content">Provedených úprav</div>
                    <div className="stat-value">{changesNumber}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-primary-content">Přidaných hodnocení</div>
                    <div className="stat-value">{ratingsNumber}</div>
                </div>
            </div>
            <div className="stats bg-primary text-primary-content stats-vertical hidden mt-3 min-[430px]:inline-grid sm:hidden">
                <div className="stat">
                    <div className="stat-title text-primary-content">Poslední změna</div>
                    <div className="stat-value">{`${towersDate.getDate()}. ${towersDate.getMonth() + 1}. ${towersDate.getFullYear()}`}</div>
                </div>
            </div>

            <div className="stats bg-primary text-primary-content stats-vertical w-full mt-3 inline-grid min-[430px]:hidden">
                <div className="flex">
                    <div className="stat">
                        <div className="stat-title text-primary-content text-base">Rozhledny</div>
                        <div className="stat-value">{towersNumber}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title text-primary-content text-base">Uživatelé</div>
                        <div className="stat-value">{usersNumber}</div>
                    </div>
                </div>
                <div className="flex">
                    <div className="stat">
                        <div className="stat-title text-primary-content text-base">Úpravy</div>
                        <div className="stat-value">{changesNumber}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title text-primary-content text-base">Hodnocení</div>
                        <div className="stat-value">{ratingsNumber}</div>
                    </div>
                </div>
                <div className="flex">
                    <div className="stat">
                        <div className="stat-title text-primary-content">Poslední změna</div>
                        <div className="stat-value">{`${towersDate.getDate()}. ${towersDate.getMonth() + 1}. ${towersDate.getFullYear()}`}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Stats;
