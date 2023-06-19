import React from "react";

function Admission() {
    return (
        <div className="card card-compact sm:card-normal prose min-w-[300px] max-w-[420px] h-[225px] flex-1 overflow-hidden shadow-xl border border-secondary-focus group">
            <div className="card-body items-center">
                <h2 className="card-title text-xl">Vstupné</h2>
                <p className="text-lg">Bezplatný vstup.</p>
            </div>
            <div className="btn btn-warning btn-sm hidden absolute top-[0.1rem] right-[0.5rem] group-hover:inline-flex">Navrhnout úpravu</div>
        </div>
    );
}

export default Admission;
