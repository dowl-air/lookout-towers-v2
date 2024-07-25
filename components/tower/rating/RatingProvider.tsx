import { getTowerRatings, getUserRating } from "@/actions/ratings/ratings.action";
import { Tower } from "@/typings";
import RatingForm from "@/components/tower/rating/RatingForm";
import { getUser } from "@/actions/members/members.action";

const RatingFormProvider = async ({ tower }: { tower: Tower }) => {
    const userRating = await getUserRating(tower.id);
    let towerRatings = await getTowerRatings(tower.id);

    const updateTowerRating = async () => {
        "use server";
        return await getUserRating(tower.id);
    };

    if (userRating) {
        userRating.user = await getUser(userRating.user_id);
        towerRatings = towerRatings.filter((r) => r.user_id !== userRating.user_id);
        const promises = towerRatings.map((rating) => getUser(rating.user_id));
        const users = await Promise.all(promises);
        towerRatings = towerRatings.map((rating, idx) => ({ ...rating, user: users[idx] }));
    }

    return <RatingForm tower={tower} initRating={userRating} ratings={towerRatings} updateTowerRating={updateTowerRating} />;
};

export default RatingFormProvider;
