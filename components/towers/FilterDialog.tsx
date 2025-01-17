"use client";

import { forwardRef } from "react";

const FilterDialog = forwardRef<HTMLDialogElement, { closeDialog: () => void }>(({ closeDialog }, ref) => {
    return (
        <dialog className="modal modal-bottom sm:modal-middle" ref={ref}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">Filtrovat rozhledny</h3>
                <p className="py-4">Tato funkce bude brzy dostupná.</p>
                <div className="modal-action">
                    {/* <form method="dialog">
                        <button className="btn btn-error">Zavřít</button>
                    </form> */}
                    <button className="btn btn-primary" onClick={closeDialog}>
                        Dobře
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>Zavřít</button>
            </form>
        </dialog>
    );
});

export default FilterDialog;
