"use server";

import { sendMail } from "@/actions/mail";
import { MailSubject } from "@/types/MailSubject";
import { createSubject } from "@/utils/mail";

export const sendContactMessage = async (prev: any, formData: FormData) => {
    const message = formData.get("message") as string;
    if (!message) return;
    return await sendMail({
        subject: createSubject(MailSubject.Contact, "Nová zpráva"),
        text: `Od: ${formData.get("name")} (${formData.get("email")})\n\n${message}`,
        from: formData.get("email") as string,
    });
};
