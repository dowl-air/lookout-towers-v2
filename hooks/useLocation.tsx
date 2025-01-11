// hooks/useLocation.js
import { useState, useEffect } from "react";

const useLocation = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }

        const success = (position) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            setError(null);
        };

        const failure = (err) => {
            setError(err.message);
        };

        navigator.geolocation.getCurrentPosition(success, failure);
    }, []);

    return { location, error };
};

export default useLocation;
