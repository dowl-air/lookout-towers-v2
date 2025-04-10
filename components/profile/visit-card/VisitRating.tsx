import ThemedRating from "@/components/shared/ThemedRating";
import { Rating } from "@/types/Rating";

const VisitRating = ({ rating }: { rating: Rating }) => {
    if (!rating) return null;

    return (
        <div className="flex flex-col gap-3 basis-64">
            <p className="text-base opacity-50 grow-0">Moje hodnocení</p>
            <ThemedRating size={25} value={rating.rating} />
            <p className="text-base mr-3">{rating.text}</p>
        </div>
    );
};

export default VisitRating;
