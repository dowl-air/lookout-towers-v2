"use client";

import { User } from "next-auth";
import { signIn } from "next-auth/react";

const ContactButton = ({ user }: { user: User }) => {
    return (
        <button
            className="btn btn-primary"
            onClick={async () => {
                if (user) {
                    (document.getElementById("contact-form-modal") as HTMLDialogElement).showModal();
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
