import React from "react";

function Admission() {
    return (
        <div
            className={`card card-compact sm:card-normal min-w-[300px] max-w-[calc(min(94vw,420px))] sm:h-[225px] flex-1 overflow-hidden shadow-xl group bg-[rgba(255,255,255,0.05)]`}
        >
            <div className="card-body">
                <h2 className="card-title text-base sm:text-lg md:text-xl">Vstupné</h2>
                <p className="text-base md:text-lg">Bezplatný vstup.</p>
            </div>
            <div className="btn btn-warning btn-sm hidden absolute top-[0.1rem] right-[0.5rem] group-hover:inline-flex">Navrhnout úpravu</div>
        </div>
    );
}

export default Admission;
