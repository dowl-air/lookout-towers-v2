import AddSource from "@/components/tower/tiles/sources/AddSource";
import { CONCURRENCE_LOGOS } from "@/constants/concurrenceLogos";
import { Tower } from "@/types/Tower";
import { extractDomain, extractDomainAndPath } from "@/utils/extractDomain";
import Link from "next/link";

const Sources = ({ tower }: { tower: Tower }) => {
    const hasSomeSources = tower.urls && tower.urls.length > 0;

    return (
        <div className="card card-compact sm:card-normal w-full shadow-xl bg-[rgba(255,255,255,0.05)]">
            <div className="card-body">
                <div className="flex justify-between gap-4 flex-wrap">
                    <h2 className="card-title text-base sm:text-lg md:text-xl text-nowrap">Odkazy a zdroje</h2>
                    <AddSource tower={tower} />
                </div>
                <div className="flex flex-col gap-2.5 overflow-y-auto mt-4">
                    {hasSomeSources ? (
                        tower.urls
                            .sort((url1, url2) => {
                                const domainName1 = extractDomain(url1);
                                const domainName2 = extractDomain(url2);
                                const logo1 = CONCURRENCE_LOGOS[domainName1];
                                const logo2 = CONCURRENCE_LOGOS[domainName2];
                                if (logo1 && !logo2) return -1;
                                if (!logo1 && logo2) return 1;
                                return 0;
                            })
                            .map((url, idx) => {
                                if (!url || url.length < 5) return null;
                                const domainName = extractDomain(url);
                                const logo = CONCURRENCE_LOGOS[domainName];
                                return (
                                    <div key={idx} className="flex gap-4 items-center">
                                        <div className="opacity-65">[{idx + 1}]</div>
                                        {logo ? (
                                            <div className="avatar">
                                                <div className="w-7 rounded-full">
                                                    <img src={logo} className="object-contain!" />
                                                </div>
                                            </div>
                                        ) : null}
                                        <div className="link">
                                            <Link href={url} target="_blank" className="whitespace-nowrap">
                                                {extractDomainAndPath(url, true)}
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                    ) : (
                        <div className="text-sm text-gray-500">Žádné zdroje zatím nebyly přidány.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sources;
