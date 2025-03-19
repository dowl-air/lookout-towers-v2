import { Tower } from "@/types/Tower";
import { TowerTag } from "@/types/TowerTags";

const TagCheckbox = ({
    tower,
    towerTag,
    updateTower,
    text,
}: {
    tower: Partial<Tower>;
    towerTag: TowerTag;
    updateTower: (t: Partial<Tower>) => void;
    text: string;
}) => {
    return (
        <label className="label cursor-pointer justify-start gap-1">
            <input
                type="checkbox"
                className="checkbox"
                checked={!!tower.tags?.[towerTag]}
                onChange={() =>
                    updateTower({
                        tags: {
                            ...tower.tags,
                            [towerTag]: !tower.tags?.[towerTag],
                        },
                    })
                }
            />
            <span className="label-text">{text}</span>
        </label>
    );
};

export default TagCheckbox;
