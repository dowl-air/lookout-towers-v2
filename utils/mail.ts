import { MailSubject } from "@/types/MailSubject";

export const createSubject = (subjectType: MailSubject, subject: string) => {
    return `[RS][${subjectType}] ${subject}`;
};
