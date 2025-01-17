"use client";

import useLocation from "@/hooks/useLocation";
import { useRouter } from "next/navigation";

const LocationSearch = () => {
    const { location } = useLocation();
    const router = useRouter();

    const handleClick = () => {
        if (location) {
            const searchParams = new URLSearchParams();
            searchParams.set("sort", "distance");
            searchParams.set("location", `${location.latitude},${location.longitude}`);
            router.push("/rozhledny" + "?" + searchParams.toString());
        } else {
            router.push("/mapa");
        }
    };

    return (
        <div className="btn text-base md:text-lg btn-primary" onClick={() => handleClick()}>
            Ukázat rozhledny v okolí
        </div>
    );
};

export default LocationSearch;
