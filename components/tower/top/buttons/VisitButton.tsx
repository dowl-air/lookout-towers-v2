"use client";
import { getVisit } from "@/actions/visits/visits.action";
import { VisitModal } from "@/components/shared/VisitModalForm";
import { Tower, Visit } from "@/typings";
import { formatDate } from "@/utils/date";
import { showModalWithoutFocus } from "@/utils/showModal";
import { useFormState } from "react-dom";

export const VisitButton = ({ visitInit, tower }: { visitInit: Visit | null; tower: Tower }) => {
    const toggleVisit = async () => await getVisit(tower.id);
    const [isVisited, action] = useFormState(toggleVisit, visitInit);

    return (
        <form action={action} id="form-visit-button" className="flex flex-col justify-center gap-2">
            <button
                className={`btn min-w-64 ${
                    isVisited ? "btn-success [&>span]:hover:hidden hover:btn-warning hover:before:content-['Upravit_návštěvu']" : "btn-primary"
                } max-w-xs text-sm w-full min-[710px]:text-base"`}
                onClick={() => showModalWithoutFocus("visit_modal")}
            >
                <span>{isVisited ? `Navštíveno ${formatDate({ date: isVisited.date, long: false })}` : "Přidat do navštívených"}</span>
            </button>
            <VisitModal initVisit={isVisited} tower={tower} />
        </form>
    );
};
