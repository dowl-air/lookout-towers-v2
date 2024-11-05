"use client";

import { updateChange } from "@/actions/changes/change.update";
import { Change, ChangeState } from "@/types/Change";
import { useState } from "react";

const ChangeButtons = ({ change }: { change: Change }) => {
    const [loading, setLoading] = useState(false);
    const [resolved, setResolved] = useState(false);

    if (resolved) {
        return <div className="text-success">Změna byla vyřešena</div>;
    }

    return (
        <>
            <button
                className="btn btn-primary"
                onClick={async () => {
                    setLoading(true);
                    await updateChange(change.id, ChangeState.Approved, change.tower_id);
                    setLoading(false);
                    setResolved(true);
                }}
            >
                {loading ? <span className="loading loading-spinner loading-sm"></span> : "Přijmout"}
            </button>
            <button
                className="btn btn-error"
                onClick={async () => {
                    setLoading(true);
                    await updateChange(change.id, ChangeState.Rejected, change.tower_id);
                    setLoading(false);
                    setResolved(true);
                }}
            >
                {loading ? <span className="loading loading-spinner loading-sm"></span> : "Odmítnout"}
            </button>
        </>
    );
};

export default ChangeButtons;
