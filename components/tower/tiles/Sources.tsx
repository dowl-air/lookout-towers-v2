import AddSource from "@/components/tower/tiles/sources/AddSource";
import { CONCURRENCE_LOGOS } from "@/constants/concurrenceLogos";
import { Tower } from "@/types/Tower";
import { extractDomain, extractDomainAndPath } from "@/utils/extractDomain";
import Link from "next/link";

const Sources = ({ tower }: { tower: Tower }) => {
    if (!Boolean(tower.urls?.length)) {
        return null;
    }

    return (
        <div className="card card-compact sm:card-normal w-full shadow-xl bg-[rgba(255,255,255,0.05)]">
            <div className="card-body">
                <div className="flex justify-between">
                    <h2 className="card-title text-base sm:text-lg md:text-xl text-nowrap">Odkazy a zdroje</h2>
                    <AddSource tower={tower} />
                </div>
                <div className="flex flex-col gap-1 overflow-y-auto mt-4">
                    {tower.urls.map((url, idx) => {
                        if (!url || url.length < 5) return null;
                        const domainName = extractDomain(url);
                        const logo = CONCURRENCE_LOGOS[domainName];
                        return (
                            <div key={idx} className="flex gap-3 items-center">
                                <div className="opacity-65">[{idx + 1}]</div>
                                {logo ? (
                                    <div className="avatar">
                                        <div className="w-7 rounded-full">
                                            <img src={logo} />
                                        </div>
                                    </div>
                                ) : null}
                                <div className="link">
                                    <Link href={url} target="_blank">
                                        {extractDomainAndPath(url)}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Sources;
