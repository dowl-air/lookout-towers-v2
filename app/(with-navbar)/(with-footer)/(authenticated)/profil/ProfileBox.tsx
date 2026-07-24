import { ListChecks, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { checkAuth } from "@/actions/checkAuth";
import ProfileEditForm from "@/components/profile/ProfileEditForm";

import ProfileBoxLevel from "./ProfileBoxLevel";

async function ProfileBox({
    score,
    visits,
    favs,
    changes,
    ratings,
}: {
    score: number;
    visits: number;
    favs: number;
    changes: number;
    ratings: number;
}) {
    const user = await checkAuth();
    return (
        <aside className="card h-full bg-base-100 p-3 shadow-xl">
            <div className="flex flex-col gap-2 items-center p-3">
                <>
                    {user.image ? (
                        <div className="avatar">
                            <div className="w-20 rounded-full">
                                <Image
                                    src={user.image}
                                    width={112}
                                    height={112}
                                    alt={"profile picture"}
                                    referrerPolicy="no-referrer"
                                    unoptimized
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="avatar placeholder">
                            <div className="bg-neutral-focus text-neutral-content rounded-full w-28">
                                <span>{user.name ? user.name.substring(0, 2) : "TY"}</span>
                            </div>
                        </div>
                    )}
                </>
                <div className="flex items-center gap-1">
                    <h2 className="prose prose-2xl font-semibold">
                        {user.name ? user.name : "TY"}
                    </h2>
                    <ProfileEditForm
                        key={`${user.name}-${user.image}`}
                        name={user.name ?? ""}
                        image={user.image}
                    />
                </div>
                <ProfileBoxLevel score={score} />
            </div>
            <div className="flex flex-col justify-around text-primary font-bold p-3">
                <div className="stats stats-vertical w-full overflow-hidden shadow-sm">
                    <div className="stat min-w-0">
                        <div className="stat-figure text-primary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="inline-block w-8 h-8 stroke-current"
                            >
                                <circle cx="12" cy="10" r="3" />
                                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                            </svg>
                        </div>
                        <div className="stat-title">Návštěvy</div>

                        <div className="stat-value text-primary max-h-10">{visits}</div>
                    </div>

                    <div className="stat min-w-0">
                        <div className="stat-figure text-primary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block w-8 h-8 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                ></path>
                            </svg>
                        </div>
                        <div className="stat-title">Oblíbené</div>
                        <div className="stat-value text-primary max-h-10">{favs}</div>
                    </div>

                    <div className="stat min-w-0">
                        <div className="stat-figure text-primary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="inline-block w-8 h-8 stroke-current"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z" />
                            </svg>
                        </div>
                        <div className="stat-title">Úpravy</div>
                        <div className="stat-value text-primary max-h-10">{changes}</div>
                    </div>
                    <div className="stat min-w-0">
                        <div className="stat-figure text-primary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="inline-block w-8 h-8 stroke-current"
                            >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                        </div>
                        <div className="stat-title">Hodnocení</div>
                        <div className="stat-value text-primary max-h-10">{ratings}</div>
                    </div>
                </div>
                <div className="mt-5 grid gap-2">
                    <Link href="/navstivene" className="btn btn-outline btn-sm w-full">
                        <ListChecks aria-hidden="true" className="size-4" />
                        Navštívené rozhledny
                    </Link>
                    <Link href="/pokrok" className="btn btn-primary btn-sm w-full">
                        <Trophy aria-hidden="true" className="size-4" />
                        Můj pokrok
                    </Link>
                </div>
            </div>
        </aside>
    );
}

export default ProfileBox;
