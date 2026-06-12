import { cn } from "@/utils/cn";

type TowerAliasesProps = {
    aliases?: string[];
    className?: string;
};

const TowerAliases = ({ aliases, className }: TowerAliasesProps) => {
    const visibleAliases = aliases?.map((alias) => alias.trim()).filter(Boolean);

    if (!visibleAliases?.length) {
        return null;
    }

    return (
        <p
            aria-label={`Alternativní názvy: ${visibleAliases.join(", ")}`}
            className={cn(
                "mt-1 block w-full text-left line-clamp-2 text-sm leading-snug text-base-content/50",
                className
            )}
            title={visibleAliases.join(", ")}
        >
            {visibleAliases.join(", ")}
        </p>
    );
};

export default TowerAliases;
