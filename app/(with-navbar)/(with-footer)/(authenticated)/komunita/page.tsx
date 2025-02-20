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
            {/* <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                Otevřeno, zavírá 20:00
            </span>
            <span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                <span className="w-2 h-2 mr-1 bg-red-500 rounded-full"></span>
                Zavřeno
            </span>
            <div className="alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
                <span>Rozhledna je otevřená pouze příležitostně.</span>
            </div>
            <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
                <span>Rozhledna je označena za zaniklou.</span>
            </div> */}

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
                                                    <Image src={member.image} alt={member.name} width={48} height={48} />
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
                                            <div className="badge" style={{ backgroundColor: color, color: level > 3 ? "white" : "black" }}>
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
