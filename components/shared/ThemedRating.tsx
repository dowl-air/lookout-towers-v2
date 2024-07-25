import { Rating } from "react-simple-star-rating";

function ThemedRating({
    value,
    size,
    iconsCount = 5,
    className = "",
    setValue = () => {},
    readonly = true,
}: {
    value: number;
    size: number;
    iconsCount?: number;
    className?: string;
    setValue?: Function;
    readonly?: boolean;
}) {
    return (
        <Rating
            readonly={readonly}
            allowFraction
            initialValue={value}
            emptyClassName="flex"
            SVGclassName="inline-block"
            fillColor={"#01CB5F"}
            emptyColor={"#D4D6D9"}
            size={size}
            className={className}
            iconsCount={iconsCount}
            onClick={(value) => {
                setValue(value);
            }}
        />
    );
}

export default ThemedRating;