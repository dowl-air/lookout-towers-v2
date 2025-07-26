import Image from "next/image";
import Link from "next/link";

import { getAllMembers } from "@/actions/members/members.action";
import { formatDate } from "@/utils/date";
import { getUserLevel } from "@/utils/userLevels";

//todo create compoennts for badges and alerts

const ComunityPage = async () => {
    const members = await getAllMembers();

    return (
        <div className="content">
            <article className="prose mt-20">
                <h2 className="my-3 pl-2">Statistiky uživatelů</h2>
            </article>

            <div className="overflow-x-auto mb-20">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Uživatel</th>
                            <th></th>
                            <th>Navštívené rozhledny</th>
                            <th>Poslední návštěva</th>
                            <th>Provedené úpravy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => {
                            const { name, color, level } = getUserLevel(member.visits);
                            return (
                                <tr key={member.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <Image src={member.image} alt={member.name} width={48} height={48} unoptimized />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{member.name}</div>
                                                <div className="text-sm opacity-50">Česko</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        <div className="flex flex-wrap gap-1">
                                            {member.id === "iMKZNJV5PE4XQjnKmZut" && <div className="badge bg-red-600 text-white">Autor</div>}
                                            <div
                                                className="badge whitespace-nowrap"
                                                style={{ backgroundColor: color, color: level > 3 ? "white" : "black" }}
                                            >
                                                {name}
                                            </div>
                                        </div>
                                    </td>

                                    <td>{member.visits}</td>

                                    <td>
                                        {member.lastVisited && (
                                            <Link
                                                href={`/${member.lastVisited.tower.type}/${member.lastVisited.tower.nameID}`}
                                                className="flex gap-3"
                                            >
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <Image
                                                        src={member.lastVisited.tower.mainPhotoUrl}
                                                        alt={member.lastVisited.tower.name}
                                                        width={48}
                                                        height={48}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-bold">{member.lastVisited.tower.name}</div>
                                                    <div className="text-sm opacity-50">{formatDate({ date: member.lastVisited.date })}</div>
                                                </div>
                                            </Link>
                                        )}
                                    </td>

                                    <td>{member.changes}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComunityPage;
