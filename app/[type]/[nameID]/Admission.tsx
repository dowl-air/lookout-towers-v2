import React from "react";

function Admission() {
    return (
        <div className="card prose w-full border border-secondary-focus shadow-xl group">
            <div className="card-body items-center">
                <h2 className="card-title text-xl">Vstupné</h2>
                <p className="text-lg">Bezplatný vstup.</p>
            </div>
            <div className="btn btn-warning btn-sm hidden absolute top-[0.1rem] right-[0.5rem] group-hover:inline-flex">Navrhnout úpravu</div>
        </div>
    );
}

export default Admission;
