import Image from "next/image";
import Link from "next/link";

import UserLevelBadgeButton from "@/components/shared/UserLevelBadgeButton";
import UserProfileAvatar from "@/components/UserProfileAvatar";
import { getAllMembers } from "@/data/user/users-community";
import { formatMonthYear } from "@/utils/date";
import { getUserLevel } from "@/utils/userLevels";

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
                            <th>Přidané hodnocení</th>
                            <th>Provedené úpravy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => {
                            return (
                                <tr key={member.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <UserProfileAvatar
                                                name={member.name}
                                                image={member.image}
                                            />
                                            <div>
                                                <div className="font-bold">{member.name}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        <div className="flex flex-wrap gap-1">
                                            {member.id === "iMKZNJV5PE4XQjnKmZut" && (
                                                <div className="badge bg-red-600 text-white">
                                                    Autor
                                                </div>
                                            )}
                                            <UserLevelBadgeButton
                                                className="whitespace-nowrap"
                                                size="default"
                                                {...getUserLevel(member.visits)}
                                            />
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
                                                        className="w-12 h-12 object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-bold">
                                                        {member.lastVisited.tower.name}
                                                    </div>
                                                    <div className="text-sm opacity-50">
                                                        {formatMonthYear({
                                                            date: member.lastVisited.date,
                                                        })}
                                                    </div>
                                                </div>
                                            </Link>
                                        )}
                                    </td>

                                    <td>{member.ratings}</td>

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
