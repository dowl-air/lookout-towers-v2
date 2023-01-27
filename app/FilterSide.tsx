import React from "react";

function FilterSide() {
    return (
        <div className="w-72 flex flex-col items-center p-2">
            <input type="text" placeholder="Vyhledat rozhlednu" className="input input-bordered input-primary w-full max-w-xs" />
            <p className="font-bold opacity-50 place-self-start ml-2 text-md mt-5">SEŘADIT PODLE</p>
            <div className="btn-group mt-2">
                <button className="btn btn-active">Zobrazení</button>
                <button className="btn">Hodnocení</button>
            </div>
            <p className="font-bold opacity-50 place-self-start ml-2 text-md mt-5">TYP</p>
        </div>
    );
}

export default FilterSide;
