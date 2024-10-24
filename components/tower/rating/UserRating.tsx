import UserProfileAvatar from "@/components/UserProfileAvatar";
import ThemedRating from "@/components/shared/ThemedRating";
import { Rating } from "@/typings";

const UserRating = ({ rating }: { rating: Rating }) => {
    if (rating.user === undefined) return null;
    return (
        <div className="flex flex-col gap-2 mb-5">
            <div className="flex gap-3">
                <UserProfileAvatar image={rating.user.image} name={rating.user.name} />
                <div className="flex flex-col">
                    <div className="flex gap-1">
                        <p>{rating.user.name}</p>
                        <p className="font-bold opacity-50">·</p>
                        <p className="opacity-50">{new Date(rating.created).toLocaleDateString()}</p>
                    </div>
                    <ThemedRating value={rating.rating} size={25} />
                </div>
            </div>
            <div className="flex mr-3">{rating.text}</div>
        </div>
    );
};

export default UserRating;
