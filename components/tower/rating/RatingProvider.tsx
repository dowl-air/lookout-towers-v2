import { getTowerRatings, getUserRating } from "@/actions/ratings/ratings.action";
import RatingForm from "@/components/tower/rating/RatingForm";
import { getUser } from "@/actions/members/members.action";
import { Tower } from "@/types/Tower";

const RatingFormProvider = async ({ tower }: { tower: Tower }) => {
    let [userRating, towerRatings] = await Promise.all([getUserRating(tower.id), getTowerRatings(tower.id)]);
    const users = await Promise.all(towerRatings.map((rating) => getUser(rating.user_id)));

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

    return <RatingForm tower={tower} initRating={userRating} ratings={towerRatings} users={users} updateTowerRating={updateTowerRating} />;
};

export default RatingFormProvider;
