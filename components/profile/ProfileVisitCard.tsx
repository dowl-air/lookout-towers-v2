import Link from "next/link";
import { Visit } from "@/types/Visit";
import { Tower } from "@/types/Tower";
import { Rating } from "@/types/Rating";
import VisitUrls from "@/components/profile/visit-card/VisitUrls";
import { formatDate } from "@/utils/date";
import VisitPhotos from "@/components/profile/visit-card/VisitPhotos";
import TowerPhoto from "@/components/profile/visit-card/TowerPhoto";
import VisitRating from "@/components/profile/visit-card/VisitRating";
import VisitButtons from "@/components/profile/visit-card/VisitButtons";

function ProfileVisitCard({ visit, tower, rating, index }: { visit: Visit; tower: Tower; rating: Rating | null; index: number }) {
    return (
        <div className="card card-compact w-full bg-base-100 shadow-xl">
            <div className="card-body flex-row gap-3 justify-between">
                <div className="flex flex-row gap-5 flex-wrap flex-grow xl:flex-nowrap">
                    <div className="flex flex-grow gap-4 flex-wrap xl:flex-nowrap">
                        <TowerPhoto tower={tower} index={index} />
                        <div className="flex flex-col gap-3">
                            <Link href={`/${tower.type}/${tower.nameID}`}>
                                <article className="prose">
                                    <h2 className="text-lg lg:text-xl xl:text-2xl">{tower.name}</h2>
                                </article>
                            </Link>
                            <time className="text-base opacity-50">
                                <span>{formatDate({ date: visit.date, long: true })}</span>
                                <span className="ml-2">
                                    {new Date(visit.date).toLocaleTimeString("cs", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        timeZone: "Europe/Prague",
                                    })}
                                </span>
                            </time>
                            <p className="text-base mr-3">{visit.text}</p>
                            <VisitUrls visit={visit} />
                        </div>
                    </div>
                    <VisitPhotos visit={visit} tower={tower} />
                    <VisitRating rating={rating} />
                </div>
                <VisitButtons tower={tower} />
            </div>
        </div>
    );
}

export default ProfileVisitCard;
