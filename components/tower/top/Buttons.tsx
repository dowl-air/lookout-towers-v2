import { loginRedirect } from "@/actions/login.redirect";
import { auth } from "@/auth";
import { Tower } from "@/typings";
import { FavouriteButton } from "./buttons/FavouriteButton";
import { checkFavourite } from "@/actions/favourites/favourites.action";
import { VisitButton } from "./buttons/VisitButton";
import { getVisit } from "@/actions/visits/visits.action";

async function Buttons({ tower }: { tower: Tower }) {
    const session = await auth();

    if (!session?.user) {
        return (
            <div className="flex flex-col gap-2">
                <form action={loginRedirect} className="flex flex-row lg:flex-col justify-center gap-2">
                    <button type="submit" className="btn btn-primary max-w-xs lg:min-w-64 text-sm min-[710px]:text-base">
                        Přidat do oblíbených
                    </button>
                    <button type="submit" className="btn btn-primary max-w-xs lg:min-w-64 text-sm min-[710px]:text-base">
                        Zaznamenat návštěvu
                    </button>
                </form>
            </div>
        );
    }

    const isFavourite = await checkFavourite(tower.id);
    const visit = await getVisit(tower.id);

    return (
        <div className="flex flex-col gap-2">
            <FavouriteButton isFavouriteInit={isFavourite} towerID={tower.id} />
            <VisitButton visitInit={visit} tower={tower} />
        </div>
    );
}

export default Buttons;
