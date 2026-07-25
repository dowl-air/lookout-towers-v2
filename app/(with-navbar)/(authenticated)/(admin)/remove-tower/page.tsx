import { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { checkAdmin } from "@/actions/checkAdmin";
import TowerRemoval from "@/components/admin/TowerRemoval";
import { db } from "@/utils/firebase-admin";

export const metadata: Metadata = {
    title: "Odstranit rozhlednu",
};

const RemoveTowerContent = async () => {
    await connection();

    if (!(await checkAdmin())) {
        redirect("/403");
    }

    const snapshot = await db.collection("towers").select("name", "nameID").orderBy("name").get();
    const towers = snapshot.docs
        .map((document) => ({
            id: document.id,
            name: document.get("name"),
            nameID: document.get("nameID"),
        }))
        .filter(
            (tower): tower is { id: string; name: string; nameID: string } =>
                typeof tower.name === "string" && typeof tower.nameID === "string"
        );

    return (
        <main className="mx-auto my-8 flex max-w-[calc(min(99dvw,80rem))] flex-col gap-5 px-3 xl:px-0">
            <article className="prose max-w-2xl px-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl">Odstranit rozhlednu</h1>
                <p>
                    Odstranění je nenávratné. Vymažou se data rozhledny, fotografie včetně souborů,
                    oblíbené, hodnocení, návštěvy a návrhy změn.
                </p>
            </article>
            <TowerRemoval towers={towers} />
        </main>
    );
};

const RemoveTowerPage = () => (
    <Suspense
        fallback={<main className="mx-auto my-8 max-w-[calc(min(99dvw,80rem))] px-3 xl:px-0" />}
    >
        <RemoveTowerContent />
    </Suspense>
);

export default RemoveTowerPage;
