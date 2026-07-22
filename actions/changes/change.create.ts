"use server";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { updateTag } from "next/cache";

import { checkAuth } from "@/actions/checkAuth";
import { sendMail } from "@/actions/mail";
import { Change, ChangeState } from "@/types/Change";
import { MailSubject } from "@/types/MailSubject";
import { TowerTag } from "@/types/TowerTags";
import { CacheTag, getCacheTagSpecific } from "@/utils/cacheTags";
import { SITE_URL } from "@/utils/constants";
import { db } from "@/utils/firebase";
import { createSubject } from "@/utils/mail";
import { getOpeningHoursValidationError, normalizeOpeningHours } from "@/utils/openingHours";
import { getTowerContactValidationError } from "@/utils/towerValidation";
import { getNormalizedHttpUrl, hasUrl } from "@/utils/url";

export const createChange = async (
    change: Omit<Change, "user_id" | "id" | "created" | "state">
) => {
    const user = await checkAuth();
    if (!user) throw new Error("Unauthorized.");

    if (change.field === "openingHours") {
        const validationError = getOpeningHoursValidationError(
            normalizeOpeningHours(change.new_value)
        );
        if (validationError) throw new Error(validationError);
    }

    if (change.field === "contact") {
        const contact = change.new_value;
        if (
            !contact ||
            typeof contact !== "object" ||
            ["email", "officialWebsite", "phone"].some(
                (field) => typeof contact[field] !== "string"
            )
        ) {
            throw new Error("Kontaktní údaje mají neplatný formát.");
        }

        const validationError = getTowerContactValidationError(contact);
        if (validationError) throw new Error(validationError);
    }

    if (change.field === "tags") {
        const tags = change.new_value;
        const validTags = new Set(Object.values(TowerTag));

        if (
            !Array.isArray(tags) ||
            new Set(tags).size !== tags.length ||
            tags.some((tag) => typeof tag !== "string" || !validTags.has(tag as TowerTag))
        ) {
            throw new Error("Vybrané tagy mají neplatný formát.");
        }
    }

    if (change.field === "urls") {
        const oldUrls = Array.isArray(change.old_value) ? change.old_value : [];
        const newUrls = Array.isArray(change.new_value) ? change.new_value : [];
        const proposedUrl = newUrls[newUrls.length - 1];
        const normalizedUrl =
            typeof proposedUrl === "string" ? getNormalizedHttpUrl(proposedUrl) : null;

        if (!normalizedUrl)
            throw new Error("Zadejte platnou URL adresu začínající http:// nebo https://.");
        if (hasUrl(oldUrls, normalizedUrl))
            throw new Error("Tento odkaz už je u rozhledny přidaný.");

        change.new_value = [...oldUrls, normalizedUrl];
    }

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

                <a href="${SITE_URL}/zmeny/">Zobrazit změny</a><br>
            </p>
        `,
    });

    updateTag(CacheTag.ChangesCount);
    updateTag(CacheTag.UnresolvedChanges);
    updateTag(getCacheTagSpecific(CacheTag.ChangesTower, change.tower_id));
    updateTag(getCacheTagSpecific(CacheTag.ChangesUser, user.id));

    return doc.id;
};
