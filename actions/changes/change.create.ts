"use server";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { updateTag } from "next/cache";

import { checkAuth } from "@/actions/checkAuth";
import { sendMail } from "@/actions/mail";
import { Change, ChangeState } from "@/types/Change";
import { MailSubject } from "@/types/MailSubject";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { db } from "@/utils/firebase";
import { createSubject } from "@/utils/mail";

export const createChange = async (
    change: Omit<Change, "user_id" | "id" | "created" | "state">
) => {
    const user = await checkAuth();
    if (!user) throw new Error("Unauthorized.");

    const doc = await addDoc(collection(db, "changes"), {
        ...change,
        created: serverTimestamp(),
        user_id: user.id,
        state: ChangeState.New,
    });

    await sendMail({
        subject: createSubject(MailSubject.Info, "Nová úprava"),
        text: `Nová úprava byla vytvořena. ID: ${doc.id}`,
        html: `
            <p>
                Nová změna byla vytvořena. ID: <strong>${doc.id}</strong><br><br>
                <strong>Typ:</strong> ${change.type}<br>
                <strong>Věž:</strong> ${change.tower_id}<br>
                <strong>Pole:</strong> ${change.field}<br>
                <strong>Staré hodnoty:</strong> ${JSON.stringify(change.old_value)}<br>
                <strong>Nové hodnoty:</strong> ${JSON.stringify(change.new_value)}<br>
                <strong>Uživatel:</strong> ${user.name} (${user.email})<br>
                <strong>Čas vytvoření:</strong> ${new Date().toLocaleString("cs-CZ")}<br><br>

                <a href="https://rozhlednovysvet.cz/zmeny/">Zobrazit změny</a><br>
            </p>
        `,
    });

    updateTag(CacheTag.ChangesCount);
    updateTag(CacheTag.UnresolvedChanges);
    updateTag(getCacheTagSpecific(CacheTag.ChangesTower, change.tower_id));
    updateTag(getCacheTagSpecific(CacheTag.ChangesUser, user.id));

    return doc.id;
};
