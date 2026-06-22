"use client";

import { ReactNode, RefObject } from "react";

import { cn } from "@/utils/cn";

type TowerModalAction = {
    label: ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
    className?: string;
    disabled?: boolean;
};

type TowerModalProps = {
    dialogRef?: RefObject<HTMLDialogElement | null>;
    id?: string;
    title: ReactNode;
    description?: ReactNode;
    children: ReactNode;
    actions?: TowerModalAction[];
    leadingActions?: TowerModalAction[];
    className?: string;
    contentClassName?: string;
    onClose?: () => void;
    closeLabel?: string;
    showCloseAction?: boolean;
};

function renderAction(action: TowerModalAction, index: number) {
    return (
        <button
            key={index}
            type={action.type ?? "button"}
            className={cn("btn shrink-0", action.className)}
            onClick={action.onClick}
            disabled={action.disabled}
        >
            {action.label}
        </button>
    );
}

const TowerModal = ({
    dialogRef,
    id,
    title,
    description,
    children,
    actions = [],
    leadingActions = [],
    className,
    contentClassName,
    onClose,
    closeLabel = "Zavřít",
    showCloseAction = true,
}: TowerModalProps) => {
    return (
        <dialog
            ref={dialogRef}
            id={id}
            className="modal modal-bottom sm:modal-middle [&:not([open])]:hidden"
            onClose={onClose}
        >
            <div
                className={cn(
                    "modal-box max-h-[92dvh] max-w-3xl overflow-hidden rounded-lg border border-base-300/70 bg-base-100 p-0 shadow-2xl",
                    className
                )}
            >
                <div className="border-b border-base-300/70 bg-base-200/45 px-5 py-5 sm:px-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 space-y-1">
                            <h3 className="m-0 text-xl font-bold leading-tight text-base-content sm:text-2xl">
                                {title}
                            </h3>
                            {description ? (
                                <p className="m-0 text-sm leading-relaxed text-base-content/65">
                                    {description}
                                </p>
                            ) : null}
                        </div>
                        <form method="dialog" className="shrink-0">
                            <button
                                type="submit"
                                className="btn btn-ghost btn-circle btn-sm"
                                aria-label={closeLabel}
                                onClick={onClose}
                            >
                                x
                            </button>
                        </form>
                    </div>
                </div>

                <div
                    className={cn(
                        "max-h-[calc(92dvh-10rem)] overflow-y-auto px-5 py-5 sm:px-6",
                        contentClassName
                    )}
                >
                    {children}
                </div>

                {(actions.length > 0 || leadingActions.length > 0) && (
                    <div className="flex flex-wrap items-center gap-3 border-t border-base-300/70 bg-base-100 px-5 py-4 sm:px-6">
                        <div className="flex flex-wrap gap-2">
                            {leadingActions.map(renderAction)}
                        </div>
                        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
                            {showCloseAction ? (
                                <form method="dialog">
                                    <button
                                        type="submit"
                                        className="btn btn-outline shrink-0"
                                        onClick={onClose}
                                    >
                                        {closeLabel}
                                    </button>
                                </form>
                            ) : null}
                            {actions.map(renderAction)}
                        </div>
                    </div>
                )}
            </div>
            <form method="dialog" className="modal-backdrop">
                <button type="submit" aria-label={closeLabel} onClick={onClose}>
                    {closeLabel}
                </button>
            </form>
        </dialog>
    );
};

export default TowerModal;
