"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, startTransition, useActionState, useEffect, useState } from "react";

import { deleteUser, type AdminUserActionState, renameUser } from "@/actions/admin/users.action";
import UserProfileAvatar from "@/components/UserProfileAvatar";
import { AdminUser } from "@/data/admin/users";

const initialState: AdminUserActionState = {};

function UserRenameForm({ user }: { user: AdminUser }) {
    const [isEditing, setIsEditing] = useState(false);
    const [state, formAction, isPending] = useActionState(renameUser, initialState);
    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            setIsEditing(false);
            router.refresh();
        }
    }, [router, state.success]);

    if (!isEditing) {
        return (
            <button
                type="button"
                className="btn btn-ghost btn-square btn-sm"
                title={`Přejmenovat ${user.name}`}
                aria-label={`Přejmenovat ${user.name}`}
                onClick={() => setIsEditing(true)}
            >
                <Pencil size={17} aria-hidden="true" />
            </button>
        );
    }

    return (
        <form action={formAction} className="flex flex-wrap items-center gap-2">
            <input name="userId" type="hidden" value={user.id} />
            <input
                name="name"
                className="input input-bordered input-sm w-48"
                defaultValue={user.name}
                maxLength={50}
                required
                disabled={isPending}
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={isPending}>
                Uložit
            </button>
            <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setIsEditing(false)}
                disabled={isPending}
            >
                Zrušit
            </button>
            {state.error ? <p className="basis-full text-sm text-error">{state.error}</p> : null}
        </form>
    );
}

function UserDeleteButton({ user }: { user: AdminUser }) {
    const [state, setState] = useState<AdminUserActionState>();
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const handleDelete = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!window.confirm(`Opravdu odstranit účet ${user.name} včetně jeho osobních dat?`)) {
            return;
        }

        setIsPending(true);
        startTransition(async () => {
            const result = await deleteUser(user.id);
            setState(result);
            setIsPending(false);
            if (result.success) {
                router.refresh();
            }
        });
    };

    return (
        <form onSubmit={handleDelete} className="flex flex-col items-end gap-1">
            <button
                type="submit"
                className="btn btn-ghost btn-square btn-sm text-error"
                title={`Odstranit ${user.name}`}
                aria-label={`Odstranit ${user.name}`}
                disabled={isPending}
            >
                <Trash2 size={17} aria-hidden="true" />
            </button>
            {state?.error ? <p className="text-right text-sm text-error">{state.error}</p> : null}
        </form>
    );
}

function UserManagement({ users }: { users: AdminUser[] }) {
    return (
        <div className="overflow-x-auto rounded-lg border border-base-300 bg-base-100 shadow-sm">
            <table className="table">
                <thead>
                    <tr>
                        <th>Uživatel</th>
                        <th>E-mail</th>
                        <th className="text-right">Akce</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <div className="flex items-center gap-3">
                                    <UserProfileAvatar
                                        name={user.name}
                                        image={user.image}
                                        size={40}
                                    />
                                    <span className="font-medium">{user.name}</span>
                                </div>
                            </td>
                            <td className="text-base-content/70">{user.email}</td>
                            <td>
                                <div className="flex justify-end gap-1">
                                    <UserRenameForm user={user} />
                                    <UserDeleteButton user={user} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserManagement;
