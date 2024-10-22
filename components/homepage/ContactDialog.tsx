"use client";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";

import { sendContactMessage } from "@/actions/mails/sendContactMessage";
import ContactDialogButton from "@/components/homepage/ContactDialogButton";
import { User } from "next-auth";

const ContactDialog = ({ user }: { user: User }) => {
    const [state, formAction] = useFormState(sendContactMessage, null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (state?.messageId) {
            textAreaRef.current.value = "";
            (document.getElementById("contact-form-modal") as HTMLDialogElement).close();
        }
    }, [state]);

    return (
        <dialog id="contact-form-modal" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <form action={formAction}>
                    <h3 className="font-bold text-lg mb-5">Napište mi!</h3>
                    <input type="hidden" name="email" value={user.email} />
                    <input type="hidden" name="name" value={user.name} />
                    <textarea ref={textAreaRef} name="message" className="textarea textarea-bordered w-full" placeholder="Vaše zpráva"></textarea>
                    <div className="modal-action">
                        <ContactDialogButton />
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>Close</button>
            </form>
        </dialog>
    );
};

export default ContactDialog;
