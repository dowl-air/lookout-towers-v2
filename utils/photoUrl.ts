const getFirebaseStoragePath = (url: URL) => {
    try {
        if (url.hostname === "firebasestorage.googleapis.com") {
            const objectMarker = "/o/";
            const objectMarkerIndex = url.pathname.indexOf(objectMarker);
            if (objectMarkerIndex === -1) return null;

            return decodeURIComponent(url.pathname.slice(objectMarkerIndex + objectMarker.length));
        }

        if (url.hostname === "storage.googleapis.com") {
            const [, , ...objectPathParts] = url.pathname.split("/");
            if (!objectPathParts.length) return null;

            return decodeURIComponent(objectPathParts.join("/"));
        }

        return null;
    } catch {
        return null;
    }
};

export const isSamePhotoUrl = (left: string, right: string) => {
    if (left === right) return true;

    try {
        const leftUrl = new URL(left);
        const rightUrl = new URL(right);
        const leftStoragePath = getFirebaseStoragePath(leftUrl);
        const rightStoragePath = getFirebaseStoragePath(rightUrl);

        if (leftStoragePath && rightStoragePath) {
            return leftStoragePath === rightStoragePath;
        }

        return leftUrl.origin === rightUrl.origin && leftUrl.pathname === rightUrl.pathname;
    } catch {
        return false;
    }
};
