"use client";
import { Rating, UserFromDB } from "@/typings";
import React, { useEffect, useState } from "react";
import ThemedRating from "./ThemedRating";
import UserProfileAvatar from "@/components/UserProfileAvatar";

function OneReview({ review }: { review: Rating }) {
    const [user, setUser] = useState<UserFromDB | null>(null);

    useEffect(() => {
        const s = async () => {
            const res = await fetch(`/api/user?user_id=${review.user_id}`).then((r) => r.json());
            if (res.status === 200) setUser(res.message as UserFromDB);
        };
        if (review.user_id) s();
    }, [review.user_id]);

    if (!user) return null;

    return (
        <div className="flex flex-col gap-2 mb-5">
            <div className="flex gap-3">
                <UserProfileAvatar image={user.image} name={user.name} />
                <div className="flex flex-col">
                    <div className="flex gap-1">
                        <p>{user.name}</p>
                        <p className="font-bold opacity-50">·</p>
                        <p className="opacity-50">{new Date(review.created.toString()).toLocaleDateString()}</p>
                    </div>
                    <ThemedRating value={review.rating} size={25} />
                </div>
            </div>
            <div className="flex mr-3">{review.text}</div>
        </div>
    );
}

export default OneReview;
