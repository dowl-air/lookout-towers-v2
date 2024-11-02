"use client";

import { showModalWithoutFocus } from "@/utils/showModal";

const EditButton = () => {
    return (
        <button
            className="btn btn-warning"
            onClick={() => {
                (document.getElementById("parameters-modal") as HTMLDialogElement).close();
                showModalWithoutFocus("edit_parameters");
            }}
        >
            Navrhnout úpravu
        </button>
    );
};

export default EditButton;
