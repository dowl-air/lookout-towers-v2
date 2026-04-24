import TowerFavouriteAction from "@/components/shared/TowerFavouriteAction";
import TowerVisitAction from "@/components/shared/TowerVisitAction";
import { Tower } from "@/types/Tower";

async function Buttons({ tower }: { tower: Tower }) {
    const revalidatePaths = ["/", `/${tower.type}/${tower.nameID}`];

    return (
        <div className="flex gap-2 sm:flex-wrap lg:mb-3! lg:flex-col">
            <TowerFavouriteAction towerID={tower.id} revalidatePaths={revalidatePaths} />
            <TowerVisitAction tower={tower} revalidatePaths={revalidatePaths} />
        </div>
    );
}

export default Buttons;
