export const VISITS_PER_PAGE = 25;

export const parseVisitPage = (value: string | string[] | undefined): number => {
    if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
        return 1;
    }

    return Number(value);
};

export const getVisitNumber = ({
    totalVisits,
    page,
    index,
}: {
    totalVisits: number;
    page: number;
    index: number;
}): number => totalVisits - (page - 1) * VISITS_PER_PAGE - index;

export const createVisitPageUrl = ({
    after,
    before,
    page,
}: {
    after?: string;
    before?: string;
    page: number;
}): string => {
    const params = new URLSearchParams();

    if (after) {
        params.set("after", after);
    }

    if (before) {
        params.set("before", before);
    }

    if (page > 1) {
        params.set("page", String(page));
    }

    const query = params.toString();
    return query ? `/navstivene?${query}` : "/navstivene";
};
