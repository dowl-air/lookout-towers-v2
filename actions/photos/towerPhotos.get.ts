import { getPhoto } from "@/actions/photos/towerPhoto.get";

export const getPhotos = async (photoIds: string[]) => {
    const promises = photoIds.map(async (photoId) => {
        const photo = await getPhoto(photoId);
        return photo;
    });
    return await Promise.all(promises);
};
