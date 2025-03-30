"use client";
import { revalidateTower } from "@/actions/cache/purge.tower.action";

const PurgeCache = () => {
    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        if (!formData.get("tower_id")) return;
        const resp = await revalidateTower(formData);
        if (resp === formData.get("tower_id")) return alert("Cache purged!");
        alert(resp);
    };

    return (
        <div>
            <h1>Purge Cache</h1>
            <p>This page is used to purge the cache of the website.</p>
            <p>It is not accessible by the public.</p>
            <form onSubmit={onSubmit} method="POST">
                <input type="text" name="tower_id" placeholder="Tower ID" />
                <button type="submit" className="btn btn-primary">
                    Purge Cache
                </button>
            </form>
        </div>
    );
};

export default PurgeCache;
