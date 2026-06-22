import TowerFavouriteAction from "@/components/shared/TowerFavouriteAction";
import TowerVisitAction from "@/components/shared/TowerVisitAction";
import ShareButton from "@/components/tower/top/ShareButton";
import { Tower } from "@/types/Tower";

async function Buttons({ tower }: { tower: Tower }) {
    const revalidatePaths = ["/", `/${tower.type}/${tower.nameID}`];

    return (
        <div className="flex w-full max-w-full flex-wrap items-center gap-2 overflow-hidden lg:mb-3!">
            <div className="min-w-0 flex-1 sm:flex-none">
                <TowerVisitAction
                    tower={tower}
                    revalidatePaths={revalidatePaths}
                    idleLabel="Uložit návštěvu"
                    className="btn-primary min-w-0 w-full shrink text-sm min-[710px]:text-sm sm:w-auto md:min-w-0 md:w-auto"
                />
            </div>
            <div className="shrink-0">
                <TowerFavouriteAction
                    towerID={tower.id}
                    revalidatePaths={revalidatePaths}
                    tone="outline"
                    className="min-w-10 w-10 shrink-0 px-0 text-sm sm:w-auto sm:min-w-0 sm:px-3 min-[710px]:text-sm md:min-w-0 md:w-auto [&>span]:hidden sm:[&>span]:inline"
                />
            </div>
            <div className="shrink-0">
                <ShareButton
                    tower={tower}
                    className="min-w-10 w-10 shrink-0 px-0 text-sm sm:w-auto sm:min-w-0 sm:px-3 [&>span]:hidden sm:[&>span]:inline"
                />
            </div>
        </div>
    );
}

export default Buttons;
