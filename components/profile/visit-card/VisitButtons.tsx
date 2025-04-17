import { Pencil, Share2 } from "lucide-react";
import Link from "next/link";

import { Tower } from "@/types/Tower";

const VisitButtons = ({ tower }: { tower: Tower }) => {
    return (
        <div className="w-10 flex flex-col gap-3 items-end">
            <Link href={`/${tower.type}/${tower.nameID}`} className="btn btn-circle btn-primary">
                <Pencil />
            </Link>
            <button className="btn btn-circle btn-primary">
                <Share2 />
            </button>
        </div>
    );
};

export default VisitButtons;
