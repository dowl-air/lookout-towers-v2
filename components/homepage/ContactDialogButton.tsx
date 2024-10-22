"use client";

import { useFormStatus } from "react-dom";

const ContactDialogButton = () => {
    const { pending } = useFormStatus();

    return (
        <button className="btn btn-primary w-24" disabled={pending}>
            {pending ? <span className="loading loading-spinner loading-sm"></span> : "Odeslat"}
        </button>
    );
};

export default ContactDialogButton;
