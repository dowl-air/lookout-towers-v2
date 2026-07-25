"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { removeTower, type RemoveTowerActionState } from "@/actions/admin/towers.action";

type TowerOption = {
    id: string;
    name: string;
    nameID: string;
};

const TowerRemoval = ({ towers }: { towers: TowerOption[] }) => {
    const [towerId, setTowerId] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [state, setState] = useState<RemoveTowerActionState>();
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();
    const tower = towers.find((item) => item.id === towerId);

    const handleSubmit = () => {
        if (!tower || confirmation !== tower.name) return;
        if (!window.confirm(`Opravdu nenávratně odstranit rozhlednu ${tower.name}?`)) return;

        setIsPending(true);
        startTransition(async () => {
            const result = await removeTower(tower.id, confirmation);
            setState(result);
            setIsPending(false);

            if (result.success) {
                setTowerId("");
                setConfirmation("");
                router.refresh();
            }
        });
    };

    return (
        <form
            className="max-w-xl space-y-5 rounded-lg border border-error/40 bg-error/5 p-5"
            onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
            }}
        >
            <label className="form-control gap-2">
                <span className="label-text font-medium">Rozhledna</span>
                <select
                    className="select select-bordered w-full"
                    value={towerId}
                    onChange={(event) => {
                        setTowerId(event.target.value);
                        setConfirmation("");
                        setState(undefined);
                    }}
                    disabled={isPending}
                    required
                >
                    <option value="">Vyberte rozhlednu</option>
                    {towers.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name} ({item.nameID})
                        </option>
                    ))}
                </select>
            </label>

            {tower ? (
                <label className="form-control gap-2">
                    <span className="label-text font-medium">
                        Pro potvrzení napište přesně: <strong>{tower.name}</strong>
                    </span>
                    <input
                        className="input input-bordered w-full"
                        value={confirmation}
                        onChange={(event) => setConfirmation(event.target.value)}
                        disabled={isPending}
                        required
                    />
                </label>
            ) : null}

            <button
                type="submit"
                className="btn btn-error"
                disabled={!tower || confirmation !== tower.name || isPending}
            >
                <Trash2 className="size-4" aria-hidden="true" />
                {isPending ? "Odstraňuji..." : "Nenávratně odstranit rozhlednu"}
            </button>
            {state?.error ? <p className="text-sm text-error">{state.error}</p> : null}
            {state?.success ? (
                <p className="text-sm text-success">Rozhledna byla odstraněna.</p>
            ) : null}
        </form>
    );
};

export default TowerRemoval;
