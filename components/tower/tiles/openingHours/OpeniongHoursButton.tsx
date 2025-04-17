"use client";

import { useRouter } from "next/navigation";

import { checkAuth } from "@/actions/checkAuth";
import { showModalWithoutFocus } from "@/utils/showModal";

const OpeningHoursButton = () => {
    const router = useRouter();

    const handleClick = async () => {
        if (!(await checkAuth())) {
            return router.push("/signin");
        }
        showModalWithoutFocus("opening_hours_modal");
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

export default OpeningHoursButton;
