"use client";

import { useRouter } from "next/navigation";

import { checkAuth } from "@/actions/checkAuth";
import { showModalWithoutFocus } from "@/utils/showModal";

const AdmissionButton = () => {
    const router = useRouter();

    const handleClick = async () => {
        if (!(await checkAuth())) {
            return router.push("/signin");
        }
        showModalWithoutFocus("admission_modal");
    };

    return (
        <button
            className="btn btn-warning btn-xs hidden absolute top-[0.3rem] right-[0.3rem] group-hover:inline-flex group-focus:inline-flex"
            onClick={handleClick}
        >
            Navrhnout úpravu
        </button>
    );
};

export default AdmissionButton;
