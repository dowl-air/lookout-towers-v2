"use client";

import { ReactNode } from "react";

import { cn } from "@/utils/cn";

interface DialogProps {
    id: string;
    title: ReactNode | string;
    children: ReactNode;
    actions: {
        label: string | ReactNode;
        action: () => void;
        customClass?: string;
    }[];
    onClose?: () => void;
}

const Dialog = ({ id, title, children, actions, onClose }: DialogProps) => {
    return (
        <dialog id={id} className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{title}</h3>

                {children}

                <div className="modal-action justify-between">
                    <form method="dialog">
                        <button className="btn btn-error" onClick={onClose}>
                            Zavřít
                        </button>
                    </form>
                    <div className="flex gap-3">
                        {actions.map((action, idx) => (
                            <button key={idx} className={cn("btn", action.customClass)} onClick={action.action}>
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>zavřít</button>
            </form>
        </dialog>
    );
};

export default Dialog;
