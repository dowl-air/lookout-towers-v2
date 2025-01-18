import UserProfileAvatar from "@/components/UserProfileAvatar";
import ThemedRating from "@/components/shared/ThemedRating";
import { Rating } from "@/types/Rating";
import { formatDate } from "@/utils/date";
import { User } from "next-auth";

const UserRating = ({ rating, user }: { rating: Rating; user: User }) => {
    if (user === undefined) return null;
    return (
        <div className="flex flex-col gap-2 mb-5">
            <div className="flex gap-3">
                <UserProfileAvatar image={user.image} name={user.name} />
                <div className="flex flex-col">
                    <div className="flex gap-1">
                        <p>{user.name}</p>
                        <p className="font-bold opacity-50">·</p>
                        <p className="opacity-50">{formatDate({ date: rating.created, long: true })}</p>
                    </div>
                    <ThemedRating value={rating.rating} size={25} />
                </div>
            </div>
            <div className="flex mr-3">{rating.text}</div>
        </div>
    );
};

export default UserRating;
