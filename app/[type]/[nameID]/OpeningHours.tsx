import React from "react";

function OpeningHours() {
    return (
        <div className="prose w-full border border-base-content rounded-md flex items-center justify-center overflow-hidden">
            <div className={"flex flex-col items-center gap-4"}>
                <h3 className="text-xl">Otevírací doba</h3>
                <p className="text-lg">Rozhledna je volně přístupná.</p>
            </div>
        </div>
    );
}

export default OpeningHours;
