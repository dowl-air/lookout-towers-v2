"use client";

import { signIn } from "next-auth/react";

const ContactButton = ({ isAuth }: { isAuth: boolean }) => {
    return (
        <button
            className="btn btn-primary"
            onClick={async () => {
                if (isAuth) {
                    (
                        document.getElementById("contact-form-modal") as HTMLDialogElement
                    ).showModal();
                } else {
                    await signIn();
                }
            }}
        >
            Napište mi
        </button>
    );
};

export default ContactButton;
