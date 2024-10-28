"use client";

import { ReactNode } from "react";
import { showModalWithoutFocus } from "@/utils/showModal";

const ParameterTile = ({ children }: { children: ReactNode }) => {
    return (
        <div
            className="card card-compact sm:card-normal prose min-w-[300px] max-w-[calc(min(94vw,420px))] sm:h-[225px] flex-1 overflow-hidden shadow-xl bg-[rgba(255,255,255,0.05)] transition-transform duration-200 cursor-pointer hover:scale-105"
            title="Zobrazit všechny parametry"
            onClick={() => showModalWithoutFocus("parameters-modal")}
        >
            {children}
        </div>
    );
};

export default ParameterTile;
