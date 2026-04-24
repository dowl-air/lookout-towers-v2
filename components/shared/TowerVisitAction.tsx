import { loginRedirect } from "@/actions/login.redirect";
import { VisitButton, VisitButtonVariant } from "@/components/tower/top/buttons/VisitButton";
import { Tower } from "@/types/Tower";
import { cn } from "@/utils/cn";

import { getTowerActionState } from "./towerActionState";

type TowerVisitActionProps = {
    tower: Tower;
    revalidatePaths?: string[];
    variant?: VisitButtonVariant;
    className?: string;
    idleLabel?: string;
};

async function TowerVisitAction({
    tower,
    revalidatePaths,
    variant = "button",
    className,
    idleLabel = "Přidat do navštívených",
}: TowerVisitActionProps) {
    const { isAuthenticated, visit } = await getTowerActionState(tower.id);

    if (!isAuthenticated) {
        return (
            <form action={loginRedirect}>
                <button
                    type="submit"
                    className={
                        variant === "compact"
                            ? cn(
                                  "btn btn-outline btn-sm sm:btn-md h-10 min-h-10 whitespace-nowrap sm:h-12 sm:min-h-12",
                                  className
                              )
                            : cn(
                                  "btn btn-primary btn-sm sm:btn-md max-w-xs whitespace-nowrap text-sm min-[710px]:text-base md:w-full md:min-w-64",
                                  className
                              )
                    }
                >
                    {idleLabel}
                </button>
            </form>
        );
    }

    return (
        <VisitButton
            key={`${tower.id}:${visit?.date ?? "not-visited"}:${variant}`}
            visitInit={visit}
            tower={tower}
            revalidatePaths={revalidatePaths}
            variant={variant}
            className={className}
            idleLabel={idleLabel}
        />
    );
}

export default TowerVisitAction;
