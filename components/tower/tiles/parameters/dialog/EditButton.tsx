"use client";

import { useRouter } from "next/navigation";

import { checkAuth } from "@/actions/checkAuth";
import { showModalWithoutFocus } from "@/utils/showModal";

const EditButton = () => {
    const router = useRouter();

    return (
        <button
            className="btn btn-warning"
            onClick={async () => {
                if ((await checkAuth()) !== null) {
                    (document.getElementById("parameters-modal") as HTMLDialogElement).close();
                    showModalWithoutFocus("edit_parameters");
                } else {
                    return router.push("/signin");
                }
            }}
        >
            Navrhnout úpravu
        </button>
    );
};

export default EditButton;
