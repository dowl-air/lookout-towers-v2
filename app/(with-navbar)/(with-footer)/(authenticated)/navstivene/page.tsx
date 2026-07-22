import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import ProfileVisits from "@/components/profile/ProfileVisits";
import VisitsStats from "@/components/profile/visit-card/VisitsStats";
import VisitPagination from "@/components/profile/VisitPagination";
import { getTowersByIDs } from "@/data/tower/towers";
import {
    getUserRatingsForTowers,
    getUserVisitsPage,
    getUserVisitStats,
} from "@/data/user/user-visits";
import { parseVisitPage } from "@/utils/visitPagination";

export const metadata: Metadata = {
    title: "Navštívené rozhledny",
};

type VisitSearchParams = {
    after?: string | string[];
    before?: string | string[];
    page?: string | string[];
};

const getSearchParam = (value: string | string[] | undefined): string | undefined =>
    typeof value === "string" ? value : undefined;

const VisitedTowersPage = async ({
    searchParams,
}: {
    searchParams?: Promise<VisitSearchParams>;
}) => {
    await connection();

    const params = await searchParams;
    const page = parseVisitPage(params?.page);
    const after = getSearchParam(params?.after);
    const before = getSearchParam(params?.before);
    const [visitPage, stats] = await Promise.all([
        getUserVisitsPage({ after, before }),
        getUserVisitStats(),
    ]);
    const totalPages = Math.max(Math.ceil(stats.count / 25), 1);
    if (page > totalPages) {
        notFound();
    }

    const towerIds = visitPage.visits.map((visit) => visit.tower_id);
    const [towers, ratings] = await Promise.all([
        getTowersByIDs(towerIds),
        getUserRatingsForTowers(towerIds),
    ]);

    return (
        <div className="flex flex-col my-8 gap-5 max-w-[calc(min(99dvw,80rem))] px-3 xl:px-0 m-auto">
            <article className="prose max-w-max px-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl">Moje navštívené rozhledny</h1>
                <p className="text-sm sm:text-base lg:text-lg">
                    Zde najdete seznam všech rozhleden, které jste navštívili. Pokud jste nějakou
                    rozhlednu navštívili, ale není zde uvedena, můžete si návštěvu přidat na stránce
                    dané rozhledny.
                </p>
            </article>
            <VisitsStats stats={stats} />
            <VisitPagination
                currentPage={page}
                totalPages={totalPages}
                hasNextPage={visitPage.hasNextPage}
                hasPreviousPage={visitPage.hasPreviousPage}
                nextCursor={visitPage.nextCursor}
                previousCursor={visitPage.previousCursor}
            />
            <ProfileVisits
                visits={visitPage.visits}
                towers={towers}
                ratings={ratings}
                totalVisits={stats.count}
                page={page}
            />
            <VisitPagination
                currentPage={page}
                totalPages={totalPages}
                hasNextPage={visitPage.hasNextPage}
                hasPreviousPage={visitPage.hasPreviousPage}
                nextCursor={visitPage.nextCursor}
                previousCursor={visitPage.previousCursor}
            />
        </div>
    );
};

export default VisitedTowersPage;
