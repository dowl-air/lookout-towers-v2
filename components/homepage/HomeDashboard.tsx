import {
    BarChart3,
    Bookmark,
    Camera,
    CheckCircle2,
    Heart,
    ImageIcon,
    LogIn,
    MapPinned,
    Route,
    Star,
    Trophy,
    UserPlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { ReactNode } from "react";

import HomeDashboardRecommendations from "@/components/homepage/HomeDashboardRecommendations";
import UserLevelBadgeButton from "@/components/shared/UserLevelBadgeButton";
import { getHomeDashboardData, HomeDashboardData } from "@/data/homepage/home-dashboard";
import { Tower } from "@/types/Tower";
import { formatDate } from "@/utils/date";

type DashboardWidget = {
    content: ReactNode;
    id: string;
};

const numberFormatter = new Intl.NumberFormat("cs-CZ");

const benefitItems = [
    { icon: CheckCircle2, label: "Ukládání návštěv" },
    { icon: Star, label: "Hodnocení rozhleden" },
    { icon: Camera, label: "Soukromé fotografie a odkazy" },
    { icon: BarChart3, label: "Osobní statistiky" },
    { icon: Trophy, label: "Pokrok v objevování" },
    { icon: Heart, label: "Oblíbené rozhledny" },
];

const getUserFirstName = (name: string | undefined): string => {
    if (!name) {
        return "";
    }

    return name.trim().split(/\s+/)[0] || "";
};

const getTowerHref = (tower: Tower): string => `/${tower.type || "rozhledna"}/${tower.nameID}`;

const formatTowerVisitCount = (count: number): string => {
    if (count === 1) {
        return "1 rozhlednu";
    }

    if (count >= 2 && count <= 4) {
        return `${numberFormatter.format(count)} rozhledny`;
    }

    return `${numberFormatter.format(count)} rozhleden`;
};

function DashboardShell({ children }: { children: ReactNode }) {
    return (
        <section className="mx-auto mt-10 w-full max-w-[1070px] px-4">
            <div className="overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-sm">
                {children}
            </div>
        </section>
    );
}

function HomeDashboardError() {
    return (
        <DashboardShell>
            <div className="flex flex-col gap-3 p-5 sm:p-7 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-warning">
                        Osobní přehled se nepodařilo načíst
                    </p>
                    <h2 className="mt-1 text-2xl font-bold">
                        Výletní přehled je dočasně nedostupný.
                    </h2>
                </div>
                <Link href="/rozhledny" className="btn btn-primary w-full md:w-auto">
                    Procházet rozhledny
                </Link>
            </div>
        </DashboardShell>
    );
}

function AnonymousDashboard() {
    return (
        <DashboardShell>
            <div className="relative overflow-hidden">
                <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[url('/img/rozhledna_bukovka.jpg')] bg-cover bg-center opacity-18 md:block" />
                <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-linear-to-r from-base-100 via-base-100/85 to-base-100/55 md:block" />
                <div className="relative grid gap-8 p-5 sm:p-7 lg:grid-cols-[1fr_0.9fr] lg:p-8">
                    <div className="flex flex-col gap-5">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                                Osobní výpravy
                            </p>
                            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                                Vítejte v Rozhlednovém světě
                            </h2>
                        </div>
                        <p className="max-w-2xl text-base leading-7 text-base-content/75 md:text-lg">
                            Ukládejte si navštívené rozhledny, přidávejte hodnocení, fotografie,
                            vytvářejte si statistiky a sledujte svůj pokrok.
                        </p>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link href="/signin?callbackUrl=/profil" className="btn btn-primary">
                                <UserPlus aria-hidden="true" size={18} />
                                Registrovat se
                            </Link>
                            <Link href="/signin?callbackUrl=/" className="btn btn-outline">
                                <LogIn aria-hidden="true" size={18} />
                                Přihlásit se
                            </Link>
                        </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {benefitItems.map(({ icon: Icon, label }) => (
                            <div
                                key={label}
                                className="flex items-center gap-3 rounded-lg border border-base-300 bg-base-200/55 px-4 py-3"
                            >
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                                    <Icon aria-hidden="true" size={20} />
                                </span>
                                <span className="text-sm font-semibold leading-5">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}

function EmptyVisitsDashboard({ userName }: { userName: string }) {
    return (
        <DashboardShell>
            <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[1fr_auto] md:items-center">
                <div className="flex flex-col gap-3">
                    <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                        Vítejte zpět{userName ? `, ${userName}` : ""}
                    </p>
                    <h2 className="text-3xl font-bold">Začněte svou první výpravou.</h2>
                    <p className="max-w-2xl text-base leading-7 text-base-content/75">
                        Zatím nemáte zaznamenanou žádnou návštěvu rozhledny. Vyberte místo, které
                        chcete přidat do svého osobního přehledu.
                    </p>
                </div>
                <Link href="/rozhledny" className="btn btn-primary w-full md:w-auto">
                    <Route aria-hidden="true" size={18} />
                    Přidat první návštěvu
                </Link>
            </div>
        </DashboardShell>
    );
}

function LastVisitWidget({
    lastVisit,
}: {
    lastVisit: NonNullable<Extract<HomeDashboardData, { isAuthenticated: true }>["lastVisit"]>;
}) {
    const tower = lastVisit.tower;
    const href = tower ? getTowerHref(tower) : "/navstivene";
    const ratingHref = tower ? `${href}#tower-rating-form` : href;
    const photoUrl = lastVisit.photoUrl || tower?.mainPhotoUrl || null;
    const action = !lastVisit.hasRating
        ? {
              buttonClassName: "btn-warning",
              buttonLabel: "Přidat hodnocení",
              href: ratingHref,
              Icon: Star,
              label: "Ohodnoťte svou poslední návštěvu",
          }
        : !lastVisit.hasPhoto
          ? {
                buttonClassName: "btn-primary",
                buttonLabel: "Přidat fotografii",
                href,
                Icon: Camera,
                label: "Přidat k návštěvě fotografii",
            }
          : {
                buttonClassName: null,
                buttonLabel: null,
                href: null,
                Icon: CheckCircle2,
                label: "Výborně! Vaše návštěva je kompletní.",
            };
    const ActionIcon = action.Icon;

    return (
        <article className="grid gap-4 rounded-lg border border-base-300 bg-base-100 p-4 sm:grid-cols-[160px_1fr]">
            <Link
                href={href}
                className="relative flex aspect-video min-h-32 items-center justify-center overflow-hidden rounded-lg bg-base-200 text-base-content/45 sm:aspect-square"
            >
                {photoUrl ? (
                    <Image
                        src={photoUrl}
                        alt={tower ? tower.name : "Poslední navštívená rozhledna"}
                        fill
                        sizes="(min-width: 1024px) 160px, (min-width: 640px) 30vw, 100vw"
                        className="object-cover"
                    />
                ) : (
                    <ImageIcon aria-hidden="true" size={34} />
                )}
            </Link>
            <div className="flex flex-col gap-3">
                <div>
                    <p className="text-sm font-semibold text-primary">Poslední návštěva</p>
                    <h3 className="mt-1 text-2xl font-bold leading-tight">
                        {tower ? tower.name : "Rozhledna bez detailu"}
                    </h3>
                    <p className="mt-1 text-sm text-base-content/65">
                        Navštíveno {formatDate({ date: lastVisit.date, long: true })}
                    </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 items-center gap-2 text-sm font-semibold leading-5 text-base-content/75">
                        <ActionIcon
                            aria-hidden="true"
                            size={16}
                            className="size-4 shrink-0 self-center text-primary"
                        />
                        <span className="leading-5">{action.label}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    {action.href && action.buttonLabel ? (
                        <Link
                            href={action.href}
                            className={`btn btn-sm w-full sm:w-auto ${action.buttonClassName}`}
                        >
                            <ActionIcon aria-hidden="true" size={16} />
                            {action.buttonLabel}
                        </Link>
                    ) : null}
                    {tower ? (
                        <Link href={href} className="btn btn-sm btn-outline hidden sm:inline-flex">
                            Detail rozhledny
                        </Link>
                    ) : null}
                </div>
            </div>
        </article>
    );
}

function ProgressWidget({
    progress,
}: {
    progress: Extract<HomeDashboardData, { isAuthenticated: true }>["progress"];
}) {
    const percent = progress.progressPercent;
    const levelPercent = progress.levelProgressPercent;
    const stats = [
        { label: "Navštívené rozhledny", value: progress.visitsCount, icon: MapPinned },
        { label: "Přidaná hodnocení", value: progress.ratingsCount, icon: Star },
        { label: "Oblíbené rozhledny", value: progress.favouritesCount, icon: Bookmark },
        { label: "Z přístupných objektů", value: `${percent} %`, icon: Trophy },
    ];
    const nextLevelText = progress.nextLevelName
        ? `Navštivte ještě ${formatTowerVisitCount(progress.remainingVisitsToNextLevel)} a bude z vás ${progress.nextLevelName}!`
        : "Máte nejvyšší úroveň.";

    return (
        <article className="rounded-lg border border-base-300 bg-base-100 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-primary">Přehled pokroku</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span className="text-2xl font-bold leading-tight">
                            {numberFormatter.format(progress.visitsCount)} /{" "}
                            {numberFormatter.format(progress.nextLevelVisits)}
                        </span>
                        <UserLevelBadgeButton
                            color={progress.currentLevelColor}
                            name={progress.currentLevelName}
                            textColor={progress.currentLevelTextColor}
                        />
                        <span className="min-w-0 text-sm font-semibold text-base-content/70">
                            {nextLevelText}
                        </span>
                    </div>
                </div>
                <Link href="/pokrok" className="btn btn-sm btn-outline w-full sm:w-auto">
                    Zobrazit stránku pokroku
                </Link>
            </div>
            <progress
                className="progress progress-primary mt-4 h-3 w-full"
                value={levelPercent}
                max={100}
                aria-label="Pokrok k další uživatelské úrovni"
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map(({ icon: Icon, label, value }, index) => (
                    <div
                        key={label}
                        className={`items-center gap-3 rounded-lg bg-base-200/65 p-3 ${
                            index > 1 ? "hidden sm:flex" : "flex"
                        }`}
                    >
                        <Icon aria-hidden="true" size={20} className="shrink-0 text-primary" />
                        <div>
                            <div className="text-xl font-bold">
                                {typeof value === "number" ? numberFormatter.format(value) : value}
                            </div>
                            <div className="text-xs font-medium text-base-content/65">{label}</div>
                        </div>
                    </div>
                ))}
            </div>
        </article>
    );
}

function createAuthenticatedDashboardWidgets(
    data: Extract<HomeDashboardData, { isAuthenticated: true }>
): DashboardWidget[] {
    const widgets: Array<DashboardWidget | null> = [
        data.lastVisit
            ? {
                  content: <LastVisitWidget lastVisit={data.lastVisit} />,
                  id: "last-visit",
              }
            : null,
        {
            content: <ProgressWidget progress={data.progress} />,
            id: "progress",
        },
        data.recommendations.length > 0
            ? {
                  content: (
                      <HomeDashboardRecommendations
                          recommendations={data.recommendations}
                          visitedTowerIds={data.visitedTowerIds}
                      />
                  ),
                  id: "recommendations",
              }
            : null,
    ];

    return widgets.filter((widget): widget is DashboardWidget => Boolean(widget));
}

function AuthenticatedDashboard({
    data,
}: {
    data: Extract<HomeDashboardData, { isAuthenticated: true }>;
}) {
    const userName = getUserFirstName(data.user?.name);

    if (!data.lastVisit) {
        return <EmptyVisitsDashboard userName={userName} />;
    }

    const widgets = createAuthenticatedDashboardWidgets(data);

    return (
        <DashboardShell>
            <div className="border-b border-base-300 bg-base-200/55 p-5 sm:p-7">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                    Osobní přehled
                </p>
                <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold md:text-4xl">
                            Vítejte zpět{userName ? `, ${userName}` : ""}!
                        </h2>
                        <p className="mt-2 max-w-2xl text-base text-base-content/70">
                            Kam vyrazíte tentokrát? Proměňte svůj další výlet v užitečný záznam pro
                            sebe a dodejte hodnocení pro ostatní.
                        </p>
                    </div>
                    <Link href="/navstivene" className="btn btn-outline w-full sm:w-auto">
                        Navštívené rozhledny
                    </Link>
                </div>
            </div>
            <div className="grid gap-4 bg-base-200/25 p-4 sm:p-5">
                {widgets.map((widget) => (
                    <div key={widget.id}>{widget.content}</div>
                ))}
            </div>
        </DashboardShell>
    );
}

async function HomeDashboard() {
    await connection();

    try {
        const data = await getHomeDashboardData();

        if (!data.isAuthenticated) {
            return <AnonymousDashboard />;
        }

        return <AuthenticatedDashboard data={data} />;
    } catch (error) {
        console.error("Error loading home dashboard:", error);
        return <HomeDashboardError />;
    }
}

export default HomeDashboard;
