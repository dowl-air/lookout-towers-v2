import ThemedRating from "@/components/shared/ThemedRating";
import { Rating } from "@/types/Rating";

const getAverage = (reviews: Rating[]) => {
    const numbers = reviews.map((r) => r.rating);
    return reviews.length ? numbers.reduce((a, b) => a + b) / reviews.length : 0;
};

const getRange = (reviews: Rating[], range: number) => {
    if (reviews.length == 0) return 0;
    const filtered = reviews.filter((r) => r.rating >= range - 0.5 && r.rating <= range);
    return (filtered.length / reviews.length) * 100;
};

const RatingStats = ({ reviews }: { reviews: Rating[] }) => {
    if (reviews.length === 0) {
        return (
            <div className="flex min-h-44 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-base-300 bg-base-200/30 px-6 py-8 text-center md:flex-1">
                <ThemedRating value={0} size={30} iconsCount={5} />
                <div className="space-y-1">
                    <p className="font-semibold text-base-content">Zatím bez hodnocení</p>
                    <p className="max-w-sm text-sm text-base-content/60">
                        Buďte první, kdo doplní zkušenost z návštěvy.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center md:flex-none gap-6 md:mr-8">
            <div className="flex items-center gap-2">
                <div className="text-4xl font-bold text-[#FEBC0B]">{getAverage(reviews).toPrecision(2)}</div>
                <ThemedRating value={getAverage(reviews)} size={30} iconsCount={5} />
            </div>
            <div className="flex flex-col gap-2">
                {[5, 4, 3, 2, 1].map((item) => (
                    <div key={item} className="flex items-center gap-1">
                        <div className="mt-1 text-xl font-bold">{item}</div>
                        <ThemedRating value={1} iconsCount={1} size={22} />
                        <progress className="progress progress-[#FEBC0B] w-48 ml-2 mt-1" value={getRange(reviews, item)} max="100"></progress>
                        <p className="text-sm opacity-50 ml-2 mt-1">{`${getRange(reviews, item)}%`}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RatingStats;
