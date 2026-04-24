"use client";

import { startTransition, useActionState, useState } from "react";

import { getVisit } from "@/actions/visits/visits.action";
import { VisitModal } from "@/components/shared/VisitModalForm";
import { Tower } from "@/types/Tower";
import { Visit } from "@/types/Visit";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/date";

export type VisitButtonVariant = "button" | "compact";

type VisitButtonProps = {
    visitInit: Visit | null;
    tower: Tower;
    revalidatePaths?: string[];
    variant?: VisitButtonVariant;
    className?: string;
    idleLabel?: string;
};

export const VisitButton = ({
    visitInit,
    tower,
    revalidatePaths,
    variant = "button",
    className,
    idleLabel = "Přidat do navštívených",
}: VisitButtonProps) => {
    const reloadVisit = async () => await getVisit(tower.id);
    const [visit, reloadVisitAction] = useActionState(reloadVisit, visitInit);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleVisitSaved = () => {
        startTransition(() => {
            reloadVisitAction();
        });
    };

    const buttonClassName =
        variant === "compact"
            ? cn(
                  "btn btn-sm sm:btn-md h-10 min-h-10 sm:h-12 sm:min-h-12 whitespace-nowrap",
                  visit ? "btn-success" : "btn-outline",
                  className
              )
            : cn(
                  "btn btn-sm sm:btn-md md:min-w-64 whitespace-nowrap max-w-xs text-sm md:w-full min-[710px]:text-base",
                  visit
                      ? "btn-success hover:[&>span]:hidden hover:btn-warning hover:before:content-['Upravit_návštěvu']"
                      : "btn-primary",
                  className
              );

    return (
        <>
            <button type="button" className={buttonClassName} onClick={() => setIsModalOpen(true)}>
                <span>
                    {visit
                        ? `Navštíveno ${formatDate({ date: visit.date, long: false })}`
                        : idleLabel}
                </span>
            </button>

            {isModalOpen ? (
                <VisitModal
                    initVisit={visit}
                    tower={tower}
                    revalidatePaths={revalidatePaths}
                    isOpen={isModalOpen}
                    onCloseAction={() => setIsModalOpen(false)}
                    onVisitSavedAction={handleVisitSaved}
                />
            ) : null}
        </>
    );
};
