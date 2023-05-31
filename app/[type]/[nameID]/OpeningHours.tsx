import React from "react";

function OpeningHours() {
    return (
        <div className="card prose w-full overflow-hidden shadow-xl border border-secondary-focus grow group">
            <div className="card-body items-center ">
                <h2 className="card-title text-xl ">Otevírací doba</h2>
                <p className="text-lg ">Rozhledna je volně přístupná.</p>
            </div>
            <div className="btn btn-warning btn-sm hidden absolute top-[0.1rem] right-[0.5rem] group-hover:inline-flex">Navrhnout úpravu</div>
        </div>
    );
}

export default OpeningHours;
