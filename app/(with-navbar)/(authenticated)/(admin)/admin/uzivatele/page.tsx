import { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { checkAdmin } from "@/actions/checkAdmin";
import UserManagement from "@/components/admin/UserManagement";
import { getAdminUsers } from "@/data/admin/users";

export const metadata: Metadata = {
    title: "Správa uživatelů",
};

async function AdminUsersContent() {
    await connection();

    if (!(await checkAdmin())) {
        redirect("/403");
    }

    const users = await getAdminUsers();

    return (
        <main className="mx-auto my-8 flex max-w-[calc(min(99dvw,80rem))] flex-col gap-5 px-3 xl:px-0">
            <article className="prose max-w-max px-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl">Správa uživatelů</h1>
                <p className="text-sm sm:text-base">
                    Přejmenujte uživatele nebo odstraňte jejich účet a osobní data.
                </p>
            </article>
            <UserManagement users={users} />
        </main>
    );
}

function AdminUsersPage() {
    return (
        <Suspense
            fallback={<main className="mx-auto my-8 max-w-[calc(min(99dvw,80rem))] px-3 xl:px-0" />}
        >
            <AdminUsersContent />
        </Suspense>
    );
}

export default AdminUsersPage;
