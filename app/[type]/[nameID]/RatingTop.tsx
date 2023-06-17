import React from "react";

type Props = {};

const RatingTop = (props: Props) => {
    return (
        <div>
            <div className="rating rating-lg lg:mt-9">
                <input type="radio" name="rating-8" className="mask mask-star-2 bg-primary" />
                <input type="radio" name="rating-8" className="mask mask-star-2" />
                <input type="radio" name="rating-8" className="mask mask-star-2" />
                <input type="radio" name="rating-8" className="mask mask-star-2" />
                <input type="radio" name="rating-8" className="mask mask-star-2" />
            </div>
            <p className="text-sm mt-0 pl-1">Zatím nikdo nehodnotil.</p>
        </div>
    );
};

export default RatingTop;
