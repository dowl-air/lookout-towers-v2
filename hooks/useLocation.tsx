"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UserLocation = {
    latitude: number;
    longitude: number;
};

type LocationPermissionState = PermissionState | "unknown" | "unsupported";

type UseLocationOptions = {
    requestOnGranted?: boolean;
};

const LOCATION_GRANTED_EVENT = "lookout-location-granted";

const useLocation = ({ requestOnGranted = true }: UseLocationOptions = {}) => {
    const [location, setLocation] = useState<UserLocation | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [permissionState, setPermissionState] = useState<LocationPermissionState>("unknown");
    const [isLocating, setIsLocating] = useState(false);
    const hasRequestedGrantedLocation = useRef(false);

    const readCurrentPosition = useCallback((positionOptions?: PositionOptions) => {
        if (!navigator.geolocation) {
            const message = "Geolocation is not supported by your browser.";
            setPermissionState("unsupported");
            setError(message);
            return Promise.reject(new Error(message));
        }

        setIsLocating(true);

        return new Promise<UserLocation>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const nextLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };

                    setLocation(nextLocation);
                    setPermissionState("granted");
                    setError(null);
                    setIsLocating(false);
                    window.dispatchEvent(
                        new CustomEvent<UserLocation>(LOCATION_GRANTED_EVENT, {
                            detail: nextLocation,
                        })
                    );
                    resolve(nextLocation);
                },
                (positionError) => {
                    setError(positionError.message);
                    setIsLocating(false);

                    if (positionError.code === positionError.PERMISSION_DENIED) {
                        setPermissionState("denied");
                    }

                    reject(positionError);
                },
                positionOptions
            );
        });
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) {
            setPermissionState("unsupported");
            return;
        }

        let permissionStatus: PermissionStatus | null = null;
        let isMounted = true;

        if (!navigator.permissions?.query) {
            setPermissionState("unknown");
            return;
        }

        navigator.permissions
            .query({ name: "geolocation" })
            .then((status) => {
                if (!isMounted) return;

                permissionStatus = status;
                setPermissionState(status.state);

                status.onchange = () => {
                    setPermissionState(status.state);
                };
            })
            .catch(() => {
                if (isMounted) {
                    setPermissionState("unknown");
                }
            });

        return () => {
            isMounted = false;

            if (permissionStatus) {
                permissionStatus.onchange = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!requestOnGranted) return;

        const handleLocationGranted = (event: Event) => {
            const nextLocation = (event as CustomEvent<UserLocation>).detail;
            setPermissionState("granted");

            if (nextLocation) {
                setLocation(nextLocation);
            }
        };

        window.addEventListener(LOCATION_GRANTED_EVENT, handleLocationGranted);

        return () => {
            window.removeEventListener(LOCATION_GRANTED_EVENT, handleLocationGranted);
        };
    }, [requestOnGranted]);

    useEffect(() => {
        if (
            !requestOnGranted ||
            permissionState !== "granted" ||
            location ||
            isLocating ||
            hasRequestedGrantedLocation.current
        ) {
            return;
        }

        hasRequestedGrantedLocation.current = true;
        readCurrentPosition().catch(() => undefined);
    }, [isLocating, location, permissionState, readCurrentPosition, requestOnGranted]);

    const requestLocation = useCallback(
        (positionOptions?: PositionOptions) => readCurrentPosition(positionOptions),
        [readCurrentPosition]
    );

    return {
        location,
        error,
        permissionState,
        isLocating,
        isSupported: permissionState !== "unsupported",
        requestLocation,
    };
};

export default useLocation;
