import { OpeningHoursForbiddenType } from "@/types/OpeningHours";
import { TowersSearchParams } from "@/types/TowersSearchParams";

export class TowersFilter {
    private filters: string[] = [];

    constructor(searchParams: TowersSearchParams) {
        const province = searchParams?.province || "";
        const county = searchParams?.county || "";
        const showFilter = searchParams?.showFilter || "";

        if (province) this.addFilter(`province:=${province}`);
        if (county) this.addFilter(`county:=${county}`);

        switch (showFilter) {
            case "showOnlyGone":
                this.addFilter(`openingHours.forbiddenType:=${OpeningHoursForbiddenType.Gone}`);
                break;
            case "showAll":
                break;
            default:
                this.addFilter(`openingHours.forbiddenType:!=${OpeningHoursForbiddenType.Gone}`);
                break;
        }
    }

    public addFilter(filter: string): void {
        this.filters.push(filter);
    }

    public getFilterString(): string {
        return this.filters.join(" && ");
    }
}
